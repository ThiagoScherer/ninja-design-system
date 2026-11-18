"""Regressões de compatibilidade e recuperação; não exige rede/navegador."""
import argparse
import importlib.util
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('installer', ROOT / 'instalar.py')
i = importlib.util.module_from_spec(spec)
spec.loader.exec_module(i)


class CompatibilityTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='ninja testes acentuação ')
        self.base = Path(self.temp.name)

    def tearDown(self):
        self.temp.cleanup()

    def test_json_utf8_bom_and_crlf(self):
        path = self.base / 'entrada.json'
        path.write_bytes(b'\xef\xbb\xbf' + '{\r\n"chamada":"Mobilização indígena"\r\n}'.encode('utf-8'))
        self.assertEqual(i.read(path)['chamada'], 'Mobilização indígena')

    def test_write_lf_bytes(self):
        path = self.base / 'json.json'
        i.write(path, {'chamada': 'São Paulo'})
        self.assertNotIn(b'\r', path.read_bytes())
        self.assertIn('São Paulo'.encode('utf-8'), path.read_bytes())

    def test_windows_npm_cli_with_spaces(self):
        node = self.base / 'Node oficial' / 'node.exe'
        cli = node.parent / 'node_modules/npm/bin/npm-cli.js'
        cli.parent.mkdir(parents=True)
        cli.touch()
        node.touch()
        self.assertEqual(i.npm_command(str(node)), [str(node), str(cli)])

    def test_unix_npm_cli(self):
        node = self.base / 'node/bin/node'
        cli = node.parent.parent / 'lib/node_modules/npm/bin/npm-cli.js'
        cli.parent.mkdir(parents=True)
        cli.touch()
        self.assertEqual(i.npm_command(str(node)), [str(node), str(cli)])

    def test_missing_explicit_npm(self):
        with self.assertRaisesRegex(RuntimeError, 'não existe'):
            i.npm_command('node', self.base / 'ausente.js')

    def test_missing_explicit_browser(self):
        with self.assertRaisesRegex(RuntimeError, 'não existe'):
            i.browser_command(str(self.base / 'Chrome inexistente'))

    def test_managed_browser_explicit(self):
        self.assertIsNone(i.browser_command('chromium'))

    def test_inherited_browser_override_removed(self):
        with patch.dict(os.environ, {'NINJA_CHROME_PATH': '/ausente'}):
            self.assertNotIn('NINJA_CHROME_PATH', i.env_for(self.base))

    def source(self):
        source = self.base / 'fonte'
        package = source / 'v5'
        package.mkdir(parents=True)
        for name in ['package.json', 'package-lock.json']:
            path = package / 'cards' / name
            path.parent.mkdir(exist_ok=True)
            i.write(path, {})
        i.write(package / 'manifesto.json', {'version': i.VERSION})
        i.write(package / 'arquivos.sha256.json', {'files': {
            p.relative_to(package).as_posix(): i.sha(p) for p in package.rglob('*') if p.is_file()}})
        i.write(source / 'ATIVO.json', {'activeRelease': 'v5', 'version': i.VERSION,
                                      'integritySha256': i.sha(package / 'arquivos.sha256.json')})
        return source

    def test_corruption_still_rejected(self):
        source = self.source()
        (source / 'v5/cards/package.json').write_bytes(b'{}\r\n')
        with self.assertRaisesRegex(RuntimeError, 'Integridade inválida'):
            i.verify(source / 'v5')

    def test_unexpected_file_rejected(self):
        source = self.source()
        (source / 'v5/extra.txt').touch()
        with self.assertRaisesRegex(RuntimeError, 'inesperados'):
            i.verify(source / 'v5')

    def test_final_path_failure_restores_previous_installation(self):
        source = self.source()
        project = self.base / 'projeto São Paulo'
        old = project / i.STATE
        old.mkdir(parents=True)
        (old / 'marcador.txt').write_text('RC1 íntegra')
        lock = project / i.LOCK
        lock.write_bytes(b'{"version":"5.0.0-rc.1","integritySha256":"anterior"}')
        original_lock = lock.read_bytes()
        docs = project / 'AGENTS.md'
        docs.write_bytes('Instruções da equipe\r\n'.encode('utf-8'))
        original_docs = docs.read_bytes()
        args = argparse.Namespace(project=str(project), source=str(source), ref='main',
                                  node='node', npm_cli=None, browser=None)
        calls = []
        def smoke(state, node, browser=None, wrapper=False):
            calls.append((state, wrapper))
            if wrapper:
                self.assertEqual(state, old.resolve())
                raise RuntimeError('falha simulada depois da mudança de pasta')
            return []
        with patch.object(i, 'node_command', return_value='node'), \
             patch.object(i, 'npm_command', return_value=['node', 'npm-cli.js']), \
             patch.object(i, 'browser_command', return_value='/chrome'), \
             patch.object(i, 'run', return_value='24'), \
             patch.object(i, 'smoke', side_effect=smoke):
            with self.assertRaisesRegex(RuntimeError, 'falha simulada'):
                i.install(args)
        self.assertEqual(len(calls), 2)
        self.assertEqual((old / 'marcador.txt').read_text(), 'RC1 íntegra')
        self.assertEqual(lock.read_bytes(), original_lock)
        self.assertEqual(docs.read_bytes(), original_docs)
        self.assertFalse((project / 'CLAUDE.md').exists())
        self.assertFalse(list(project.glob('.ninja-instalacao-*')))
        self.assertFalse(list(project.glob(i.STATE + '.anterior-*')))
        self.assertEqual(i.read(project / '.ninja-design-system-diagnostico.json')['status'], 'falhou')

    def test_success_requires_final_wrapper_and_preserves_old_version(self):
        source = self.source()
        project = self.base / 'atualização'
        old = project / i.STATE
        old.mkdir(parents=True)
        (old / 'versao.txt').write_text('RC1')
        i.write(project / i.LOCK, {'version': '5.0.0-rc.1', 'integritySha256': 'anterior'})
        args = argparse.Namespace(project=str(project), source=str(source), ref='main',
                                  node='node', npm_cli=None, browser=None)
        calls = []
        def smoke(state, node, browser=None, wrapper=False):
            calls.append(wrapper)
            if wrapper:
                self.assertEqual(i.read(project / i.LOCK)['status'], 'em-validacao')
                self.assertTrue((state / 'gerar.py').is_file())
            return [{'arquivo': 'evidencia.png'}]
        with patch.object(i, 'node_command', return_value='node'), \
             patch.object(i, 'npm_command', return_value=['node', 'npm-cli.js']), \
             patch.object(i, 'browser_command', return_value='/chrome'), \
             patch.object(i, 'run', return_value='24'), \
             patch.object(i, 'smoke', side_effect=smoke):
            result = i.install(args)
        self.assertEqual(calls, [False, True])
        self.assertEqual(i.read(project / i.LOCK)['status'], 'pronto')
        self.assertEqual((Path(result['backup']) / 'versao.txt').read_text(), 'RC1')

    def test_first_install_failure_leaves_no_ready_lock(self):
        source = self.source()
        project = self.base / 'novo projeto'
        args = argparse.Namespace(project=str(project), source=str(source), ref='main',
                                  node='node', npm_cli=None, browser=None)
        def smoke(state, node, browser=None, wrapper=False):
            if wrapper:
                raise RuntimeError('falha final')
            return []
        with patch.object(i, 'node_command', return_value='node'), \
             patch.object(i, 'npm_command', return_value=['node', 'npm-cli.js']), \
             patch.object(i, 'browser_command', return_value='/chrome'), \
             patch.object(i, 'run', return_value='24'), \
             patch.object(i, 'smoke', side_effect=smoke):
            with self.assertRaisesRegex(RuntimeError, 'falha final'):
                i.install(args)
        self.assertFalse((project / i.LOCK).exists())
        self.assertFalse((project / i.STATE).exists())

    def test_instructions_preserved_without_duplicate(self):
        path = self.base / 'AGENTS.md'
        path.write_text('Regra da equipe: não reescrever conteúdo\n', encoding='utf-8')
        i.remember(self.base)
        i.remember(self.base)
        content = path.read_text(encoding='utf-8')
        self.assertIn('Regra da equipe: não reescrever conteúdo', content)
        self.assertEqual(content.count('<!-- NINJA-DS:BEGIN -->'), 1)

    def wrapper_fixture(self):
        state = self.base / i.STATE
        package = state / 'pacote'
        (package / 'cards').mkdir(parents=True)
        script = package / 'cards/renderizar.cjs'
        # Python faz o papel do processo filho, sem navegador/rede.
        i.write_text(script, 'import sys\nprint("PROCESSO FILHO OK")\n')
        unicode_path = package / 'informação.json'
        i.write(unicode_path, {'conteúdo': 'São Paulo'})
        manifest = package / 'arquivos.sha256.json'
        i.write(manifest, {'files': {p.relative_to(package).as_posix(): i.sha(p)
                                   for p in package.rglob('*') if p.is_file()}})
        i.write(self.base / i.LOCK, {'integritySha256': i.sha(manifest), 'node': sys.executable})
        i.write_text(state / 'gerar.py', i.WRAPPER)
        return state

    def run_wrapper(self, state):
        env = os.environ.copy()
        env.update(PYTHONUTF8='0', PYTHONCOERCECLOCALE='0', LC_ALL='C')
        return subprocess.run([sys.executable, state / 'gerar.py'], env=env,
                              stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                              encoding='utf-8', errors='replace')

    def test_generated_wrapper_reads_utf8_manifest(self):
        state = self.wrapper_fixture()
        result = self.run_wrapper(state)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('PROCESSO FILHO OK', result.stdout)

    def test_generated_wrapper_rejects_corruption(self):
        state = self.wrapper_fixture()
        (state / 'pacote/informação.json').write_bytes(b'{}')
        result = self.run_wrapper(state)
        self.assertNotEqual(result.returncode, 0)
        self.assertNotIn('PROCESSO FILHO OK', result.stdout)

    def test_generated_wrapper_rejects_extra_file(self):
        state = self.wrapper_fixture()
        (state / 'pacote/extra.txt').touch()
        result = self.run_wrapper(state)
        self.assertNotEqual(result.returncode, 0)
        self.assertNotIn('PROCESSO FILHO OK', result.stdout)

    @unittest.skipUnless(shutil.which('git'), 'Git não disponível')
    def test_git_windows_line_endings_preserve_signed_bytes(self):
        repo = self.base / 'repo'
        repo.mkdir()
        shutil.copy2(ROOT / '.gitattributes', repo / '.gitattributes')
        content = 'Mobilização e educação\nsegunda linha\n'.encode('utf-8')
        (repo / 'texto.json').write_bytes(content)
        def git(*args):
            subprocess.run(['git', *args], cwd=repo, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        git('init')
        git('config', 'core.autocrlf', 'true')
        git('add', '.')
        git('-c', 'user.name=Teste', '-c', 'user.email=teste@example.invalid', 'commit', '-m', 'fixture')
        (repo / 'texto.json').unlink()
        git('checkout', '--', 'texto.json')
        self.assertEqual((repo / 'texto.json').read_bytes(), content)


if __name__ == '__main__':
    unittest.main(verbosity=2)
