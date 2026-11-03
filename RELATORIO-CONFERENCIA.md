# Conferência local — 02/11/2026

Pacote consolidado e seis exemplos reproduzidos. A conferência não reabriu a aprovação visual dos templates e não alterou a Máquina de Vídeos

## Resultado final contra as referências aprovadas

| Exemplo | Dimensão | Comparação |
|---|---|---|
| Card sem lead | 1080 × 1440 | Idêntico, pixel a pixel |
| Card com lead | 1080 × 1440 | Idêntico, pixel a pixel |
| Reels sem lead | 1080 × 1920 | Idêntico, pixel a pixel |
| Thumbnail de uma imagem | 1920 × 1080 | Idêntico, pixel a pixel |
| Thumbnail de duas imagens | 1920 × 1080 | 160 pixels com diferença máxima de 1/255 por canal |
| Thumbnail de três imagens | 1920 × 1080 | 105 pixels com diferença máxima de 1/255 por canal |

As diferenças residuais das thumbnails atingem menos de 0,008% dos pixels; não há mudança de posição, conteúdo ou medida. Fonte, enquadramento, margens, assinatura, créditos e gradientes foram inspecionados nas prévias. Resultados numéricos em `resultados/comparacao.json` e medidas em `resultados/verificacao.json`

## Portabilidade

O pacote inteiro foi copiado para uma pasta temporária independente e os seis exemplos foram renderizados novamente. Todos os recursos carregaram. Cinco exemplos ficaram idênticos à saída local; a thumbnail de duas imagens teve diferença máxima de 1/255. Não foram encontrados caminhos absolutos pessoais nos dados, templates ou motor. Ver `resultados/portabilidade.json`

O teste usa as dependências e o navegador instalados neste computador, com uma cópia isolada dos arquivos do pacote. Não é um teste em outro sistema operacional nem uma instalação limpa das dependências pela internet

## Alterações na organização

Fontes centralizadas na definição de marca; recursos externos ao HTML, dentro do pacote; margens consultadas nos fundamentos por mídia; medidas específicas nos três arquivos de templates; conteúdo e resultado tipográfico da entrega em arquivos de exemplo separados. Variações com e sem lead pertencem ao template card. O acervo histórico original permanece preservado

Foram adicionados testes de contrato: aceita o exemplo válido e rejeita dimensão incompatível, ponto final no bloco, quebras que alteram conteúdo, lead no Reels e composição tipográfica ausente

## Limitações registradas

- O motor reproduz composições explícitas revisadas; o ajuste autônomo de todo texto novo não foi consolidado nesta versão
- Inspeção visual e verificação de encaixe de novas entregas continuam responsabilidade do agente
- Houve oscilação na rasterização de fotos em execuções intermediárias do navegador, sem alteração das medidas. A saída final e o teste de cópia chegaram aos resultados acima; não se garante identidade de pixels entre ambientes ou todas as execuções
- A primeira versão não implementa animação ou codificação de vídeo
- A instalação limpa, licenças de distribuição dos recursos e integração da Máquina são etapas distintas desta conferência local

Entradas de uso: `LEIA-PRIMEIRO.md` e `GUIA-AGENTES.md`. Nenhum arquivo foi publicado no GitHub
