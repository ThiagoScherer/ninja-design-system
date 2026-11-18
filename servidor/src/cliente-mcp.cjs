'use strict';
// Ponte stdio opcional para clientes MCP que aceitam comando local.
const readline=require('node:readline');
const fs=require('node:fs/promises');
const path=require('node:path');
const endpoint=process.env.NINJA_RENDER_URL;
const token=process.env.NINJA_RENDER_TOKEN;
if(!endpoint||!token){console.error('Configure NINJA_RENDER_URL e NINJA_RENDER_TOKEN');process.exit(1);}
const url=new URL('/mcp',endpoint);
if(url.protocol!=='https:'&&!(url.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(url.hostname))){console.error('Use HTTPS para o servidor remoto');process.exit(1);}
const input=readline.createInterface({input:process.stdin,crlfDelay:Infinity});
input.on('line',async line=>{
 let message;
 try{message=JSON.parse(line);}catch{process.stdout.write(JSON.stringify({jsonrpc:'2.0',id:null,error:{code:-32700,message:'JSON inválido'}})+'\n');return;}
 try{
  if(message.method==='tools/call'&&message.params?.name==='gerar_card'&&message.params.arguments?.arquivoFoto!==undefined){
   const args=message.params.arguments,photo=args.arquivoFoto;
   if(typeof photo!=='string'||!path.isAbsolute(photo))throw Error('Foto deve ter caminho absoluto');
   const mime={'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp'}[path.extname(photo).toLowerCase()];
   if(!mime||(await fs.stat(photo)).size>16*1024*1024)throw Error('Foto inválida');
   const data=await fs.readFile(photo);
   if(args.imagem||args.fundo)throw Error('Envie foto ou fundo, uma opção por vez');
   args.imagem={mimeType:mime,base64:data.toString('base64')};delete args.arquivoFoto;
  }
  const response=await fetch(url,{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json',Accept:'application/json, text/event-stream'},body:JSON.stringify(message),signal:AbortSignal.timeout(110000),redirect:'error'});
  if(response.status===202)return;
  if(!response.ok)throw new Error('HTTP '+response.status);
  const result=await response.json();
  if(message.method==='tools/list'&&result.result?.tools){
   const tool=result.result.tools.find(t=>t.name==='gerar_card');
   if(tool){delete tool.inputSchema.properties.imagem;tool.inputSchema.properties.arquivoFoto={type:'string',description:'Caminho absoluto da foto fornecida pelo usuário neste computador; o adaptador envia os bytes sem passá-los como texto ao modelo'};tool.inputSchema.oneOf=[{required:['arquivoFoto']},{required:['fundo']}];tool.description=tool.description.replace('Envie a foto em base64; nunca envie caminho local ou URL.','Para esta ponte local, informe arquivoFoto com o caminho absoluto da foto fornecida pelo usuário.');}
  }
  process.stdout.write(JSON.stringify(result)+'\n');
 }catch{
  if(message.id!==undefined)process.stdout.write(JSON.stringify({jsonrpc:'2.0',id:message.id,error:{code:-32603,message:'Falha ao acessar o servidor de renderização'}})+'\n');
 }
});
