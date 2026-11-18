'use strict';

const {createPublicKey,verify}=require('node:crypto');

const issuer='https://token.actions.githubusercontent.com';
const audience='https://ninja-design-system.ngiajr.easypanel.host/v1/cards/github';
const workflow='thiagoscherer/ninja-design-system/.github/workflows/ninja-render.yml@refs/heads/main';
const repositoryId='1443639200';

function githubRenderAuthorization({fetchKeys=fetch,now=Date.now}={}) {
  let cache;
  function getKeys() {
    if (!cache || cache.expires<=now()) {
      const keys=fetchKeys(issuer+'/.well-known/jwks',{
        redirect:'error',signal:AbortSignal.timeout(5000)
      }).then(async response=>{
        if (!response.ok) throw Error('Chaves do GitHub indisponíveis');
        return (await response.json()).keys;
      });
      cache={keys,expires:now()+5*60*1000};
      keys.catch(()=>{if(cache?.keys===keys)cache.expires=now()+30000;});
    }
    return cache.keys;
  }

  return async authorization=>{
    if (typeof authorization!=='string' || authorization.length>12000) return false;
    const match=/^Bearer ([\w-]+)\.([\w-]+)\.([\w-]+)$/.exec(authorization);
    if (!match) return false;
    try {
      const [,header,payload,signature]=match;
      const jwtHeader=JSON.parse(Buffer.from(header,'base64url'));
      const claims=JSON.parse(Buffer.from(payload,'base64url'));
      const time=Math.floor(now()/1000);
      if (jwtHeader.alg!=='RS256' || typeof jwtHeader.kid!=='string' ||
          claims.iss!==issuer || claims.aud!==audience || claims.repository_id!==repositoryId ||
          claims.repository_visibility!=='private' || claims.ref!=='refs/heads/main' ||
          claims.workflow_ref?.toLowerCase()!==workflow || claims.event_name!=='issues' ||
          !Number.isInteger(claims.exp) || !Number.isInteger(claims.nbf) ||
          claims.exp<=time || claims.nbf>time+10 || claims.exp-claims.nbf>600) return false;
      const jwk=(await getKeys()).find(key=>key.kty==='RSA' && key.kid===jwtHeader.kid && key.use==='sig' && key.alg==='RS256');
      if (!jwk) return false;
      const key=createPublicKey({key:jwk,format:'jwk'});
      return verify('RSA-SHA256',Buffer.from(header+'.'+payload),key,Buffer.from(signature,'base64url'));
    } catch {
      return false;
    }
  };
}

module.exports={githubRenderAuthorization};
