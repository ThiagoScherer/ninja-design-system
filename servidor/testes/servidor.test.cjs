'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const os=require('node:os');
const {Readable}=require('node:stream');
const {Renderer,ServiceError,validate,verifyPackage,execute,digest}=require('../src/renderer.cjs');
const {createHandler,rpc,tools,openapi}=require('../src/api.cjs');
const release=require('../release.json');
const local=path.resolve(__dirname,'../../distribuicao/ninja-ds-v5-rc2/v5');
const packaged=path.resolve(__dirname,'../pacote');
const candidate=path.resolve(__dirname,'../../candidatos/v5-rc2/v5');
const packageRoot=[candidate,local,packaged].find(p=>require('node:fs').existsSync(path.join(p,'arquivos.sha256.json')));
if(!packageRoot)throw Error('Pacote RC2 ausente no checkout de teste');
const catalog=require(path.join(packageRoot,'cards/catalogo.json'));
const sample=require(path.join(packageRoot,'cards/testes/media-com-lead.json'));
const token='token-de-teste-com-mais-de-trinta-e-dois-bytes';
// Saída controlada para testar o contrato. Não representa teste gráfico real.
const png=Buffer.alloc(32);Buffer.from([137,80,78,71,13,10,26,10]).copy(png);png.writeUInt32BE(1080,16);png.writeUInt32BE(1440,20);
const metadata={dsVersion:release.dsVersion,largura:1080,altura:1440,alertas:[],fonts:[{loaded:true}],sha256:digest(png)};
const calls=[];
const fake={ready:true,version:release.dsVersion,catalog,rules:{composicao:'preservar'},template:async(marca,variante)=>{if(!Object.hasOwn(catalog.marcas,marca)||!['com-lead','sem-lead'].includes(variante))throw new ServiceError(404,'TEMPLATE_NOT_FOUND','Modelo não encontrado');return{marca,variante};},render:async input=>{validate(input,catalog);return{png,metadata};}};
async function request(handler,{method='GET',url='/v1/catalog',value,raw,headers={}}={}){
 const bytes=raw??(value===undefined?Buffer.alloc(0):Buffer.from(JSON.stringify(value)));
 const req=Readable.from([bytes]);Object.assign(req,{method,url,headers:{authorization:'Bearer '+token,'content-type':'application/json',...headers}});
 let status,body,head;
 const res={headersSent:false,writeHead(code,h){status=code;head=h;this.headersSent=true;},end(data){body=data?Buffer.from(data):Buffer.alloc(0);}};
 await handler(req,res);return{status,headers:head,body,json:()=>JSON.parse(body.toString())};
}
const handler=()=>createHandler({renderer:fake,token});
const newRenderer=(run,options={})=>new Renderer({packageRoot,expectedHash:release.integritySha256,version:release.dsVersion,run,...options});
async function controlled(args,{before}={}){
 if(before)await before();const output=args.at(-1);
 await fs.writeFile(output,png);await fs.writeFile(output+'.ds.json',JSON.stringify(metadata));
}
test('pacote original passa na verificação SHA-256',async()=>{assert.equal((await verifyPackage(packageRoot,release.integritySha256)).version,release.dsVersion);});
test('recusa pacote corrompido sem normalizar bytes',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'ninja-integridade-'));
 try{await fs.cp(packageRoot,root,{recursive:true});await fs.appendFile(path.join(root,'cards/README.md'),'alterado');await assert.rejects(verifyPackage(root,release.integritySha256),/Integridade inválida/);}finally{await fs.rm(root,{recursive:true,force:true});}
});
test('entrada mantém conteúdo; foto é por bytes, nunca caminho ou URL',()=>{
 assert.equal(validate(sample,catalog).entry.chamada,sample.chamada);
 assert.throws(()=>validate({...sample,foto:'/etc/passwd'},catalog),/Campo não aceito/);
 assert.throws(()=>validate({...sample,imagem:{url:'http://127.0.0.1'}},catalog),/base64 inválida/);
});
test('recusa reescrita ou mudança da ordem nas linhas',()=>{assert.throws(()=>validate({...sample,linhas:['TEXTO SUBSTITUÍDO']},catalog),/preservar o texto/);});
test('recusa marca/propriedade especial, tamanho e foco fora dos limites',()=>{
 assert.throws(()=>validate({...sample,marca:'__proto__'},catalog),/Marca fora/);
 assert.throws(()=>validate({...sample,tamanho:0},catalog),/tamanho/);
 assert.throws(()=>validate({...sample,foco:'101% 25%'},catalog),/porcentagens/);
});
test('aceita foto PNG por bytes e rejeita MIME divergente',()=>{
 const input={...sample,imagem:{base64:png.toString('base64'),mimeType:'image/png'}};delete input.fundo;
 assert.equal(validate(input,catalog).image.extension,'png');
 assert.throws(()=>validate({...input,imagem:{...input.imagem,mimeType:'image/jpeg'}},catalog),/correspondente/);
});
test('recusa imagem e fundo simultâneos',()=>{assert.throws(()=>validate({...sample,imagem:{base64:png.toString('base64'),mimeType:'image/png'}},catalog),/uma opção/);});
test('recusa base64 malformado antes de executar renderizador',()=>{assert.throws(()=>validate({...sample,imagem:{base64:'???=',mimeType:'image/png'}},catalog),/base64/);});
test('sem token o renderizador não é chamado',async()=>{
 let count=0;const r={...fake,render:async()=>{count++;throw Error('não chamar');}};
 const response=await request(createHandler({renderer:r,token}),{method:'POST',url:'/v1/cards',value:sample,headers:{authorization:''}});
 assert.equal(response.status,401);assert.equal(count,0);
});
test('não aceita token de configuração curto',()=>{assert.throws(()=>createHandler({renderer:fake,token:'curto'}),/32 bytes/);});
test('origem de navegador exige autorização explícita',async()=>{const r=await request(handler(),{headers:{origin:'https://site-desconhecido.invalid'}});assert.equal(r.status,403);});
test('health vivo não equivale a serviço pronto',async()=>{
 const h=createHandler({renderer:{...fake,ready:false},token});
 assert.equal((await request(h,{url:'/healthz',headers:{authorization:''}})).status,200);
 assert.equal((await request(h,{url:'/readyz'})).status,503);
 assert.equal((await request(h,{url:'/v1/catalog'})).status,503);
});
test('catálogo e ficha disponíveis somente com autenticação',async()=>{
 const h=handler();const c=await request(h);assert.equal(c.json().dsVersion,release.dsVersion);
 const t=await request(h,{url:'/v1/templates/ninja/com-lead'});assert.equal(t.json().variante,'com-lead');
 assert.equal((await request(h,{url:'/v1/templates/desconhecida/com-lead'})).status,404);
});
test('JSON inválido e tamanho do corpo recusados',async()=>{
 assert.equal((await request(handler(),{method:'POST',url:'/v1/cards',raw:Buffer.from('{')})).status,400);
 const h=createHandler({renderer:fake,token,maxBody:8});assert.equal((await request(h,{method:'POST',url:'/v1/cards',value:sample})).status,413);
});
test('recusa Content-Type diferente de JSON',async()=>{assert.equal((await request(handler(),{method:'POST',url:'/v1/cards',value:sample,headers:{'content-type':'text/plain'}})).status,415);});
test('REST retorna imagem base64 e metadados',async()=>{
 const response=await request(handler(),{method:'POST',url:'/v1/cards',value:sample});assert.equal(response.status,200);assert.deepEqual(Buffer.from(response.json().pngBase64,'base64'),png);assert.equal(response.json().metadata.dsVersion,release.dsVersion);
});
test('REST retorna PNG binário quando solicitado',async()=>{
 const response=await request(handler(),{method:'POST',url:'/v1/cards',value:sample,headers:{accept:'image/png'}});assert.equal(response.headers['Content-Type'],'image/png');assert.deepEqual(response.body,png);
});
test('erros internos e logs não revelam entrada, caminho ou segredo',async()=>{
 const logs=[];const r={...fake,render:async()=>{throw Error('segredo /etc/path '+sample.chamada);}};
 const response=await request(createHandler({renderer:r,token,onError:x=>logs.push(x)}),{method:'POST',url:'/v1/cards',value:sample});
 assert.equal(response.status,500);assert.doesNotMatch(response.body.toString()+JSON.stringify(logs),/segredo|etc\/path|Artistas/);
});
test('MCP negocia protocolo, lista ferramentas e retorna imagem inline',async()=>{
 const initialized=await rpc({jsonrpc:'2.0',id:1,method:'initialize',params:{protocolVersion:'2025-11-25'}},fake);assert.equal(initialized.result.protocolVersion,'2025-11-25');
 const list=await rpc({jsonrpc:'2.0',id:2,method:'tools/list'},fake);assert.deepEqual(list.result.tools.map(t=>t.name),['listar_modelos','consultar_modelo','gerar_card']);
 const image=await rpc({jsonrpc:'2.0',id:3,method:'tools/call',params:{name:'gerar_card',arguments:sample}},fake);assert.equal(image.result.content[0].type,'image');assert.deepEqual(Buffer.from(image.result.content[0].data,'base64'),png);
});
test('MCP relata erro de ferramenta e parâmetros sem afirmar sucesso',async()=>{
 const r=await rpc({jsonrpc:'2.0',id:1,method:'tools/call',params:{name:'gerar_card',arguments:{...sample,linhas:['outro']}}},fake);assert.equal(r.result.isError,true);
 assert.equal((await rpc({jsonrpc:'2.0',id:2,method:'inexistente'},fake)).error.code,-32601);
 assert.equal((await rpc([],fake)).error.code,-32600);
});
test('MCP HTTP responde 202 para notificações e 405 para GET',async()=>{
 assert.equal((await request(handler(),{method:'POST',url:'/mcp',value:{jsonrpc:'2.0',method:'notifications/initialized'}})).status,202);
 assert.equal((await request(handler(),{url:'/mcp'})).status,405);
});
test('OpenAPI descreve autenticação e contratos REST',async()=>{
 const result=await request(handler(),{url:'/openapi.json'});assert.equal(result.json().openapi,'3.1.0');assert.equal(result.json().components.securitySchemes.bearerAuth.scheme,'bearer');assert.ok(openapi(catalog).paths['/v1/cards'].post);
});
test('prontidão só aparece após teste de geração',async()=>{
 let executed=false;const r=newRenderer(async args=>{executed=true;assert.equal(r.ready,false);await controlled(args);});
 await r.initialize();assert.equal(executed,true);assert.equal(r.ready,true);
});
test('falha de geração inicial mantém o serviço indisponível',async()=>{
 const r=newRenderer(async()=>{throw new ServiceError(503,'RENDER_FAILED','falha controlada');});await assert.rejects(r.initialize(),/falha controlada/);assert.equal(r.ready,false);
});
test('diretório temporário é isolado e limpo em sucesso e falha',async()=>{
 const dirs=[];const r=newRenderer(async args=>{dirs.push(path.dirname(args.at(-1)));await controlled(args);});r.catalog=catalog;r.ready=true;
 await r.render(sample);await r.render(sample);assert.notEqual(dirs[0],dirs[1]);for(const d of dirs)await assert.rejects(fs.access(d));
 let failedDir;const failure=newRenderer(async args=>{failedDir=path.dirname(args.at(-1));throw Error('falha');});failure.catalog=catalog;failure.ready=true;await assert.rejects(failure.render(sample));await assert.rejects(fs.access(failedDir));
});
test('fila limita concorrência e recusa excesso sem misturar pedidos',async()=>{
 let unblock,entered;const gate=new Promise(resolve=>unblock=resolve),started=new Promise(resolve=>entered=resolve);let count=0;
 const r=newRenderer(async args=>{count++;if(count===1){entered();await gate;}await controlled(args);},{maxQueue:1});r.catalog=catalog;r.ready=true;
 const first=r.render(sample);await started;const second=r.render(sample);await assert.rejects(r.render(sample),e=>e.status===429);unblock();await Promise.all([first,second]);assert.equal(count,2);assert.equal(r.busy,false);
});
test('recusa saída de versão ou hash incorreto',async()=>{
 const r=newRenderer(async args=>{await controlled(args);await fs.writeFile(args.at(-1)+'.ds.json',JSON.stringify({...metadata,dsVersion:'OUTRA'}));});r.catalog=catalog;r.ready=true;await assert.rejects(r.render(sample),e=>e.code==='INVALID_RENDER_OUTPUT');
});
test('processo filho tem timeout e retorna erro de composição separado',async()=>{
 await assert.rejects(execute(['-e','setInterval(()=>{},1000)'],{env:process.env,cwd:os.tmpdir(),timeoutMs:100}),e=>e.code==='RENDER_TIMEOUT');
 await assert.rejects(execute(['-e','console.error("Chamada fora da largura editorial");process.exit(1)'],{env:process.env,cwd:os.tmpdir(),timeoutMs:3000}),e=>e.status===422);
});
test('pedido não espera indefinidamente na fila',async()=>{
 let unblock,entered;const gate=new Promise(resolve=>unblock=resolve),started=new Promise(resolve=>entered=resolve);
 const r=newRenderer(async args=>{entered();await gate;await controlled(args);},{queueWaitMs:10});r.catalog=catalog;r.ready=true;
 const first=r.render(sample);await started;await assert.rejects(r.render(sample),e=>e.code==='QUEUE_TIMEOUT');assert.equal(r.waiting.length,0);unblock();await first;assert.equal(r.busy,false);
});
test('Content-Length excessivo é recusado antes da leitura',async()=>{
 const h=createHandler({renderer:fake,token,maxBody:8});const response=await request(h,{method:'POST',url:'/v1/cards',value:sample,headers:{'content-length':'9999'}});assert.equal(response.status,413);
});
