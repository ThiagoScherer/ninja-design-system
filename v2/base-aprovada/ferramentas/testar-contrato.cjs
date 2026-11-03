const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),{montar}=require('./renderizar.cjs');
const r=path.resolve(__dirname,'..'),d=JSON.parse(fs.readFileSync(path.join(r,'exemplos/reels.json')));
assert.ok(montar('reels',d).includes('ABSURDO'));
for(const [nome,alterar] of [['dimensão',x=>x.dimensao.largura=720],['pontuação',x=>x.conteudo.chapeu+='.' ],['alteração de conteúdo',x=>x.composicao_referencia.linhas_chamada[0]='OUTRO TEXTO'],['lead não aprovado',x=>x.conteudo.lead='Texto de apoio'],['composição ausente',x=>delete x.composicao_referencia]]){const c=structuredClone(d);alterar(c);assert.throws(()=>montar('reels',c),undefined,nome)}
console.log('Contrato: exemplo válido aceito; cinco casos inválidos rejeitados');
