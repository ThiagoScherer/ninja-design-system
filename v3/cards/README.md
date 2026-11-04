# Criar cards de notícia com o NINJA Design System

Pacote v3 de produção para nove marcas. O catálogo reúne 18 modelos de card 1080 × 1440, com e sem lead. A [lista de marcas e cores](catalogo.json) aponta para os HTMLs e para as fichas JSON ao lado de cada modelo.

## Para o agente

1. Escolha a marca pelo identificador em catalogo.json. Leia a ficha ao lado do modelo correspondente. Use o modelo com lead quando o campo lead tiver conteúdo.
2. Copie [o exemplo de entrada](exemplos/entrada.json) e informe chapéu, chamada, foto, crédito e lead quando houver. A foto aponta para um arquivo no computador, relativo ao JSON. Os textos do exemplo e sua foto são apenas amostras.
3. Informe a chamada também como lista de linhas, na ordem original, e escolha o tamanho em pixels. Respeite as regras da marca. Para NINJA com lead, siga a [lógica de diagramação v3](diagramação-ninja-com-lead.md) e compare as opções no card inteiro. Para cine.ninja com lead, informe também a lista linhasLead. O painel dourado depende da posição da segunda linha da chamada.
4. Rode o comando de exportação. Abra o PNG e confira hierarquia, quebras, enquadramento, crédito, logo, cores e contraste antes de entregar. Os números dos exemplos são referências de composição. Registre a marca, variante, tamanho e quebras finais.

Em blocos NINJA, preserve pontuação interna, interrogações e exclamações. Evite ponto final no fim dos blocos. Preserve palavras e ordem quando ajustar as quebras. Para SOM, use creditoPreto quando o fundo do crédito estiver claro. Use foco para ajustar o enquadramento, por exemplo "55% 42%". O campo cor aceita as opções explicitadas no catálogo para Estudantes, Clímax e Minas NINJA.

## Comandos

Requer Node.js 20 ou superior, npm e Chromium. Rode na pasta cards.

```sh
npm install
npx playwright install chromium
node renderizar.cjs criar exemplos/entrada.json saidas/card.png
node renderizar.cjs exemplos saidas/referencias
```

O primeiro render usa os dados do JSON. O segundo exporta os 18 exemplos de referência. Para usar Chrome já instalado, informe o executável pela variável NINJA_CHROME_PATH. O motor preserva a estrutura aprovada de cada HTML e aplica o conteúdo. A escolha das quebras e o exame visual são responsabilidade do agente.

As fontes e os recursos seguem suas condições de uso. O acesso ao pacote acompanha as permissões do repositório privado.
