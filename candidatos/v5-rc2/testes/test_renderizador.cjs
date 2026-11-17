// Exercita a preparação real da entrada sem abrir navegador.
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const {preparar} = require('../v5/cards/renderizar.cjs');
(async () => {
 const root = path.resolve(__dirname, '../v5/cards');
 const catalogo = JSON.parse(await fs.readFile(path.join(root,'catalogo.json'),'utf8'));
 const original = JSON.parse(await fs.readFile(path.join(root,'testes/media-com-lead.json'),'utf8'));
 const temp = await fs.mkdtemp(path.join(os.tmpdir(),'ninja São Paulo '));
 try {
  const entrada = path.join(temp,'notícia com acentos.json');
  await fs.writeFile(entrada,'\uFEFF'+JSON.stringify(original,null,2).replace(/\n/g,'\r\n'),'utf8');
  const result = await preparar(entrada,catalogo);
  assert.equal(result.entrada.chapeu,original.chapeu);
  assert.equal(result.entrada.lead,original.lead);
  assert.equal(result.entrada.chamada.normalize('NFC').toLocaleUpperCase('pt-BR'),original.chamada.normalize('NFC').toLocaleUpperCase('pt-BR'));
  assert.equal(result.entrada.tamanho,original.tamanho);
  console.log('OK: renderizador real aceita JSON UTF-8 com BOM/CRLF e caminho com espaços/acentos');
 } finally {await fs.rm(temp,{recursive:true,force:true});}
})().catch(error=>{console.error(error);process.exitCode=1;});
