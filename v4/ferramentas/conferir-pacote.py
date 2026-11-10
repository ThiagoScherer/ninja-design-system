#!/usr/bin/env python3
"""Confere integridade, dependências locais e versão da distribuição V4."""
import hashlib,json,re,sys
from pathlib import Path
root=Path(__file__).resolve().parents[1]
errors=[]
def check(ok,msg):
 if not ok:errors.append(msg)
def load(p):return json.loads(p.read_text())
manifest=load(root/'arquivos.sha256.json')
actual={str(p.relative_to(root)) for p in root.rglob('*') if p.is_file() and p.name!='arquivos.sha256.json'}
check(actual==set(manifest['files']),'Conjunto de arquivos diverge do manifesto de hashes')
for name,expected in manifest['files'].items():
 p=root/name
 check(p.is_file() and hashlib.sha256(p.read_bytes()).hexdigest()==expected,'Hash inválido: '+name)
for p in root.rglob('*.json'):
 try:j=load(p)
 except Exception as e:errors.append(str(p)+': '+str(e));continue
 if p.name=='ficha.json':
  for field in ['fichaTecnica','regrasComuns']:
   if field in j:check((p.parent/j[field]).is_file(),str(p)+': referência ausente '+field)
for p in root.rglob('*.html'):
 s=p.read_text()
 for pattern in [r'''(?:src|href)=["']([^"']+)["']''',r'''url\(["']?([^)'"\s]+)''']:
  for ref in re.findall(pattern,s):
   if ref.startswith(('data:','http:','https:','#')):continue
   check((p.parent/ref).is_file(),str(p)+': recurso ausente '+ref)
for p in [root/'manifesto.json',root/'tokens-chapeu.json',root/'regras-comuns.json',root/'video/contrato-integracao.json']:
 j=load(p);check(j.get('version')=='4.0.0-rc.2',str(p)+': versão divergente')
check(load(root.parent/'ATIVO.json')['version']=='4.0.0-rc.2','ATIVO divergente')
check(load(root.parent/'manifesto.json')['versao']=='4.0.0-rc.2','Manifesto raiz divergente')
cat=load(root/'cards/catalogo.json')
for m in cat['marcas'].values():
 for ref in m['variantes'].values():check((root/'cards'/ref).is_file(),'Modelo ausente: '+ref)
check(load(root/'video/composicoes.json')['total']==len(load(root/'video/composicoes.json')['composicoes'])==23,'Registro de composições inconsistente')
check(load(root/'cards/modelos/som/com-lead/ficha.json')['chapeu']['distanciaChamadaPx']==22.71875,'SOM com lead divergente')
check(load(root/'cards/modelos/som/sem-lead/ficha.json')['chapeu']['distanciaChamadaPx']==22,'SOM sem lead deve manter 22 px')
if errors:
 print('\n'.join(errors));sys.exit(1)
print(f'OK: {len(actual)} arquivos, hashes, JSONs, recursos, fichas, versões e registros conferidos')
