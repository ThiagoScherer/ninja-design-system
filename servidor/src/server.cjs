'use strict';
const path=require('node:path');
const fs=require('node:fs/promises');
const http=require('node:http');
const {Renderer}=require('./renderer.cjs');
const {createHandler}=require('./api.cjs');
const {githubRenderAuthorization}=require('./github-oidc.cjs');
async function start(){
 const base=path.resolve(__dirname,'..');const release=JSON.parse(await fs.readFile(path.join(base,'release.json'),'utf8'));
 const packageRoot=path.resolve(process.env.NINJA_PACKAGE_ROOT||path.join(base,'pacote'));
 const renderer=new Renderer({packageRoot,expectedHash:release.integritySha256,version:release.dsVersion,nodeModules:process.env.NINJA_NODE_MODULES||path.join(base,'node_modules'),browserPath:process.env.NINJA_BROWSER_PATH});
 // Recusar configuração incompleta antes de abrir o navegador.
 const handler=createHandler({renderer,token:process.env.NINJA_RENDER_TOKEN,authorizeGithubRender:githubRenderAuthorization(),allowedOrigins:(process.env.NINJA_ALLOWED_ORIGINS||'').split(',').filter(Boolean),onError:record=>console.error(JSON.stringify(record))});
 const host=process.env.HOST||'127.0.0.1',port=Number(process.env.PORT||8080);
 if(!Number.isInteger(port)||port<1||port>65535)throw new Error('PORT inválida');
 const server=http.createServer(handler);server.requestTimeout=120000;server.headersTimeout=10000;server.timeout=120000;
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,host,resolve);});
 console.log(JSON.stringify({status:'starting',dsVersion:release.dsVersion,host,port}));
 try{await renderer.initialize();}catch(error){server.close();throw error;}
 console.log(JSON.stringify({status:'ready',dsVersion:release.dsVersion}));
 const shutdown=()=>{renderer.ready=false;server.close(()=>process.exit(0));setTimeout(()=>process.exit(1),55000).unref();};
 process.once('SIGTERM',shutdown);process.once('SIGINT',shutdown);
 return {server,renderer};
}
if(require.main===module)start().catch(error=>{console.error(JSON.stringify({status:'failed',code:error.code||'STARTUP_FAILED',message:'O serviço não passou na preparação ou no teste real de geração'}));process.exitCode=1;});
module.exports={start};
