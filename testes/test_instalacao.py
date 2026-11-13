"""Regressoes de compatibilidade; nao certificam um Windows nem renderizam cards."""
import argparse
import importlib.util
import runpy
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('instalador', ROOT / 'instalar.py')
installer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(installer)


def default_cp1252(original):
    def read(path, *args, **kwargs):
        if not args and 'encoding' not in kwargs:
            kwargs['encoding'] = 'cp1252'
        return original(path, *args, **kwargs)
    return read


class CompatibilityTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='ninja-compat-')
        self.addCleanup(self.temp.cleanup)
        self.project = Path(self.temp.name).resolve() / 'projeto com acentos ação'
        self.project.mkdir()
        self.state = self.project / installer.STATE

    def package(self):
        shutil.copytree(ROOT / 'v5', self.state / 'pacote')
        installer.write(self.project / installer.LOCK, {
            'integritySha256': installer.sha(self.state / 'pacote/arquivos.sha256.json'),
            'node': sys.executable,
        })

    def test_generator_reads_accented_manifest_under_cp1252(self):
        self.package()
        installer.write_wrapper(self.state)
        with patch.object(Path, 'read_text', default_cp1252(Path.read_text)), \
             patch.object(subprocess, 'call', return_value=0) as render:
            with self.assertRaises(SystemExit) as result:
                runpy.run_path(str(self.state / 'gerar.py'), run_name='__main__')
        self.assertEqual(result.exception.code, 0)
        render.assert_called_once()
        self.assertEqual(render.call_args.args[0][1], str(self.state / 'pacote/cards/renderizar.cjs'))

    def test_generator_still_rejects_modified_package(self):
        self.package()
        installer.write_wrapper(self.state)
        target = self.state / 'pacote/cards/diagramação-ninja-com-lead.md'
        target.write_bytes(target.read_bytes() + b'\nmodified')
        with patch.object(subprocess, 'call') as render:
            with self.assertRaisesRegex(SystemExit, 'Pacote alterado ou incompleto'):
                runpy.run_path(str(self.state / 'gerar.py'), run_name='__main__')
        render.assert_not_called()

    def args(self):
        return argparse.Namespace(project=str(self.project), source=str(ROOT),
                                  node=sys.executable, browser=None, npm_cli=str(ROOT / "fixture-npm-cli.js"), ref='main')

    def test_reinstall_refreshes_old_generator_without_reinstalling_dependencies(self):
        self.package()
        (self.state / 'gerar.py').write_text('old wrapper', encoding='utf-8')
        (self.project / 'AGENTS.md').write_text('Instruções existentes\n', encoding='utf-8')
        with patch.object(installer, 'node_command', return_value=sys.executable), \
             patch.object(installer, 'smoke', return_value=[]) as smoke, \
             patch.object(installer, 'run') as run:
            result = installer.install(self.args())
        self.assertEqual(result['status'], 'pronto')
        smoke.assert_called_once()
        run.assert_not_called()
        self.assertIn('encoding="utf-8"', (self.state / 'gerar.py').read_text(encoding='utf-8'))
        self.assertTrue((self.project / 'AGENTS.md').read_text(encoding='utf-8').startswith('Instruções existentes'))

    def test_failed_reinstall_preserves_old_generator_and_lock(self):
        self.package()
        wrapper = self.state / 'gerar.py'
        wrapper.write_bytes(b'old wrapper')
        lock = (self.project / installer.LOCK).read_bytes()
        with patch.object(installer, 'node_command', return_value=sys.executable), \
             patch.object(installer, 'smoke', side_effect=RuntimeError('browser blocked')):
            with self.assertRaisesRegex(RuntimeError, 'browser blocked'):
                installer.install(self.args())
        self.assertEqual(wrapper.read_bytes(), b'old wrapper')
        self.assertEqual((self.project / installer.LOCK).read_bytes(), lock)

    def test_fresh_install_creates_corrected_generator(self):
        with patch.object(installer, 'node_command', return_value=sys.executable), \
             patch.object(installer, 'smoke', return_value=[]), \
             patch.object(installer, 'run'):
            result = installer.install(self.args())
        self.assertEqual(result['status'], 'pronto')
        self.assertIn('encoding="utf-8"', (self.state / 'gerar.py').read_text(encoding='utf-8'))
        installer.verify(self.state / 'pacote', installer.read(ROOT / 'ATIVO.json')['integritySha256'])

    def test_git_checkout_preserves_all_package_hashes_with_autocrlf_true(self):
        repo = Path(self.temp.name) / 'repo'
        repo.mkdir()
        shutil.copytree(ROOT / 'v5', repo / 'v5')
        shutil.copy2(ROOT / '.gitattributes', repo / '.gitattributes')
        def git(*args):
            return subprocess.run(['git', '-C', str(repo), *args], check=True, capture_output=True)
        git('init', '--quiet')
        git('-c', 'core.autocrlf=false', 'add', '.')
        git('-c', 'user.name=NINJA tests', '-c', 'user.email=tests@example.invalid',
            '-c', 'commit.gpgsign=false', 'commit', '--quiet', '-m', 'Fixture')
        for mode in ('true', 'false', 'input'):
            git('config', 'core.autocrlf', mode)
            shutil.rmtree(repo / 'v5')
            git('checkout-index', '--all', '--force')
            installer.verify(repo / 'v5', installer.read(ROOT / 'ATIVO.json')['integritySha256'])


if __name__ == '__main__':
    unittest.main()
