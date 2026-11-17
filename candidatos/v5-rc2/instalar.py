#!/usr/bin/env python3
"""Instala o candidato completo; só confirma após gerar na pasta definitiva."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
import uuid
from datetime import datetime, timezone

REPO = 'https://github.com/ThiagoScherer/ninja-design-system.git'
VERSION = '5.0.0-rc.2'
STATE = '.ninja-design-system'
LOCK = '.ninja-design-system.lock.json'


def fail(message):
    raise RuntimeError(message)


def read(path):
    return json.loads(path.read_text(encoding='utf-8-sig'))


def write_text(path, content):
    with path.open('w', encoding='utf-8', newline='\n') as stream:
        stream.write(content)


def write(path, value):
    write_text(path, json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def run(args, cwd=None, env=None, timeout=180):
    try:
        result = subprocess.run([str(x) for x in args], cwd=cwd, env=env,
                                stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                                encoding='utf-8', errors='replace', timeout=timeout)
    except subprocess.TimeoutExpired:
        fail('Tempo limite excedido em ' + Path(str(args[0])).name + '; verificar rede e dependências')
    except OSError as error:
        fail('Não foi possível executar ' + Path(str(args[0])).name + ': ' + str(error))
    if result.returncode:
        log = Path(cwd or Path.cwd()) / 'instalacao-erro.log'
        write_text(log, result.stdout)
        fail('Falha em ' + Path(str(args[0])).name + '; detalhes no registro local ' + str(log))
    return result.stdout.strip()


def verify(package, expected=None):
    manifest = package / 'arquivos.sha256.json'
    if expected and sha(manifest) != expected:
        fail('Manifesto de integridade diverge; obter novamente o pacote oficial sem conversão de finais de linha')
    data = read(manifest)
    if any(p.is_symlink() for p in package.rglob('*')):
        fail('Links simbólicos não são aceitos no pacote')
    actual = {p.relative_to(package).as_posix() for p in package.rglob('*') if p.is_file() and p != manifest}
    if actual != set(data['files']):
        fail('Pacote incompleto ou contém arquivos inesperados')
    for rel, digest in data['files'].items():
        item = Path(rel)
        if item.is_absolute() or '..' in item.parts or '\\' in rel or ':' in rel:
            fail('Caminho inválido no pacote')
        path = package / item
        if not path.is_file() or path.is_symlink() or sha(path) != digest:
            fail('Integridade inválida: ' + rel + '; obter o pacote sem converter LF/CRLF')
    return data


def node_command(args):
    command = args.node or shutil.which('node')
    if not command:
        fail('Node.js 20+ ausente. O agente precisa preparar o runtime oficial e repetir a instalação')
    path = Path(command).expanduser().resolve()
    if int(run([path, '-p', 'process.versions.node.split(".")[0]'])) < 20:
        fail('Node.js 20+ necessário')
    return str(path)


def npm_command(node, explicit=None):
    # Executar o CLI JavaScript com o mesmo Node evita npm.cmd/shell no Windows.
    if explicit:
        path = Path(explicit).expanduser().resolve()
        if not path.is_file():
            fail('npm CLI informado não existe')
        return [node, str(path)]
    parent = Path(node).parent
    candidates = [parent / 'node_modules/npm/bin/npm-cli.js',
                  parent.parent / 'lib/node_modules/npm/bin/npm-cli.js']
    located = shutil.which('npm.cmd' if os.name == 'nt' else 'npm')
    if located:
        resolved = Path(located).resolve()
        candidates.extend([resolved, resolved.parent / 'node_modules/npm/bin/npm-cli.js'])
    for path in candidates:
        if path.is_file() and path.suffix == '.js':
            return [node, str(path)]
    fail('npm CLI não localizado. Preparar o npm oficial ou informar --npm-cli /caminho/npm-cli.js')


def browser_command(explicit=None):
    if explicit == 'chromium':
        return None
    if explicit:
        path = Path(explicit).expanduser().resolve()
        if not path.is_file():
            fail('Navegador informado não existe: ' + str(path))
        return str(path)
    candidates = []
    if sys.platform == 'darwin':
        candidates = [Path('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),
                      Path.home() / 'Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
                      Path('/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge')]
    elif os.name == 'nt':
        for key in ['PROGRAMFILES', 'PROGRAMFILES(X86)', 'LOCALAPPDATA']:
            if os.environ.get(key):
                base = Path(os.environ[key])
                candidates.extend([base / 'Google/Chrome/Application/chrome.exe',
                                   base / 'Microsoft/Edge/Application/msedge.exe'])
    else:
        candidates = [Path(p) for name in ['google-chrome', 'chromium', 'chromium-browser']
                      for p in [shutil.which(name)] if p]
    return next((str(p.resolve()) for p in candidates if p.is_file()), None)


def env_for(state, node=None):
    env = os.environ.copy()
    env.pop('NINJA_CHROME_PATH', None)
    env['NODE_PATH'] = str(state / 'runtime/node_modules')
    env['PLAYWRIGHT_BROWSERS_PATH'] = str(state / 'runtime/browsers')
    env['PYTHONUTF8'] = '1'
    env['PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT'] = '30000'
    if node:
        env['PATH'] = str(Path(node).parent) + os.pathsep + env.get('PATH', '')
    return env


def smoke(state, node, browser=None, wrapper=False):
    env = env_for(state, node)
    if browser:
        env['NINJA_CHROME_PATH'] = browser
    evidence = state / 'evidencias'
    evidence.mkdir(exist_ok=True)
    outputs = []
    for variant in ['com-lead', 'sem-lead']:
        target = evidence / (variant + '.png')
        entry = state / ('pacote/cards/testes/media-' + variant + '.json')
        command = ([sys.executable, state / 'gerar.py'] if wrapper
                   else [node, state / 'pacote/cards/renderizar.cjs'])
        run(command + ['criar', entry, target], cwd=state, env=env)
        metadata = read(Path(str(target) + '.ds.json'))
        if metadata['alertas'] or not metadata['fonts'] or not all(f['loaded'] for f in metadata['fonts']):
            fail('Autoteste não passou: fontes ou geometria')
        if metadata['dsVersion'] != VERSION:
            fail('Autoteste usou versão inesperada')
        outputs.append({'arquivo': target.relative_to(state).as_posix(),
                        'sha256': sha(target), 'template': metadata['template']})
    return outputs


def remember(project):
    start, end = '<!-- NINJA-DS:BEGIN -->', '<!-- NINJA-DS:END -->'
    block = start + '\n## Cards NINJA\n\nPara cards de notícia NINJA e afluentes, ler `NINJA-DESIGN-SYSTEM.md` e usar a instalação em `.ninja-design-system`. Não reconstruir o template por aproximação. Esta orientação se aplica somente aos cards solicitados pelo usuário\n' + end
    guide = '# Cards com o NINJA Design System\n\nA versão local e a integridade estão em `.ninja-design-system.lock.json`. Antes de criar o primeiro card de um atendimento, consultar o ATIVO.json do repositório autorizado; se não conseguir, informar a versão local sem alegar que é a mais recente. Atualizar com o instalador completo quando houver versão posterior. Durante o teste de um candidato local, não substituir silenciosamente a RC2 pela RC1 ainda indicada no remoto\n\nLer a ficha da marca e `.ninja-design-system/pacote/cards/README.md`. Escolher quebras e corpo com fontes oficiais e revisar visualmente. Executar `python .ninja-design-system/gerar.py criar entrada.json card.png` usando o mesmo Python 3 da instalação (`python3` ou `py -3`, conforme o ambiente). Não substituir fontes, logos ou espaçamentos e não reescrever o conteúdo sem autorização\n\nRepositório: https://github.com/ThiagoScherer/ninja-design-system. Preservar instruções próprias fora do bloco NINJA\n'
    write_text(project / 'NINJA-DESIGN-SYSTEM.md', guide)
    for name in ['AGENTS.md', 'CLAUDE.md']:
        path = project / name
        old = path.read_text(encoding='utf-8-sig') if path.exists() else ''
        new = (re.sub(re.escape(start) + '.*?' + re.escape(end), lambda _: block, old, flags=re.S)
               if start in old and end in old else old + ('\n\n' if old else '') + block + '\n')
        if new != old:
            write_text(path, new)


WRAPPER = '''#!/usr/bin/env python3
import hashlib,json,os,subprocess,sys
from pathlib import Path
state=Path(__file__).resolve().parent
load=lambda p:json.loads(p.read_text(encoding="utf-8-sig"))
lock=load(state.parent/".ninja-design-system.lock.json")
manifest=state/"pacote/arquivos.sha256.json"
if hashlib.sha256(manifest.read_bytes()).hexdigest()!=lock["integritySha256"]:raise SystemExit("Manifesto alterado; atualizar o DS")
files=load(manifest)["files"]
actual={p.relative_to(state/"pacote").as_posix() for p in (state/"pacote").rglob("*") if p.is_file() and p!=manifest}
if actual!=set(files):raise SystemExit("Pacote incompleto ou contém arquivos inesperados")
for name,digest in files.items():
 if Path(name).is_absolute() or ".." in Path(name).parts or "\\\\" in name or ":" in name:raise SystemExit("Caminho inválido")
 p=state/"pacote"/name
 if not p.is_file() or p.is_symlink() or hashlib.sha256(p.read_bytes()).hexdigest()!=digest:raise SystemExit("Pacote alterado ou incompleto: "+name)
env=os.environ.copy();env.pop("NINJA_CHROME_PATH",None)
env["NODE_PATH"]=str(state/"runtime/node_modules");env["PLAYWRIGHT_BROWSERS_PATH"]=str(state/"runtime/browsers");env["PYTHONUTF8"]="1"
if lock.get("browser"):env["NINJA_CHROME_PATH"]=lock["browser"]
raise SystemExit(subprocess.call([lock["node"],str(state/"pacote/cards/renderizar.cjs"),*sys.argv[1:]],env=env))
'''


def install(args):
    project = Path(args.project).expanduser().resolve()
    project.mkdir(parents=True, exist_ok=True)
    diagnostic = {'version': VERSION, 'status': 'em-andamento', 'stage': 'runtime',
                  'platform': sys.platform, 'python': sys.version.split()[0],
                  'checkedAt': datetime.now(timezone.utc).isoformat()}
    try:
        node = node_command(args)
        diagnostic['node'] = run([node, '--version'])
        browser = browser_command(args.browser)
        diagnostic['browserMode'] = 'existente' if browser else 'chromium-gerenciado'
        with tempfile.TemporaryDirectory(prefix='ninja-fonte-') as temp:
            diagnostic['stage'] = 'obter-pacote'
            if args.source:
                source = Path(args.source).expanduser().resolve()
            else:
                source = Path(temp) / 'repo'
                git = shutil.which('git')
                if not git:
                    fail('Obter o snapshot autorizado e usar --source, ou preparar Git')
                env = os.environ.copy()
                env['GIT_TERMINAL_PROMPT'] = '0'
                # -text no repositório evita CRLF mesmo com core.autocrlf=true.
                run([git, '-c', 'core.autocrlf=false', 'clone', '--depth', '1', '--branch', args.ref, REPO, source], cwd=project, env=env)
            active = read(source / 'ATIVO.json')
            release = active['activeRelease']
            if release != 'v5' or active['version'] != VERSION:
                fail('Instalador e versão ativa divergem; obter o instalador do mesmo snapshot')
            origin = source / release
            diagnostic['stage'] = 'integridade'
            verify(origin, active['integritySha256'])
            if read(origin / 'manifesto.json')['version'] != VERSION:
                fail('Versão do pacote diverge do ATIVO.json')
            commit = run(['git', '-C', source, 'rev-parse', 'HEAD']) if (source / '.git').exists() else None
            installed, lock = project / STATE, project / LOCK
            if installed.exists() and lock.exists():
                previous = read(lock)
                if previous.get('integritySha256') == active['integritySha256']:
                    verify(installed / 'pacote', active['integritySha256'])
                    # Reutilizar o runtime registrado evita inutilizar uma instalação sem npm no PATH.
                    selected = browser if args.browser else previous.get('browser')
                    old_lock = lock.read_bytes()
                    try:
                        previous.update(node=node, browser=selected)
                        write(lock, previous)
                        diagnostic['stage'] = 'revalidar-instalacao'
                        outputs = smoke(installed, node, selected, wrapper=True)
                        previous.update(checkedAt=diagnostic['checkedAt'], evidencias=outputs, status='pronto')
                        write(lock, previous)
                    except Exception:
                        lock.write_bytes(old_lock)
                        raise
                    remember(project)
                    diagnostic['status'] = 'pronto'
                    return {'status': 'pronto', 'version': VERSION, 'atualizacao': 'já atualizada; geração reconferida', 'lock': str(lock)}
            staging = Path(tempfile.mkdtemp(prefix='.ninja-instalacao-', dir=project))
            backup = None
            old_lock = lock.read_bytes() if lock.exists() else None
            old_docs = {name: (project / name).read_bytes() if (project / name).exists() else None
                        for name in ['AGENTS.md', 'CLAUDE.md', 'NINJA-DESIGN-SYSTEM.md']}
            activated = False
            try:
                shutil.copytree(origin, staging / 'pacote')
                runtime = staging / 'runtime'
                runtime.mkdir()
                for name in ['package.json', 'package-lock.json']:
                    shutil.copy2(staging / 'pacote/cards' / name, runtime / name)
                env = env_for(staging, node)
                env.update(npm_config_cache=str(Path(args.npm_cache).expanduser().resolve()) if getattr(args, 'npm_cache', None) else str(runtime / 'cache'),
                           npm_config_update_notifier='false', npm_config_fetch_retries='1',
                           npm_config_fetch_retry_mintimeout='1000', npm_config_fetch_retry_maxtimeout='5000',
                           npm_config_fetch_timeout='30000')
                diagnostic['stage'] = 'npm'
                npm = npm_command(node, args.npm_cli)
                diagnostic['npm'] = run(npm + ['--version'], cwd=runtime, env=env)
                run(npm + ['ci', '--ignore-scripts', '--no-audit', '--no-fund'], cwd=runtime, env=env)
                diagnostic['stage'] = 'navegador'
                if not browser:
                    run([node, runtime / 'node_modules/playwright/cli.js', 'install', 'chromium'], cwd=runtime, env=env)
                diagnostic['stage'] = 'geracao-preliminar'
                smoke(staging, node, browser)
                write_text(staging / 'gerar.py', WRAPPER)
                state = {'schema': 'ninja-design-system/installation', 'version': VERSION,
                         'release': release, 'status': 'em-validacao', 'repository': REPO,
                         'sourceCommit': commit, 'integritySha256': active['integritySha256'],
                         'node': node, 'browser': browser, 'installedAt': diagnostic['checkedAt'],
                         'scope': 'cards-de-noticia', 'renderer': STATE + '/pacote/cards/renderizar.cjs'}
                if installed.exists():
                    backup = project / (STATE + '.anterior-' + uuid.uuid4().hex[:8])
                    installed.rename(backup)
                staging.rename(installed)
                activated = True
                write(lock, state)
                diagnostic['stage'] = 'geracao-na-pasta-definitiva'
                outputs = smoke(installed, node, browser, wrapper=True)
                remember(project)
                state.update(status='pronto', evidencias=outputs)
                tmp_lock = project / (LOCK + '.tmp')
                write(tmp_lock, state)
                os.replace(tmp_lock, lock)
                diagnostic['status'] = 'pronto'
                return {'status': 'pronto', 'version': VERSION, 'lock': str(lock),
                        'backup': str(backup) if backup else None, 'evidencias': outputs}
            except Exception:
                log_root = installed if activated else staging
                logs = list(log_root.rglob('instalacao-erro.log')) if log_root.exists() else []
                if logs:
                    shutil.copy2(logs[-1], project / '.ninja-design-system-erro.log')
                    diagnostic['log'] = '.ninja-design-system-erro.log'
                if activated and installed.exists():
                    shutil.rmtree(installed)
                if backup and backup.exists():
                    backup.rename(installed)
                if activated:
                    if old_lock is None:
                        lock.unlink(missing_ok=True)
                    else:
                        lock.write_bytes(old_lock)
                    for name, content in old_docs.items():
                        path = project / name
                        if content is None:
                            path.unlink(missing_ok=True)
                        else:
                            path.write_bytes(content)
                raise
            finally:
                if staging.exists():
                    shutil.rmtree(staging)
                (project / (LOCK + '.tmp')).unlink(missing_ok=True)
    except Exception as error:
        diagnostic['status'] = 'falhou'
        diagnostic['error'] = str(error)
        if diagnostic.get('log'):
            diagnostic['error'] = 'Falha em ' + diagnostic['stage'] + '; consulte ' + diagnostic['log']
        raise
    finally:
        write(project / '.ninja-design-system-diagnostico.json', diagnostic)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--project', default='.')
    parser.add_argument('--source')
    parser.add_argument('--ref', default='main')
    parser.add_argument('--node')
    parser.add_argument('--npm-cli')
    parser.add_argument('--npm-cache', help='Cache npm existente; npm ci continua verificando o lock e a integridade')
    parser.add_argument('--browser', help='Executável Chrome/Edge ou chromium para download gerenciado')
    args = parser.parse_args()
    for stream in [sys.stdout, sys.stderr]:
        if hasattr(stream, 'reconfigure'):
            stream.reconfigure(encoding='utf-8', errors='replace')
    try:
        print(json.dumps(install(args), ensure_ascii=False, indent=2))
    except Exception as error:
        diagnostic_path = Path(args.project).resolve() / '.ninja-design-system-diagnostico.json'
        try:
            detail = read(diagnostic_path).get('error', str(error))
        except Exception:
            detail = str(error)
        print('DS não confirmado: ' + detail, file=sys.stderr)
        print('Diagnóstico persistente: ' + str(diagnostic_path), file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
