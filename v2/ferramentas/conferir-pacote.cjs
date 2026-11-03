const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const fail=[];let checked=0;
const manifest=read('manifesto.json'),hashes=read('arquivos.sha256.json');
for(const [rel,expected] of Object.entries(hashes.arquivos)){
 const full=path.resolve(root,rel);
 if(!full.startsWith(root+path.sep)){fail.push('Caminho externo: '+rel);continue;}
 if(!fs.existsSync(full)){fail.push('Ausente: '+rel);continue;}
 const actual=crypto.createHash('sha256').update(fs.readFileSync(full)).digest('hex');
 if(actual!==expected)fail.push('Hash divergente: '+rel);checked++;
 if(rel.endsWith('.json')){try{JSON.parse(fs.readFileSync(full,'utf8'));}catch{fail.push('JSON inválido: '+rel);}}
}
const map=read(manifest.mapa),tests=read(manifest.testes).casos;
if(map.aplicacoes.length!==28||new Set(map.aplicacoes.map(x=>x.id)).size!==28)fail.push('Inventário inconsistente');
for(const a of map.aplicacoes){
 if(!fs.existsSync(path.join(root,'integracao/composicoes',a.id+'.md')))fail.push('Ficha ausente: '+a.id);
 for(const c of a.componentes_propostos)if(!map.consumidores_por_componente[c]?.includes(a.id))fail.push('Consumidor inconsistente: '+a.id+'/'+c);
}
if(tests.length!==16||new Set(tests.map(x=>x.id)).size!==16)fail.push('Matriz de testes inconsistente');
for(const p of [manifest.entrada_agentes,manifest.contrato_integracao,manifest.base_preservada])if(!fs.existsSync(path.join(root,p)))fail.push('Referência ausente: '+p);
console.log(JSON.stringify({pacote:manifest.versao,arquivos_conferidos:checked,aplicacoes:map.aplicacoes.length,casos_integracao:tests.length,integridade:fail.length?'falhou':'passou',integracao_maquina:'nao_executada_por_este_verificador',erros:fail},null,2));
process.exitCode=fail.length?1:0;
