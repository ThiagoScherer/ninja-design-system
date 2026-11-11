#!/usr/bin/env python3
"""Instala/atualiza o DS para o agente; nenhuma dependência Python externa."""
import argparse,hashlib,json,os,re,shutil,subprocess,sys,tempfile,uuid
from datetime import datetime,timezone
from pathlib import Path
REPO='https://github.com/ThiagoScherer/ninja-design-system.git'
STATE='.ninja-design-system'
LOCK='.ninja-design-system.lock.json'
def fail(msg):raise RuntimeError(msg)
def read(p):return json.loads(p.read_text(encoding='utf-8'))
def write(p,j):p.write_text(json.dumps(j,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def run(args,cwd=None,env=None):
 result=subprocess.run([str(x) for x in args],cwd=cwd,env=env,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True)
 if result.returncode:
  # Logs remain local; do not echo credentials or authenticated URLs
  log=Path(cwd or Path.cwd())/'instalacao-erro.log';log.write_text(result.stdout,encoding='utf-8')
  fail('Não foi possível concluir '+Path(str(args[0])).name+'. Detalhes no registro local '+str(log))
 return result.stdout.strip()
def verify(package,expected=None):
 manifest=package/'arquivos.sha256.json'
 if expected and sha(manifest)!=expected:fail('Manifesto de integridade diverge da versão indicada')
 data=read(manifest)
 if any(p.is_symlink() for p in package.rglob('*')):fail('Links simbólicos não são aceitos no pacote')
 actual={str(p.relative_to(package)).replace(os.sep,'/') for p in package.rglob('*') if p.is_file() and p!=manifest}
 if actual!=set(data['files']):fail('Pacote incompleto ou contém arquivos inesperados')
 for rel,digest in data['files'].items():
  item=Path(rel)
  if item.is_absolute() or '..' in item.parts:fail('Caminho inválido no pacote')
  p=package/item
  if p.is_symlink() or not p.is_file() or sha(p)!=digest:fail('Integridade inválida: '+rel)
 return data
def node_command(args):
 node=args.node or shutil.which('node')
 if not node:fail('O agente precisa preparar Node.js 20+ pelo canal oficial e executar novamente')
 if int(run([node,'-p','process.versions.node.split(".")[0]']))<20:fail('Node.js 20+ necessário')
 return node
def env_for(state):
 env=os.environ.copy();env['NODE_PATH']=str(state/'runtime/node_modules');env['PLAYWRIGHT_BROWSERS_PATH']=str(state/'runtime/browsers');return env
def smoke(state,node,browser=None):
 env=env_for(state)
 if browser:env['NINJA_CHROME_PATH']=str(Path(browser).resolve())
 evidence=state/'evidencias';evidence.mkdir(exist_ok=True)
 outputs=[]
 for variant in ['com-lead','sem-lead']:
  target=evidence/(variant+'.png')
  run([node,state/'pacote/cards/renderizar.cjs','criar',state/f'pacote/cards/testes/media-{variant}.json',target],cwd=state,env=env)
  metadata=read(Path(str(target)+'.ds.json'))
  if metadata['alertas'] or not all(f['loaded'] for f in metadata['fonts']):fail('Autoteste não passou')
  outputs.append({'arquivo':str(target.relative_to(state)),'sha256':sha(target),'template':metadata['template']})
 return outputs
def remember(project):
 start='<!-- NINJA-DS:BEGIN -->';end='<!-- NINJA-DS:END -->'
 block=start+'\n## Cards NINJA\n\nPara cards de notícia NINJA e afluentes, ler `NINJA-DESIGN-SYSTEM.md` e usar a instalação em `.ninja-design-system`. Não reconstruir o template por aproximação. Esta orientação se aplica somente aos cards solicitados pelo usuário\n'+end
 guide='# Cards com o NINJA Design System\n\nO DS deste projeto está em `.ninja-design-system`; a versão e a integridade estão em `.ninja-design-system.lock.json`\n\nAntes de criar o primeiro card de um novo atendimento, consultar `ATIVO.json` em https://github.com/ThiagoScherer/ninja-design-system pela conexão autorizada. Se a versão indicada mudou, repetir o instalador do repositório, sem pedir ao colega etapas técnicas. Se não conseguir consultar, informar a versão local sem alegar que é a mais recente\n\nLer a ficha da marca instalada e `.ninja-design-system/pacote/cards/README.md`. Escolher quebras e corpo com as fontes oficiais e revisar visualmente a composição. Gerar pelo comando `python3 .ninja-design-system/gerar.py criar entrada.json card.png`. Não substituir fontes, logos ou espaçamentos por aproximação e não reescrever o conteúdo sem autorização\n\nQuando receber novamente o link e “Use este Design System para fazer meus cards”, executar a instalação/atualização completa. Preservar as instruções próprias do projeto fora do bloco NINJA\n'
 (project/'NINJA-DESIGN-SYSTEM.md').write_text(guide,encoding='utf-8')
 for name in ['AGENTS.md','CLAUDE.md']:
  p=project/name;old=p.read_text(encoding='utf-8')if p.exists()else ''
  if start in old and end in old:
   new=re.sub(re.escape(start)+'.*?'+re.escape(end),lambda _:block,old,flags=re.S)
  else:new=old+('\n\n'if old else '')+block+'\n'
  if new!=old:p.write_text(new,encoding='utf-8')

def install(args):
 project=Path(args.project).expanduser().resolve();project.mkdir(parents=True,exist_ok=True)
 node=node_command(args)
 with tempfile.TemporaryDirectory(prefix='ninja-fonte-') as temp:
  if args.source:
   source=Path(args.source).expanduser().resolve()
  else:
   source=Path(temp)/'repo'
   git=shutil.which('git')
   if not git:fail('O agente precisa obter o repositório pelo conector GitHub e usar --source, ou preparar Git')
   # Uses only the existing authorized GitHub session; never requests tokens in chat
   env=os.environ.copy();env['GIT_TERMINAL_PROMPT']='0'
   result=subprocess.run([git,'clone','--depth','1','--branch',args.ref,REPO,str(source)],stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True,env=env)
   if result.returncode:fail('Repositório privado: o agente não conseguiu usar uma conexão GitHub autorizada. Conecte a conta com acesso; nenhuma instalação foi confirmada')
  active=read(source/'ATIVO.json');release=active['activeRelease']
  if release!='v5' or active['version']!='5.0.0-rc.1':fail('Este instalador não corresponde à versão ativa; obter o instalador indicado no ATIVO.json')
  origin=source/release;integrity=verify(origin,active['integritySha256'])
  if read(origin/'manifesto.json')['version']!=active['version']:fail('Versão do pacote diverge do ATIVO.json')
  commit=None
  if (source/'.git').exists():commit=run(['git','-C',source,'rev-parse','HEAD'])
  installed=project/STATE;lock=project/LOCK
  if installed.exists() and lock.exists():
   previous=read(lock)
   if previous.get('integritySha256')==active['integritySha256']:
    verify(installed/'pacote',active['integritySha256'])
    outputs=smoke(installed,node,args.browser or previous.get('browser'))
    previous['checkedAt']=datetime.now(timezone.utc).isoformat();previous['evidencias']=outputs;previous['node']=str(Path(node).resolve());previous['status']='pronto'
    if args.browser:previous['browser']=str(Path(args.browser).resolve())
    write(lock,previous)
    remember(project)
    return {'status':'pronto','version':active['version'],'atualizacao':'já estava atualizada; integridade e geração conferidas','lock':str(lock)}
  staging=Path(tempfile.mkdtemp(prefix='.ninja-instalacao-',dir=project));backup=None
  try:
   shutil.copytree(origin,staging/'pacote');runtime=staging/'runtime';runtime.mkdir()
   for name in ['package.json','package-lock.json']:shutil.copy2(staging/'pacote/cards'/name,runtime/name)
   env=env_for(staging);env['npm_config_cache']=str(runtime/'cache');env['npm_config_update_notifier']='false'
   if args.npm_cli:npm=[node,Path(args.npm_cli).resolve()]
   else:
    npm_path=shutil.which('npm.cmd' if os.name=='nt' else 'npm')
    if not npm_path:fail('O agente precisa preparar npm do Node.js oficial ou informar --npm-cli')
    npm=[npm_path]
   run(npm+['ci','--ignore-scripts','--no-audit','--no-fund'],cwd=runtime,env=env)
   if not args.browser:run([node,runtime/'node_modules/playwright/cli.js','install','chromium'],cwd=runtime,env=env)
   outputs=smoke(staging,node,args.browser)
   # Wrapper always verifies the immutable package before creating a new card
   wrapper='''#!/usr/bin/env python3
import hashlib,json,os,subprocess,sys
from pathlib import Path
state=Path(__file__).resolve().parent
lock=json.loads((state.parent/".ninja-design-system.lock.json").read_text())
manifest=state/"pacote/arquivos.sha256.json"
if hashlib.sha256(manifest.read_bytes()).hexdigest()!=lock["integritySha256"]:raise SystemExit("Manifesto alterado; atualizar o DS")
files=json.loads(manifest.read_text())["files"]
for name,digest in files.items():
 p=state/"pacote"/name
 if not p.is_file() or p.is_symlink() or hashlib.sha256(p.read_bytes()).hexdigest()!=digest:raise SystemExit("Pacote alterado ou incompleto: "+name)
env=os.environ.copy();env["NODE_PATH"]=str(state/"runtime/node_modules");env["PLAYWRIGHT_BROWSERS_PATH"]=str(state/"runtime/browsers")
if lock.get("browser"):env["NINJA_CHROME_PATH"]=lock["browser"]
raise SystemExit(subprocess.call([lock["node"],str(state/"pacote/cards/renderizar.cjs"),*sys.argv[1:]],env=env))
'''
   (staging/'gerar.py').write_text(wrapper,encoding='utf-8')
   state={'schema':'ninja-design-system/installation','version':active['version'],'release':release,'status':'pronto','repository':REPO,'sourceCommit':commit,'integritySha256':active['integritySha256'],'node':str(Path(node).resolve()),'browser':str(Path(args.browser).resolve())if args.browser else None,'installedAt':datetime.now(timezone.utc).isoformat(),'evidencias':outputs,'scope':'cards-de-noticia','renderer':'.ninja-design-system/pacote/cards/renderizar.cjs'}
   if installed.exists():
    backup=project/(STATE+'.anterior-'+uuid.uuid4().hex[:8]);installed.rename(backup)
   try:
    staging.rename(installed)
    tmp_lock=project/(LOCK+'.tmp');write(tmp_lock,state);os.replace(tmp_lock,lock)
   except Exception:
    if installed.exists():shutil.rmtree(installed)
    if backup:backup.rename(installed)
    raise
   remember(project)
   return {'status':'pronto','version':active['version'],'lock':str(lock),'backup':str(backup)if backup else None,'evidencias':outputs}
  finally:
   if staging.exists():
    logs=list(staging.rglob('instalacao-erro.log'))
    if logs:shutil.copy2(logs[-1],project/'.ninja-design-system-erro.log')
    shutil.rmtree(staging)
def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--project',default='.');p.add_argument('--source');p.add_argument('--ref',default='main');p.add_argument('--node');p.add_argument('--npm-cli');p.add_argument('--browser');args=p.parse_args()
 try:print(json.dumps(install(args),ensure_ascii=False,indent=2))
 except Exception as e:print('DS não confirmado: '+str(e),file=sys.stderr);return 1
 return 0
if __name__=='__main__':sys.exit(main())
