'use strict';

const fs=require('node:fs/promises');
const path=require('node:path');
const {createHash}=require('node:crypto');

const endpoint='https://ninja-design-system.ngiajr.easypanel.host/v1/cards/github';
const fixtures=path.join(__dirname,'../../candidatos/v5-rc2/v5/cards/testes');
const maxPhotoBytes=16*1024*1024;

async function photo(urlText) {
  const url=new URL(urlText);
  if (url.origin!=='https://midianinja.org' || url.username || url.password ||
      !/^\/wp-content\/uploads\/[\w./%-]+\.(?:jpe?g|png|webp)$/i.test(url.pathname)) {
    throw Error('A foto precisa ser um arquivo publicado no site da Mídia NINJA');
  }
  const response=await fetch(url,{redirect:'error',signal:AbortSignal.timeout(20000)});
  const mimeType=response.headers.get('content-type')?.split(';')[0];
  if (!response.ok || !response.body || !['image/jpeg','image/png','image/webp'].includes(mimeType)) {
    throw Error('Não consegui abrir a foto publicada');
  }
  let size=0;
  const chunks=[];
  for await (const chunk of response.body) {
    size+=chunk.length;
    if (size>maxPhotoBytes) throw Error('A foto ultrapassa 16 MiB');
    chunks.push(chunk);
  }
  return {mimeType,base64:Buffer.concat(chunks,size).toString('base64')};
}

async function readRequest(issue) {
  const match=/^\s*```json\s*\n([\s\S]+?)\n```\s*$/.exec(issue?.body||'');
  let request;
  try { request=JSON.parse(match?.[1]); }
  catch { throw Error('O pedido precisa conter um bloco JSON'); }
  if (request?.caso && Object.keys(request).length===1 &&
      /^(curta|media|longa)-(com|sem)-lead$/.test(request.caso)) {
    return JSON.parse(await fs.readFile(path.join(fixtures,request.caso+'.json'),'utf8'));
  }
  if (!request?.card || Array.isArray(request.card) || typeof request.card!=='object' ||
      Object.keys(request).some(key=>!['card','fotoUrl'].includes(key))) {
    throw Error('Informe um caso oficial ou os dados do card');
  }
  if (!request.fotoUrl) return request.card;
  if (request.card.fundo || request.card.imagem) throw Error('Informe apenas uma foto ou um fundo');
  return {...request.card,imagem:await photo(request.fotoUrl)};
}

async function renderToken() {
  const url=new URL(process.env.ACTIONS_ID_TOKEN_REQUEST_URL);
  url.searchParams.set('audience',endpoint);
  const response=await fetch(url,{
    headers:{Authorization:'Bearer '+process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN},
    redirect:'error',signal:AbortSignal.timeout(10000)
  });
  if (!response.ok) throw Error('GitHub Actions não emitiu a autorização');
  const {value}=await response.json();
  if (typeof value!=='string'||!value) throw Error('GitHub Actions não emitiu a autorização');
  return value;
}

async function main() {
  const event=JSON.parse(await fs.readFile(process.env.GITHUB_EVENT_PATH,'utf8'));
  const card=await readRequest(event.issue);
  const token=await renderToken();
  const response=await fetch(endpoint,{
    method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},
    body:JSON.stringify(card),redirect:'error',signal:AbortSignal.timeout(85000)
  });
  if (!response.ok) throw Error('Easypanel retornou HTTP '+response.status);
  const {pngBase64,metadata}=await response.json();
  const png=Buffer.from(pngBase64,'base64');
  if (metadata?.largura!==1080 || metadata?.altura!==1440 ||
      createHash('sha256').update(png).digest('hex')!==metadata.sha256) {
    throw Error('O PNG não passou na verificação de integridade');
  }
  await fs.writeFile('card.png',png);
  await fs.writeFile('metadados.json',JSON.stringify(metadata,null,2)+'\n');
}

if (require.main===module) main().catch(async error=>{
  const message=error.message.replace(/[\r\n]/g,' ').slice(0,160);
  // Não registrar URLs de autorização, cabeçalhos nem dados do pedido.
  const status=/^(?:O pedido |Informe |A foto |Não consegui abrir |GitHub Actions |Easypanel retornou HTTP |O PNG )/.test(message)
    ? message : 'Falha ao preparar ou renderizar o card';
  await fs.appendFile(process.env.GITHUB_OUTPUT,'status='+status+'\n');
  console.error(status);
  process.exitCode=1;
});

module.exports={readRequest};
