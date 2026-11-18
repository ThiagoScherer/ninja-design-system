'use strict';

const {test}=require('node:test');
const assert=require('node:assert/strict');
const {generateKeyPairSync, sign}=require('node:crypto');
const {Readable}=require('node:stream');
const {createHandler}=require('../src/api.cjs');
const {createMcpOAuth, mcpOAuthFromEnv, protectedResourcePath}=require('../src/mcp-oauth.cjs');

const issuer='https://ninja-test.example/';
const resource='https://render.example/mcp';
const subject='github|123';
const time=1700000000;
const legacyToken='token-de-teste-com-mais-de-trinta-e-dois-bytes';
const {publicKey, privateKey}=generateKeyPairSync('rsa',{modulusLength:2048});
const jwk={...publicKey.export({format:'jwk'}),kid:'test',use:'sig',alg:'RS256'};

function bearer(claims={}, header={}) {
  const encode=value=>Buffer.from(JSON.stringify(value)).toString('base64url');
  const encodedHeader=encode({alg:'RS256',kid:jwk.kid,...header});
  const encodedClaims=encode({iss:issuer,aud:resource,sub:subject,exp:time+60,scope:'render:cards',...claims});
  const data=`${encodedHeader}.${encodedClaims}`;
  return `Bearer ${data}.${sign('RSA-SHA256',Buffer.from(data),privateKey).toString('base64url')}`;
}

function oauth() {
  return createMcpOAuth({issuer,resource,subjects:new Set([subject]),now:()=>time*1000,fetchKeys:async url=>{
    assert.equal(url.href,`${issuer}.well-known/jwks.json`);
    return Response.json({keys:[jwk]});
  }});
}

test('OAuth valida a assinatura e restringe emissor, recurso, identidade, validade e permissão',async()=>{
  const {authorize}=oauth();
  assert.equal(await authorize(bearer()),true);
  assert.equal(await authorize(bearer({aud:[resource,`${issuer}userinfo`]})),true);
  for (const claims of [{iss:'https://outro.example/'},{aud:`${issuer}userinfo`},{sub:'github|456'},
    {exp:time},{nbf:time+60},{scope:'openid'},{scope:undefined}]) {
    assert.equal(await authorize(bearer(claims)),false);
  }
  assert.equal(await authorize(bearer({}, {alg:'none'})),false);
  assert.equal(await authorize(bearer().replace(/\.[^.]+$/,'.ZmFrZQ')),false);
});

test('MCP anuncia OAuth e aceita ambos os tokens, com OAuth restrito a /mcp',async()=>{
  const handler=createHandler({renderer:{ready:true},token:legacyToken,mcpOAuth:oauth()});
  async function request(method,url,authorization) {
    const req=Readable.from([Buffer.from(JSON.stringify({jsonrpc:'2.0',id:1,method:'ping'}))]);
    Object.assign(req,{method,url,headers:{authorization,'content-type':'application/json'}});
    const response={};
    await handler(req,{writeHead(status,headers){Object.assign(response,{status,headers});},
      end(data){if(data)response.body=JSON.parse(data.toString());}});
    return response;
  }
  const unauthorized=await request('POST','/mcp');
  assert.equal(unauthorized.status,401);
  assert.equal(unauthorized.headers['WWW-Authenticate'],
    `Bearer resource_metadata="https://render.example${protectedResourcePath}", scope="render:cards"`);
  const discovery=await request('GET',protectedResourcePath);
  assert.equal(discovery.status,200);
  assert.deepEqual(discovery.body,{resource,authorization_servers:[issuer],
    scopes_supported:['render:cards'],bearer_methods_supported:['header']});
  assert.equal((await request('POST','/mcp',bearer())).status,200);
  assert.equal((await request('POST','/mcp',`Bearer ${legacyToken}`)).status,200);
  assert.equal((await request('GET','/v1/catalog',bearer())).status,401);
  assert.equal((await request('POST','/v1/cards/github',bearer())).status,401);
});

test('OAuth é opcional e configuração parcial falha antes de expor a rota',()=>{
  assert.equal(mcpOAuthFromEnv({}),undefined);
  assert.throws(()=>mcpOAuthFromEnv({NINJA_OAUTH_ISSUER:issuer}),/incompleta/);
  assert.throws(()=>createMcpOAuth({issuer,resource:'http://render.example/mcp',subjects:new Set([subject])}),/inválida/);
});
