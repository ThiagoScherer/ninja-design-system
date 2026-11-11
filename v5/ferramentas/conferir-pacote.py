#!/usr/bin/env python3
import hashlib,json,re,sys
from pathlib import Path
root=Path(__file__).resolve().parents[1];errors=[]
def check(ok,message):
 if not ok:errors.append(message)
def load(p):return json.loads(p.read_text())
m=load(root/'arquivos.sha256.json');files={str(p.relative_to(root))for p in root.rglob('*')if p.is_file()and p.name!='arquivos.sha256.json'}
check(files==set(m['files']),'Arquivos ausentes ou não declarados')
for name,digest in m['files'].items():
 p=root/name;check(p.is_file()and not p.is_symlink()and hashlib.sha256(p.read_bytes()).hexdigest()==digest,'Hash inválido: '+name)
for p in root.rglob('*.json'):
 try:j=load(p)
 except Exception as e:errors.append(str(e));continue
 if p.name=='ficha.json':
  for key in ['fichaTecnica','regrasComuns']:
   if key in j:check((p.parent/j[key]).is_file(),'Referência ausente: '+str(p)+' '+key)
for p in root.rglob('*.html'):
 for pattern in [r'''(?:src|href)=["']([^"']+)["']''',r'''url\(["']?([^)'"\s]+)''']:
  for ref in re.findall(pattern,p.read_text()):
   if not ref.startswith(('data:','http:','https:','#')):check((p.parent/ref).is_file(),'Recurso ausente: '+ref)
for p in [root/'manifesto.json',root/'tokens-chapeu.json',root/'regras-comuns.json',root/'cards/espacamentos.json']:
 check(load(p)['version']=='5.0.0-rc.1','Versão divergente: '+str(p))
for brand in load(root/'cards/catalogo.json')['marcas'].values():
 for model in brand['variantes'].values():check((root/'cards'/model).is_file(),'Modelo ausente: '+model)
if errors:print('\n'.join(errors));sys.exit(1)
print('OK: integridade, versões, fichas, modelos e recursos — '+str(len(files))+' arquivos')
