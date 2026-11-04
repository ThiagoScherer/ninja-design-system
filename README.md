# NINJA Design System

## Criar cards de notícia

Para produzir cards, comece pelo [guia de produção](v3/cards/README.md). O agente encontra o catálogo das nove marcas, modelos com e sem lead, exemplos e comandos para gerar o PNG. A v3 de cards inclui a diagramação aprovada para notícia NINJA com lead.

## Integrar a Máquina de Vídeos

Comece pelas [instruções de integração da v2](v2/IMPLEMENTAR-COM-AGENTE.md).

## Biblioteca original v1

Entrada para agentes e para a integração da Máquina de Vídeos. Este pacote funciona sem consultar o histórico da conversa. Versão da biblioteca: 1.0.0; estrutura do contrato: 0.1.0

## O que contém

- Fundamentos da marca: cores, papéis tipográficos, espaçamentos e perfis de mídia
- Três templates: card de notícia com e sem lead, notícia Reels sem lead e thumbnail com uma, duas ou três imagens
- Fontes, logos e fotos locais utilizados nos seis exemplos, com caminhos relativos
- Conteúdos de exemplo separados das definições de composição
- Renderizador, referências aprovadas e relatório da conferência

Comece por `GUIA-AGENTES.md`. Para integrar a Máquina, leia também `documentacao/05-integracao-maquina-de-videos.md`. As diferenças conhecidas continuam sendo orientações: a aplicação não foi modificada

## Como conferir

Instale Node.js e as dependências do pacote: `npm install`. Instale o navegador do Playwright com `npx playwright install chromium`. Depois execute `npm run conferir`. Para um Chrome já instalado, informe seu executável em `NINJA_CHROME_PATH`

Os seis exemplos são exportados para `resultados`. Também é possível executar `node ferramentas/renderizar.cjs reels` ou outro nome de arquivo da pasta `exemplos`, sem a extensão. HTML e PNG usam a mesma composição

Verificações de contrato: `node ferramentas/testar-contrato.cjs`. Comparação de imagens: com Python e Pillow instalados, executar `python ferramentas/conferir-imagens.py`. O ambiente de referência foi Node.js, Playwright 1.62.1 e Chrome local no macOS; diferenças de navegador e rasterização podem produzir variações mínimas

## Escopo e limites

A v1 é uma biblioteca local com renderização estática e referências verificadas, não a integração da Máquina, nem um serviço de vídeo. Reels neste pacote representa o quadro gráfico aprovado; não codifica MP4, duração, áudio ou animação

O motor requer tamanho e linhas revisados em `composicao_referencia`. Não calcula automaticamente todos os cenários de texto. O agente compõe e revisa a entrega seguindo o guia; o valor de um exemplo não é um tamanho fixo universal. O piloto anterior de ajuste automático permanece experimental, fora deste motor

As variantes de card preservam fotos e alturas diferentes dos respectivos exemplos aprovados. Isso é explícito em suas definições; não implica um fim de fotografia universal para toda notícia. Revise o enquadramento e a altura visível em novas composições

Este pacote é local e privado. Não publicar os recursos de fonte e imagem automaticamente: a presença no acervo não documenta licenças de redistribuição. Os outros afluentes permanecem no acervo principal e não foram incluídos nesta distribuição
