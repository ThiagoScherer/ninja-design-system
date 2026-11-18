'use strict';
const fs=require('node:fs/promises');
const path=require('node:path');
const crypto=require('node:crypto');
const {verifyPackage}=require('../src/renderer.cjs');
(async()=>{
 const source=path.resolve(__dirname,'..'),root=path.resolve(source,'..');
 const destination=process.argv[2]?path.resolve(process.argv[2]):path.join(root,'output/servidor-ninja-rc2');
 if(destination===source||source.startsWith(destination+path.sep))throw Error('Destino não pode sobrescrever o código-fonte');
 try{await fs.access(destination);throw Error('Destino já existe; informe outra pasta para preservar o pacote anterior');}catch(e){if(e.code!=='ENOENT')throw e;}
 const release=JSON.parse(await fs.readFile(path.join(source,'release.json'),'utf8'));
 const choices=[path.join(root,'candidatos/v5-rc2/v5'),path.join(root,'distribuicao/ninja-ds-v5-rc2/v5'),path.join(source,'pacote')];
 let packageRoot;for(const choice of choices){try{await fs.access(path.join(choice,'arquivos.sha256.json'));packageRoot=choice;break;}catch{}}
 if(!packageRoot)throw Error('Pacote RC2 não encontrado; obter o snapshot completo de candidatos/v5-rc2');
 await verifyPackage(packageRoot,release.integritySha256);
 await fs.mkdir(destination,{recursive:true});
 for(const name of ['src','scripts','testes','package.json','package-lock.json','release.json','Dockerfile','.dockerignore','.env.example','README.md','GUIA-AGENTES.md','HOSPEDAGEM.md','VALIDACAO.json','compose.yaml','Caddyfile'])await fs.cp(path.join(source,name),path.join(destination,name),{recursive:true});
 await fs.cp(packageRoot,path.join(destination,'pacote'),{recursive:true});
 const files={};
 async function walk(dir){for(const item of await fs.readdir(dir,{withFileTypes:true})){const full=path.join(dir,item.name);if(item.isDirectory())await walk(full);else if(item.isFile())files[path.relative(destination,full).split(path.sep).join('/')]=crypto.createHash('sha256').update(await fs.readFile(full)).digest('hex');}}
 await walk(destination);
 await fs.writeFile(path.join(destination,'arquivos-servidor.sha256.json'),JSON.stringify({schema:'ninja-render-server/package',version:'0.1.0',dsVersion:release.dsVersion,files},null,2)+'\n');
 console.log(JSON.stringify({status:'pacote-preparado-nao-hospedado',directory:destination,dsVersion:release.dsVersion,files:Object.keys(files).length}));
})().catch(error=>{console.error(error.message);process.exitCode=1;});
