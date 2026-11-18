'use strict';
const crypto=require('node:crypto');
const {ServiceError}=require('./renderer.cjs');
const {protectedResourcePath}=require('./mcp-oauth.cjs');
const schema={type:'object',additionalProperties:false,required:['chapeu','chamada','linhas','tamanho','credito'],properties:{
 marca:{type:'string',default:'ninja'},chapeu:{type:'string'},chamada:{type:'string'},linhas:{type:'array',minItems:1,maxItems:20,items:{type:'string'}},tamanho:{type:'number',minimum:1,maximum:500},lead:{type:'string'},linhasLead:{type:'array',items:{type:'string'}},credito:{type:'string'},fundo:{type:'string',pattern:'^#[0-9A-Fa-f]{6}$'},foco:{type:'string',description:'Enquadramento: duas porcentagens, por exemplo 50% 25%'},cor:{type:'string'},creditoPreto:{type:'boolean'},imagem:{type:'object',additionalProperties:false,required:['base64','mimeType'],properties:{base64:{type:'string'},mimeType:{type:'string',enum:['image/png','image/jpeg','image/webp']}}}},oneOf:[{required:['imagem']},{required:['fundo']}]};
function tools(catalog){return[
 {name:'listar_modelos',description:'Lista marcas, variantes e regras comuns do NINJA DS instalado',inputSchema:{type:'object',additionalProperties:false,properties:{}},annotations:{readOnlyHint:true,openWorldHint:false}},
 {name:'consultar_modelo',description:'Leia a ficha da marca antes de escolher as quebras e o tamanho da chamada',inputSchema:{type:'object',additionalProperties:false,required:['marca','variante'],properties:{marca:{type:'string',enum:Object.keys(catalog.marcas)},variante:{type:'string',enum:['com-lead','sem-lead']}}},annotations:{readOnlyHint:true,openWorldHint:false}},
 {name:'gerar_card',description:'Gera card 1080x1440 pelo renderizador oficial. O agente define linhas e tamanho conforme a ficha, preserva o texto e revisa a imagem retornada antes de entregar. Envie a foto em base64; nunca envie caminho local ou URL. Não publica o card',inputSchema:{...schema,properties:{...schema.properties,marca:{type:'string',enum:Object.keys(catalog.marcas),default:'ninja'}}},annotations:{destructiveHint:false,readOnlyHint:false,idempotentHint:true,openWorldHint:false}}
];}
function output(res,status,value,headers={}){const bytes=Buffer.isBuffer(value)?value:Buffer.from(JSON.stringify(value));res.writeHead(status,{'Content-Type':Buffer.isBuffer(value)?'image/png':'application/json; charset=utf-8','Content-Length':bytes.length,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers});res.end(bytes);}
function authenticated(header,token){const expected=Buffer.from('Bearer '+token),actual=Buffer.from(header||'');return actual.length===expected.length&&crypto.timingSafeEqual(actual,expected);}
async function body(req,limit){
 if(!/^application\/json(?:;|$)/i.test(req.headers['content-type']||''))throw new ServiceError(415,'JSON_REQUIRED','Envie Content-Type application/json');
 const declared=req.headers['content-length'];
 if(declared!==undefined&&(!/^\d+$/.test(declared)||Number(declared)>limit)){req.resume?.();throw new ServiceError(413,'BODY_TOO_LARGE','Pedido excede o limite');}
 return new Promise((resolve,reject)=>{
  const chunks=[];let size=0;
  const cleanup=()=>{req.removeListener('data',data);req.removeListener('end',end);req.removeListener('error',error);req.removeListener('aborted',aborted);};
  const error=()=>{cleanup();reject(new ServiceError(400,'REQUEST_INTERRUPTED','Pedido interrompido'));};
  const aborted=()=>error();
  const data=chunk=>{size+=chunk.length;if(size>limit){cleanup();req.resume?.();reject(new ServiceError(413,'BODY_TOO_LARGE','Pedido excede o limite'));}else chunks.push(Buffer.from(chunk));};
  const end=()=>{cleanup();try{resolve(JSON.parse(Buffer.concat(chunks).toString('utf8').replace(/^\uFEFF/,'')));}catch{reject(new ServiceError(400,'INVALID_JSON','JSON inválido'));}};
  req.on('data',data);req.once('end',end);req.once('error',error);req.once('aborted',aborted);
 });
}
async function rpc(message,renderer){
 if(!message||Array.isArray(message)||typeof message!=='object'||message.jsonrpc!=='2.0'||typeof message.method!=='string'||(message.id!==undefined&&typeof message.id!=='string'&&typeof message.id!=='number'&&message.id!==null))return {jsonrpc:'2.0',id:null,error:{code:-32600,message:'Pedido JSON-RPC inválido'}};
 const id=message.id??null,reply=result=>({jsonrpc:'2.0',id,result}),error=(code,message)=>({jsonrpc:'2.0',id,error:{code,message}});
 if(message.id===undefined)return null;
 if(message.method==='initialize')return reply({protocolVersion:['2025-11-25','2025-06-18','2025-03-26'].includes(message.params?.protocolVersion)?message.params.protocolVersion:'2025-11-25',capabilities:{tools:{listChanged:false}},serverInfo:{name:'ninja-design-system-render',version:'0.1.0'},instructions:'Ler ficha antes de compor. Revisar imagem retornada. Não reescrever conteúdo nem publicar sem instrução do usuário'});
 if(message.method==='ping')return reply({});
 if(message.method==='tools/list')return reply({tools:tools(renderer.catalog)});
 if(message.method!=='tools/call')return error(-32601,'Método não encontrado');
 const {name,arguments:args={}}=message.params||{};
 try{
  if(name==='listar_modelos')return reply({content:[{type:'text',text:JSON.stringify({version:renderer.version,catalogo:renderer.catalog,regras:renderer.rules})}]});
  if(name==='consultar_modelo'){
   if(!args||typeof args!=='object'||Array.isArray(args)||typeof args.marca!=='string'||typeof args.variante!=='string'||Object.keys(args).some(k=>!['marca','variante'].includes(k)))return error(-32602,'Informe marca e variante');
   return reply({content:[{type:'text',text:JSON.stringify(await renderer.template(args.marca,args.variante))}]});
  }
  if(name!=='gerar_card')return error(-32602,'Ferramenta não encontrada');
  const {png,metadata}=await renderer.render(args);
  return reply({content:[{type:'image',data:png.toString('base64'),mimeType:'image/png'},{type:'text',text:JSON.stringify(metadata)}],structuredContent:{metadata}});
 }catch(e){return reply({isError:true,content:[{type:'text',text:JSON.stringify({code:e.code||'INTERNAL_ERROR',message:e instanceof ServiceError?e.message:'Falha interna no serviço'})}]});}
}
function openapi(catalog){
 const properties={...schema.properties,marca:{type:'string',enum:Object.keys(catalog.marcas)}};
 return {openapi:'3.1.0',info:{title:'NINJA Design System — renderização',version:'0.1.0'},security:[{bearerAuth:[]}],components:{securitySchemes:{bearerAuth:{type:'http',scheme:'bearer'}},schemas:{Card:{...schema,properties}}},paths:{'/v1/cards':{post:{operationId:'gerarCard',summary:'Gerar um PNG pelo DS V5 RC2',requestBody:{required:true,content:{'application/json':{schema:{$ref:'#/components/schemas/Card'}}}},responses:{200:{description:'PNG base64 e metadados; com Accept image/png, PNG binário',content:{'image/png':{schema:{type:'string',format:'binary'}},'application/json':{schema:{type:'object',required:['pngBase64','metadata'],properties:{pngBase64:{type:'string',contentEncoding:'base64'},metadata:{type:'object'}}}}}},400:{description:'Entrada inválida'},401:{description:'Sem autorização'},413:{description:'Foto ou pedido grande demais'},422:{description:'Composição não passou na verificação'},429:{description:'Fila cheia'},503:{description:'Gerador indisponível'},504:{description:'Tempo excedido'}}}},'/v1/catalog':{get:{operationId:'listarModelos',responses:{200:{description:'Marcas, variantes e regras'}}}},'/v1/templates/{marca}/{variante}':{get:{operationId:'consultarModelo',parameters:[{name:'marca',in:'path',required:true,schema:{type:'string'}},{name:'variante',in:'path',required:true,schema:{type:'string',enum:['com-lead','sem-lead']}}],responses:{200:{description:'Ficha do template'},404:{description:'Template inexistente'}}}}}};
}
function createHandler({renderer,token,authorizeGithubRender=async()=>false,mcpOAuth,maxBody=24*1024*1024,allowedOrigins=[],onError=()=>{}}){
 if(typeof token!=='string'||Buffer.byteLength(token)<32)throw new Error('Configure NINJA_RENDER_TOKEN com pelo menos 32 bytes');
 return async(req,res)=>{
  const requestId=crypto.randomUUID();
  try{
   const pathname=new URL(req.url,'http://localhost').pathname;
   if(req.method==='GET'&&pathname==='/healthz')return output(res,200,{status:'alive'});
   if(req.method==='GET'&&pathname==='/readyz')return output(res,renderer.ready?200:503,{status:renderer.ready?'ready':'starting',dsVersion:renderer.version});
   if(mcpOAuth&&req.method==='GET'&&pathname===protectedResourcePath)return output(res,200,mcpOAuth.metadata,{'Access-Control-Allow-Origin':'*'});
   const githubRender=req.method==='POST'&&pathname==='/v1/cards/github';
   const oauth=pathname==='/mcp'?mcpOAuth:undefined;
   const authorization=req.headers.authorization;
   const authorized=githubRender?await authorizeGithubRender(authorization):authenticated(authorization,token)||await oauth?.authorize(authorization);
   if(!authorized){
    const challenge=oauth&&authorization?`${oauth.challenge}, error="invalid_token"`:oauth?.challenge||'Bearer';
    return output(res,401,{error:{code:'UNAUTHORIZED',message:'Acesso não autorizado'}},{'WWW-Authenticate':challenge});
   }
   if(req.headers.origin&&!allowedOrigins.includes(req.headers.origin))throw new ServiceError(403,'ORIGIN_DENIED','Origem não autorizada');
   if(!renderer.ready)throw new ServiceError(503,'NOT_READY','O serviço ainda está iniciando');
   if(pathname==='/mcp'){
    if(req.method!=='POST')return output(res,405,{error:{code:'METHOD_NOT_ALLOWED',message:'Use POST JSON-RPC'}},{Allow:'POST'});
    const result=await rpc(await body(req,maxBody),renderer);
    if(result===null){res.writeHead(202,{'Cache-Control':'no-store'});return res.end();}
    return output(res,200,result);
   }
   if(req.method==='GET'&&pathname==='/openapi.json')return output(res,200,openapi(renderer.catalog));
   if(req.method==='GET'&&pathname==='/v1/catalog')return output(res,200,{dsVersion:renderer.version,catalogo:renderer.catalog,regras:renderer.rules});
   const match=pathname.match(/^\/v1\/templates\/([^/]+)\/([^/]+)$/);
   if(req.method==='GET'&&match)return output(res,200,await renderer.template(match[1],match[2]));
   if(githubRender||(req.method==='POST'&&pathname==='/v1/cards')){
    const {png,metadata}=await renderer.render(await body(req,maxBody));
    if((req.headers.accept||'').includes('image/png'))return output(res,200,png,{'Content-Disposition':'inline; filename="card-ninja.png"','X-DS-Version':renderer.version,'X-PNG-SHA256':metadata.sha256});
    return output(res,200,{pngBase64:png.toString('base64'),metadata});
   }
   return output(res,404,{error:{code:'NOT_FOUND',message:'Rota não encontrada'}});
  }catch(e){
   onError({requestId,code:e.code||'INTERNAL_ERROR'});
   if(!res.headersSent)output(res,e instanceof ServiceError?e.status:500,{error:{code:e instanceof ServiceError?e.code:'INTERNAL_ERROR',message:e instanceof ServiceError?e.message:'Falha interna no serviço',requestId}});
  }
 };
}
module.exports={schema,tools,rpc,openapi,authenticated,body,createHandler};
