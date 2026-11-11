const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');
const crypto = require('node:crypto');
const RELEASE = '5.0.0-rc.1';

const lerJson = async arquivo => JSON.parse(await fs.readFile(arquivo, 'utf8'));
const normalizar = texto => texto.normalize('NFC').replace(/\s+/g, ' ').trim().toLocaleUpperCase('pt-BR');
const limpar = texto => texto.trim().replace(/(?<!\.)\.$/, '');
const tiposFoto = {'.png':'png','.jpg':'jpeg','.jpeg':'jpeg','.webp':'webp','.avif':'avif'};
const variantes = ['com-lead','sem-lead'];

async function abrir(browser, modelo) {
  const page = await browser.newPage({viewport:{width:1080,height:1440},deviceScaleFactor:1});
  const erros = [];
  page.on('pageerror', erro => erros.push(erro.message));
  page.on('requestfailed', pedido => erros.push(pedido.url()));
  try {
    await page.goto(pathToFileURL(modelo).href);
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(Array.from(document.images, imagem => imagem.decode()));
      if ([...document.fonts].some(fonte => fonte.status === 'error')) throw Error('Falha ao carregar fonte');
    });
    return {page, erros};
  } catch (erro) {
    await page.close();
    throw erro;
  }
}

async function aplicar(page, entrada, foto) {
  await page.evaluate(async ({entrada, foto}) => {
    const card = document.querySelector('.card');
    const chamada = card.querySelector('.headline');
    const chapeu = card.querySelector('.hat');
    const lead = card.querySelector('.lead');
    const credito = card.querySelector('.credit');
    const fotoEl = card.querySelector('.photo');
    const linha = chamada.querySelector('span');
    const criarLinha = (texto, original) => {
      const span = original?.cloneNode(false) ?? document.createElement('span');
      span.style.display = 'block';
      span.style.whiteSpace = 'nowrap';
      span.textContent = texto;
      return span;
    };
    chamada.replaceChildren(...entrada.linhas.map(texto => criarLinha(texto, linha)));
    chamada.style.setProperty('font-size', entrada.tamanho + 'px', 'important');
    chapeu.textContent = entrada.chapeu;
    credito.textContent = entrada.credito;
    if (lead && entrada.marca === 'cine-ninja') {
      const exemplo = lead.querySelector('span');
      lead.replaceChildren(...entrada.linhasLead.map(texto => criarLinha(texto, exemplo)));
      for (const span of lead.children) span.style.display = 'table';
    } else if (lead) {
      lead.textContent = entrada.lead;
      lead.style.textWrap = 'balance';
    }
    if (entrada.corHex && entrada.marca === 'climax') card.style.setProperty('--accent', entrada.corHex);
    if (entrada.corHex && entrada.marca === 'estudantes') chapeu.style.setProperty('background', entrada.corHex, 'important');
    if (entrada.cor === 'laranja' && entrada.marca === 'minas-ninja' && entrada.variante === 'com-lead') {
      chapeu.style.background = entrada.corHex;
      credito.style.color = '#647434';
      card.querySelector('.logo').src = entrada.iconeLaranja;
    }
    if (entrada.creditoPreto) credito.style.color = '#000';
    if (entrada.foco) fotoEl.style.setProperty('object-position', entrada.foco, 'important');
    if (foto) fotoEl.src = foto;
    if (entrada.fundo) {
      card.style.background = entrada.fundo;
      card.querySelectorAll('.photo,.gradient,.shade,.top-shade').forEach(e => e.style.setProperty('display','none','important'));
    }
    card.querySelectorAll('.test,.fiction,.fiction-label').forEach(el => el.remove());
    await document.fonts.ready;
    await Promise.all(Array.from(document.images, img => img.decode()));
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }, {entrada, foto});
}

async function verificar(page) {
  return page.evaluate(() => {
    const card = document.querySelector('.card');
    const quadro = card.getBoundingClientRect();
    if (quadro.width !== 1080 || quadro.height !== 1440) throw Error('Dimensão de card inesperada');
    const alertas = [];
    const chamada = card.querySelector('.headline');
    const editorial = card.querySelector('.editorial');
    const limites = editorial.getBoundingClientRect();
    for (const el of card.querySelectorAll('.headline,.hat,.lead,.credit')) {
      const intervalo = document.createRange();
      intervalo.selectNodeContents(el);
      for (const rect of intervalo.getClientRects()) {
        if (rect.left < quadro.left - 1 || rect.right > quadro.right + 1 || rect.top < quadro.top - 1 || rect.bottom > quadro.bottom + 1) {
          alertas.push('Texto fora do quadro: ' + el.className);
          break;
        }
        if (el === chamada && (rect.left < limites.left - 2 || rect.right > limites.right + 2)) {
          alertas.push('Chamada fora da largura editorial');
          break;
        }
      }
    }
    const topo = Math.min(...Array.from(card.querySelectorAll('.hat,.headline,.lead'), el => el.getBoundingClientRect().top)) - quadro.top;
    const rect = e => {const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom}};
    const hat=rect(card.querySelector('.hat')), title=rect(chamada), leadEl=card.querySelector('.lead'), lead=leadEl?rect(leadEl):null;
    const gaps={hatToHeadline:title.y-hat.bottom,headlineToLead:lead?lead.y-title.bottom:null,editorialBottomToCard:quadro.bottom-limites.bottom};
    for (const [a,b] of [[hat,title],...(lead?[[title,lead]]:[])]) if (b.y<a.bottom-.5) alertas.push('Blocos editoriais sobrepostos');
    const fonts=[];
    for(const sel of ['.hat','.headline','.lead','.credit']) {
      const e=card.querySelector(sel);if(!e)continue;const c=getComputedStyle(e);
      const family=c.fontFamily.split(',')[0].trim().replace(/["']/g,'');
      const faces=[...document.fonts].filter(f=>f.family.replace(/["']/g,'')===family);
      const loaded=faces.some(f=>f.status==='loaded')&&document.fonts.check(c.fontWeight+' '+c.fontSize+' '+c.fontFamily);
      fonts.push({element:sel,family,size:parseFloat(c.fontSize),loaded});
      if(!loaded)alertas.push('Fonte oficial ausente ou não carregada: '+family);
    }
    return {largura:quadro.width,altura:quadro.height,topoBlocoEditorial:Math.round(topo),gaps,fonts,alertas:[...new Set(alertas)]};
  });
}

function validarLinhas(texto, linhas, campo) {
  if (!Array.isArray(linhas) || !linhas.length || linhas.some(x => typeof x !== 'string' || !x.trim()) ||
      normalizar(linhas.join(' ')) !== normalizar(texto)) {
    throw Error(campo + ' deve preservar o texto e a ordem das palavras');
  }
}

async function preparar(arquivo, catalogo) {
  const entrada = await lerJson(arquivo);
  for (const campo of ['chapeu','chamada','credito']) {
    if (typeof entrada[campo] !== 'string' || !entrada[campo].trim()) throw Error('Campo obrigatório: ' + campo);
  }
  for (const campo of ['chapeu','chamada','lead','credito']) if (typeof entrada[campo] === 'string') entrada[campo] = limpar(entrada[campo]);
  for (const campo of ['linhas','linhasLead']) {
    if (Array.isArray(entrada[campo]) && typeof entrada[campo].at(-1) === 'string') {
      entrada[campo][entrada[campo].length-1] = limpar(entrada[campo].at(-1));
    }
  }
  if (!entrada.foto && !/^#[0-9a-f]{6}$/i.test(entrada.fundo || '')) throw Error('Informe foto ou fundo hexadecimal #RRGGBB');
  if (entrada.foto && typeof entrada.foto !== 'string') throw Error('foto deve ser um caminho local');
  entrada.variante = entrada.lead ? 'com-lead' : 'sem-lead';
  const marca = catalogo.marcas[entrada.marca];
  if (!marca) throw Error('Marca fora do catálogo: ' + entrada.marca);
  const modelo = marca.variantes[entrada.variante];
  validarLinhas(entrada.chamada, entrada.linhas, 'linhas');
  if (!Number.isFinite(entrada.tamanho) || entrada.tamanho <= 0) throw Error('Informe tamanho da chamada em px');
  if (entrada.marca === 'som' && entrada.tamanho > 96) throw Error('O máximo aprovado para SOM é 96 px');
  if (entrada.marca === 'estudantes' && entrada.tamanho > 116) throw Error('O máximo aprovado para Estudantes é 116 px');
  if (entrada.marca === 'cine-ninja') {
    if (entrada.linhas.length < 2) throw Error('cine.ninja requer uma segunda linha para posicionar o painel dourado');
    if (entrada.lead) validarLinhas(entrada.lead, entrada.linhasLead, 'linhasLead');
  }
  if (entrada.cor) {
    entrada.corHex = marca.cores?.[entrada.cor];
    if (!entrada.corHex) throw Error('Cor fora do catálogo desta marca: ' + entrada.cor);
    if (entrada.marca === 'minas-ninja' && entrada.cor === 'laranja') {
      const alternativo = path.join(__dirname,'modelos/minas-ninja/sem-lead-laranja/modelo.html');
      if (entrada.variante === 'sem-lead') return {entrada,modelo:alternativo};
      const html = await fs.readFile(alternativo, 'utf8');
      const src = html.match(/<img class="logo" src="([^"]+)"/)?.[1];
      if (!src) throw Error('Ícone laranja ausente');
      entrada.iconeLaranja = pathToFileURL(path.resolve(path.dirname(alternativo), src)).href;
    }
  }
  return {entrada,modelo:path.join(__dirname,modelo)};
}

async function main() {
  const [modo, arg, saida] = process.argv.slice(2);
  if (!['criar','exemplos'].includes(modo) || !arg || (modo === 'criar' && !saida)) {
    throw Error('Uso: node renderizar.cjs criar entrada.json saida.png | node renderizar.cjs exemplos pasta-saida');
  }
  const catalogo = await lerJson(path.join(__dirname,'catalogo.json'));
  const browser = await chromium.launch(process.env.NINJA_CHROME_PATH ? {executablePath:process.env.NINJA_CHROME_PATH} : {});
  try {
    if (modo === 'criar') {
      const {entrada,modelo} = await preparar(arg,catalogo);
      let foto=null;
      if(entrada.foto){
        const arquivoFoto = path.resolve(path.dirname(arg), entrada.foto);
        const tipo = tiposFoto[path.extname(arquivoFoto).toLowerCase()];
        if (!tipo) throw Error('Use uma foto JPG, PNG, WebP ou AVIF');
        foto = 'data:image/'+tipo+';base64,'+(await fs.readFile(arquivoFoto)).toString('base64');
      }
      const {page,erros} = await abrir(browser,modelo);
      await aplicar(page,entrada,foto);
      const medidas = await verificar(page);
      if (erros.length || medidas.alertas.length) throw Error([...erros,...medidas.alertas].join('\n'));
      await fs.mkdir(path.dirname(path.resolve(saida)),{recursive:true});
      const expected=(await lerJson(path.join(__dirname,'espacamentos.json'))).templates[entrada.marca+'/'+entrada.variante];
      if(expected)for(const [key,value]of Object.entries(expected))if(Math.abs(medidas.gaps[key]-value)>.1)throw Error('Espaçamento divergente do template: '+key);
      await page.screenshot({path:saida});
      const metadata={dsVersion:RELEASE,renderer:'cards/renderizar.cjs',template:entrada.marca+'/'+entrada.variante,createdAt:new Date().toISOString(),sha256:crypto.createHash('sha256').update(await fs.readFile(saida)).digest('hex'),entrada:{chapeu:entrada.chapeu,chamada:entrada.chamada,linhas:entrada.linhas,tamanho:entrada.tamanho,lead:entrada.lead||null},...medidas};
      await fs.writeFile(saida+'.ds.json',JSON.stringify(metadata,null,2)+'\n');
      console.log(JSON.stringify({saida,...metadata},null,2));
      return;
    }
    await fs.mkdir(arg,{recursive:true});
    const resultados = [];
    for (const [slug,marca] of Object.entries(catalogo.marcas)) {
      for (const variante of variantes) {
        const {page,erros} = await abrir(browser,path.join(__dirname,marca.variantes[variante]));
        const medidas = await verificar(page);
        const destino = path.join(arg,slug+'-'+variante+'.png');
        await page.screenshot({path:destino});
        resultados.push({slug,variante,...medidas,erros});
        await page.close();
      }
    }
    console.log(JSON.stringify(resultados,null,2));
    if (resultados.some(r => r.erros.length || r.alertas.length)) process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

if (require.main === module) main().catch(erro => { console.error(erro.message); process.exitCode = 1; });
module.exports={abrir,aplicar,verificar,preparar,validarLinhas};

