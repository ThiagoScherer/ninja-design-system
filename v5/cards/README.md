# Cards de notícia — V5 RC1

Nove marcas em `catalogo.json`, com modelos, fontes, logos, fichas e renderizador. Leia a ficha antes de compor

O agente prepara uma entrada JSON com `marca`, `chapeu`, `chamada`, `linhas`, `tamanho`, `credito` e `foto` (caminho local). Acrescenta `lead` quando necessário; cine.ninja com lead exige também `linhasLead`. Para teste sem foto, pode usar `fundo` hexadecimal. Não informar uma foto inexistente

As linhas devem preservar o texto e a ordem das palavras. O corpo é escolhido após medir com a fonte do template; não usar o tamanho do exemplo como padrão fixo. Comparar alternativas e revisar visualmente, preservando margens, hierarquia e ornamentos. Os limites específicos de SOM e Estudantes continuam válidos

O comando instalado é `python3 .ninja-design-system/gerar.py criar entrada.json card.png`. O renderizador conserva os espaçamentos do modelo, recusa transbordamento ou fontes ausentes e exporta metadados em `card.png.ds.json`

A IA deve conferir visualmente o PNG antes de entregar. Não publicar só porque passou a conferência geométrica. Em cine.ninja, preservar os boxes e o painel dourado; no Clímax, preservar a máscara de barras

Testes aprovados NINJA: `testes/curta-*.json`, `media-*.json` e `longa-*.json`. São referências de composição, não imposição de número de linhas a novos conteúdos
