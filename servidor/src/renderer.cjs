'use strict';
const fs=require('node:fs/promises');
const path=require('node:path');
const os=require('node:os');
const crypto=require('node:crypto');
const {spawn}=require('node:child_process');
class ServiceError extends Error {constructor(status,code,message){super(message);this.status=status;this.code=code;}}
const digest=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const load=async p=>JSON.parse((await fs.readFile(p,'utf8')).replace(/^\uFEFF/,''));
const normalize=s=>s.normalize('NFC').replace(/\s+/g,' ').trim().toLocaleUpperCase('pt-BR').replace(/(?<!\.)\.$/,'');
const fields=new Set(['marca','chapeu','chamada','linhas','tamanho','lead','linhasLead','credito','fundo','foco','cor','creditoPreto','imagem']);
function validate(input,catalog){
 if(!input||Array.isArray(input)||typeof input!=='object')throw new ServiceError(400,'INVALID_INPUT','Informe um objeto JSON');
 for(const key of Object.keys(input))if(!fields.has(key))throw new ServiceError(400,'INVALID_FIELD','Campo não aceito: '+key);
 const entry={...input,marca:input.marca||'ninja'};
 if(!Object.hasOwn(catalog.marcas,entry.marca))throw new ServiceError(400,'INVALID_BRAND','Marca fora do catálogo');
 for(const key of ['chapeu','chamada','credito'])if(typeof entry[key]!=='string'||!entry[key].trim()||entry[key].length>3000)throw new ServiceError(400,'INVALID_TEXT','Campo inválido: '+key);
 if(entry.lead!==undefined&&(typeof entry.lead!=='string'||entry.lead.length>3000))throw new ServiceError(400,'INVALID_TEXT','Lead inválido');
 if(!Number.isFinite(entry.tamanho)||entry.tamanho<1||entry.tamanho>500)throw new ServiceError(400,'INVALID_SIZE','Informe o tamanho da chamada em px');
 function lines(text,list,key){if(!Array.isArray(list)||!list.length||list.length>20||list.some(s=>typeof s!=='string'||!s.trim())||normalize(list.join(' '))!==normalize(text))throw new ServiceError(400,'TEXT_CHANGED',key+' deve preservar o texto e a ordem das palavras');}
 lines(entry.chamada,entry.linhas,'linhas');
 if(entry.marca==='cine-ninja'&&entry.lead)lines(entry.lead,entry.linhasLead,'linhasLead');
 if(entry.cor!==undefined&&!Object.hasOwn(catalog.marcas[entry.marca].cores||{},entry.cor))throw new ServiceError(400,'INVALID_COLOR','Cor fora do catálogo');
 if(entry.foco!==undefined&&(typeof entry.foco!=='string'||!/^\d{1,3}(?:\.\d+)?% \d{1,3}(?:\.\d+)?%$/.test(entry.foco)||entry.foco.split(' ').some(x=>parseFloat(x)>100)))throw new ServiceError(400,'INVALID_FOCUS','Use duas porcentagens entre 0 e 100 para o enquadramento');
 if(entry.creditoPreto!==undefined&&typeof entry.creditoPreto!=='boolean')throw new ServiceError(400,'INVALID_CREDIT','creditoPreto deve ser booleano');
 let image=null;
 if(entry.imagem!==undefined){
  const value=entry.imagem;
  if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).some(k=>!['base64','mimeType'].includes(k))||typeof value.base64!=='string'||!value.base64.length||value.base64.length>22369624||value.base64.length%4||! /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value.base64))throw new ServiceError(400,'INVALID_IMAGE','Imagem base64 inválida; máximo 16 MiB');
  const data=Buffer.from(value.base64,'base64');
  if(data.length>16*1024*1024)throw new ServiceError(413,'IMAGE_TOO_LARGE','Foto excede 16 MiB');
  const mime=value.mimeType;
  const formats={'image/png':['png',b=>b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))], 'image/jpeg':['jpg',b=>b[0]===255&&b[1]===216&&b[2]===255], 'image/webp':['webp',b=>b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP']};
  if(!Object.hasOwn(formats,mime)||!formats[mime][1](data))throw new ServiceError(400,'INVALID_IMAGE','Envie uma foto PNG, JPEG ou WebP com tipo correspondente');
  image={data,extension:formats[mime][0]};
 }else if(!/^#[0-9a-f]{6}$/i.test(entry.fundo||''))throw new ServiceError(400,'IMAGE_REQUIRED','Envie imagem ou fundo hexadecimal');
 if(image&&entry.fundo!==undefined)throw new ServiceError(400,'AMBIGUOUS_BACKGROUND','Envie foto ou fundo sólido, uma opção por vez');
 delete entry.imagem;
 return {entry,image};
}
async function verifyPackage(root,expectedHash){
 const manifest=path.join(root,'arquivos.sha256.json');
 if(digest(await fs.readFile(manifest))!==expectedHash)throw new Error('Manifesto do DS divergente');
 const data=await load(manifest);const actual=[];
 async function walk(dir){for(const item of await fs.readdir(dir,{withFileTypes:true})){const full=path.join(dir,item.name);if(item.isSymbolicLink())throw new Error('Link simbólico no pacote');if(item.isDirectory())await walk(full);else if(item.isFile()&&full!==manifest)actual.push(path.relative(root,full).split(path.sep).join('/'));}}
 await walk(root);
 if(JSON.stringify(actual.sort())!==JSON.stringify(Object.keys(data.files).sort()))throw new Error('Pacote incompleto ou com arquivos inesperados');
 for(const [name,hash]of Object.entries(data.files)){
  if(name.includes('\\')||name.includes(':')||path.isAbsolute(name)||name.split('/').includes('..'))throw new Error('Caminho inválido no pacote');
  if(digest(await fs.readFile(path.join(root,name)))!==hash)throw new Error('Integridade inválida: '+name);
 }
 return data;
}
function execute(args,{env,cwd,timeoutMs,spawnProcess=spawn}){
 return new Promise((resolve,reject)=>{
  const child=spawnProcess(process.execPath,args,{env,cwd,detached:process.platform!=='win32',stdio:['ignore','pipe','pipe']});
  let stderr='',settled=false,timedOut=false,killTimer;
  const kill=signal=>{try{if(process.platform!=='win32'&&child.pid)process.kill(-child.pid,signal);else child.kill(signal);}catch{}};
  const timer=setTimeout(()=>{timedOut=true;kill('SIGTERM');killTimer=setTimeout(()=>kill('SIGKILL'),1500);killTimer.unref?.();},timeoutMs);
  child.stdout.on('data',()=>{});
  child.stderr.on('data',chunk=>{if(stderr.length<65536)stderr+=chunk.toString('utf8').slice(0,65536-stderr.length);});
  const finish=(error)=>{if(settled)return;settled=true;clearTimeout(timer);clearTimeout(killTimer);error?reject(error):resolve();};
  child.on('error',()=>finish(new ServiceError(503,'RENDERER_UNAVAILABLE','Não foi possível iniciar o renderizador')));
  child.on('close',code=>{
   if(timedOut)return finish(new ServiceError(504,'RENDER_TIMEOUT','A geração excedeu o tempo limite'));
   if(code!==0){
    const invalid=/Chamada fora|Texto fora|Espaçamento divergente|preservar o texto|máximo aprovado|requer uma segunda linha|Cor fora|Informe tamanho/i.test(stderr);
    return finish(new ServiceError(invalid?422:503,invalid?'INVALID_COMPOSITION':'RENDER_FAILED',invalid?'Revise tamanho, quebras e limites do template':'O renderizador não concluiu; consulte o diagnóstico do serviço'));
   }
   finish();
  });
 });
}
class Renderer {
 constructor({packageRoot,expectedHash,version,nodeModules,browserPath,timeoutMs=45000,maxQueue=4,queueWaitMs=30000,run=execute}){
  Object.assign(this,{packageRoot,expectedHash,version,nodeModules,browserPath,timeoutMs,maxQueue,queueWaitMs,run});this.waiting=[];this.busy=false;this.ready=false;
 }
 async initialize(){
  await verifyPackage(this.packageRoot,this.expectedHash);
  this.catalog=await load(path.join(this.packageRoot,'cards/catalogo.json'));
  this.rules=await load(path.join(this.packageRoot,'regras-comuns.json'));
  const sample=await load(path.join(this.packageRoot,'cards/testes/media-com-lead.json'));
  await this.render(sample,true);this.ready=true;
 }
 async template(marca,variante){
  if(!Object.hasOwn(this.catalog.marcas,marca)||!Object.hasOwn(this.catalog.marcas[marca].variantes,variante))throw new ServiceError(404,'TEMPLATE_NOT_FOUND','Modelo não encontrado');
  const html=this.catalog.marcas[marca].variantes[variante];
  return {version:this.version,ficha:await load(path.join(this.packageRoot,'cards',path.dirname(html),'ficha.json')),regrasComuns:this.rules};
 }
 async render(input,initializing=false){
  if(!initializing&&!this.ready)throw new ServiceError(503,'NOT_READY','O serviço ainda não concluiu o teste de geração');
  const parsed=validate(input,this.catalog);
  if(this.busy){if(this.waiting.length>=this.maxQueue)throw new ServiceError(429,'QUEUE_FULL','Fila cheia; tente novamente em instantes');await new Promise((resolve,reject)=>{const ticket={resolve};ticket.timer=setTimeout(()=>{const index=this.waiting.indexOf(ticket);if(index>=0)this.waiting.splice(index,1);reject(new ServiceError(503,'QUEUE_TIMEOUT','Tempo de espera excedido; tente novamente'));},this.queueWaitMs);this.waiting.push(ticket);});}
  this.busy=true;let dir;
  try{
   await verifyPackage(this.packageRoot,this.expectedHash);
   dir=await fs.mkdtemp(path.join(os.tmpdir(),'ninja-card-'));
   if(parsed.image){parsed.entry.foto='foto.'+parsed.image.extension;await fs.writeFile(path.join(dir,parsed.entry.foto),parsed.image.data,{mode:0o600});}
   const entry=path.join(dir,'entrada.json'),output=path.join(dir,'card.png');
   await fs.writeFile(entry,JSON.stringify(parsed.entry),{mode:0o600});
   const env={...process.env};delete env.NINJA_CHROME_PATH;
   if(this.nodeModules)env.NODE_PATH=this.nodeModules;
   if(this.browserPath)env.NINJA_CHROME_PATH=this.browserPath;
   await this.run([path.join(this.packageRoot,'cards/renderizar.cjs'),'criar',entry,output],{env,cwd:dir,timeoutMs:this.timeoutMs});
   const png=await fs.readFile(output),metadata=await load(output+'.ds.json');
   if(png.length<24||!png.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))||png.readUInt32BE(16)!==1080||png.readUInt32BE(20)!==1440||metadata.dsVersion!==this.version||metadata.largura!==1080||metadata.altura!==1440||!Array.isArray(metadata.alertas)||metadata.alertas.length||!metadata.fonts?.length||!metadata.fonts.every(f=>f.loaded)||metadata.sha256!==digest(png))throw new ServiceError(503,'INVALID_RENDER_OUTPUT','A saída não passou na conferência de versão, fontes, dimensões e integridade');
   return {png,metadata};
  }finally{
   try{if(dir)await fs.rm(dir,{recursive:true,force:true});}finally{const next=this.waiting.shift();if(next){clearTimeout(next.timer);next.resolve();}else this.busy=false;}
  }
 }
}
module.exports={Renderer,ServiceError,validate,verifyPackage,execute,digest};
