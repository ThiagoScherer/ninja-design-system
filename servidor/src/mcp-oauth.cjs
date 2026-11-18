'use strict';

const {createPublicKey, verify}=require('node:crypto');

const protectedResourcePath='/.well-known/oauth-protected-resource/mcp';
const renderScope='render:cards';

function createMcpOAuth({issuer, resource, subjects, fetchKeys=fetch, now=Date.now}) {
  const issuerUrl=new URL(issuer);
  const resourceUrl=new URL(resource);
  if (issuerUrl.protocol!=='https:' || issuer!==issuerUrl.origin+'/' ||
      resourceUrl.protocol!=='https:' || resource!==resourceUrl.origin+'/mcp' || !subjects.size) {
    throw Error('Configuração OAuth do renderizador inválida');
  }

  let cache;
  function getKeys() {
    if (!cache || cache.expires<=now()) {
      const entry={expires:now()+300000};
      entry.keys=fetchKeys(new URL('.well-known/jwks.json',issuerUrl),{
        redirect:'error',signal:AbortSignal.timeout(5000)
      }).then(async response=>{
        if (!response.ok) throw Error('Chaves do provedor OAuth indisponíveis');
        const {keys}=await response.json();
        if (!Array.isArray(keys)) throw Error('Chaves do provedor OAuth inválidas');
        return keys;
      }).catch(error=>{
        entry.expires=now()+30000;
        throw error;
      });
      cache=entry;
    }
    return cache.keys;
  }

  async function authorize(authorization) {
    if (typeof authorization!=='string' || authorization.length>12000) return false;
    const match=/^Bearer ([\w-]+)\.([\w-]+)\.([\w-]+)$/i.exec(authorization);
    if (!match) return false;
    try {
      const [, encodedHeader, encodedClaims, signature]=match;
      const header=JSON.parse(Buffer.from(encodedHeader,'base64url'));
      const claims=JSON.parse(Buffer.from(encodedClaims,'base64url'));
      const audience=Array.isArray(claims.aud)?claims.aud:[claims.aud];
      const time=Math.floor(now()/1000);
      if (header.alg!=='RS256' || typeof header.kid!=='string' || claims.iss!==issuer ||
          !audience.includes(resource) || !subjects.has(claims.sub) ||
          !Number.isInteger(claims.exp) || claims.exp<=time ||
          (claims.nbf!==undefined && (!Number.isInteger(claims.nbf) || claims.nbf>time)) ||
          typeof claims.scope!=='string' || !claims.scope.split(' ').includes(renderScope)) return false;

      const jwk=(await getKeys()).find(key=>key.kid===header.kid && key.kty==='RSA' && key.use==='sig' &&
        (key.alg===undefined || key.alg==='RS256'));
      if (!jwk) return false;
      const key=createPublicKey({key:jwk,format:'jwk'});
      return verify('RSA-SHA256',Buffer.from(`${encodedHeader}.${encodedClaims}`),key,Buffer.from(signature,'base64url'));
    } catch {
      return false;
    }
  }

  return {
    authorize,
    metadata:{resource,authorization_servers:[issuer],scopes_supported:[renderScope],bearer_methods_supported:['header']},
    challenge:`Bearer resource_metadata="${resourceUrl.origin}${protectedResourcePath}", scope="${renderScope}"`
  };
}

function mcpOAuthFromEnv(env) {
  const {NINJA_OAUTH_ISSUER:issuer,NINJA_MCP_URL:resource,NINJA_OAUTH_SUBJECTS:allowed}=env;
  if (!issuer && !resource && !allowed) return undefined;
  const subjects=new Set((allowed||'').split(',').map(subject=>subject.trim()).filter(Boolean));
  if (!issuer || !resource || !subjects.size) throw Error('Configuração OAuth do renderizador incompleta');
  return createMcpOAuth({issuer,resource,subjects});
}

module.exports={createMcpOAuth,mcpOAuthFromEnv,protectedResourcePath};
