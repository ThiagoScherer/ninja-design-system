# Teste pareado do degradê NINJA sobre verde

Estes seis casos acrescentam à rodada Windows a verificação do escurecimento oficial atrás do bloco editorial. Não adicionam uma sombra nova às letras

## Por que usar uma imagem verde

O parâmetro `fundo` do renderizador oculta `.photo`, `.gradient`, `.shade` e `.top-shade`. Portanto, os seis casos originais continuam sendo controles sem degradê

Os JSON desta pasta preservam integralmente os campos editoriais dos seis casos originais. A única troca é remover `fundo: "#167a46"` e informar `foto: "../fundo-verde.png"`. O PNG é uma imagem RGB uniforme 1080 × 1440, cor #167a46, sem texto nem efeitos. Seu SHA-256 é `c44264341bf8026f5b345e65cfd0151fa742f035f3189c253ad95b8a64262d71`

Isso ativa o caminho normal de fotografia do renderizador, mantendo o degradê definido nos templates. Não editar os templates, o renderizador ou o pacote instalado. Não usar simultaneamente `fundo` nesses casos, pois ele desativaria o efeito novamente

## Gerar no projeto instalado

Usar o mesmo commit candidato da rodada, o mesmo navegador e o gerador oficial instalado. Exemplo para um caso, ajustando apenas os caminhos:

```sh
python .ninja-design-system/gerar.py criar /caminho/do/clone/testes/sombras/entradas/media-com-lead.json saida/sombras/media-com-lead.png
```

Repetir para curta, média e longa, com e sem lead. Manter os seis controles de `v5/cards/testes/` em `saida/controle/` e os seis casos desta pasta em `saida/sombras/`. Entregar os 12 PNGs e os 12 arquivos `.png.ds.json` em um ZIP

## Conferir cada par

- Fundo superior verde e transição suave para preto, sem faixas ou cortes inesperados
- O início do degradê deve acompanhar a posição do chapéu: 80 px acima dele, limitado ao topo do card, conforme a regra atual do template
- A base preta deve respeitar o limite inferior da imagem usado por cada template; com e sem lead têm geometrias próprias, sem exigir que ambos terminem o degradê na mesma altura
- Textos, quebras, corpos, margens, espaçamentos, crédito e assinatura devem manter a mesma geometria do controle. A cor de fundo atrás deles muda; não esperar igualdade dos pixels desses contornos
- Fontes carregadas, 1080 × 1440 e ausência de alertas nos metadados
- Comparar as saídas do Windows com saídas do mesmo commit e navegador identificado. Registrar diferenças de rasterização sem aprová-las automaticamente

Os seis casos sem degradê conservam as referências anteriores. Os seis casos novos são evidências adicionais de teste e precisam de revisão visual antes de virarem referências. Nenhum PNG de saída com degradê foi gerado ou aprovado na preparação destes arquivos

## Limite

Este teste isola o degradê sobre verde uniforme. Ele permite conferir posição e transição, mas não substitui a avaliação de legibilidade em fotografias com regiões claras, escuras e detalhadas. A assinatura NINJA continua sujeita à decisão já registrada
