# Issue #1 — Contribuição: o sistema de vídeo do YouTube NINJA

Origem: https://github.com/ThiagoScherer/ninja-design-system/issues/1
Autor: gian-dot
Estado: relato recebido; aprovação local não equivale a aprovação global do DS

**Para o agente:** esta Issue é o contexto das demais (2 a 7). Podem ser organizadas na ordem que fizer sentido para o design system.

### Quem cuida de quê

A parte de vídeo do YouTube NINJA é administrada pelo Gian. A identidade visual (cores, fontes, marcas, fundamentos) continua vindo do design system do Thiago, e a Máquina se adapta a ele. Nada aqui altera o repositório: são sugestões para incorporar como e quando fizer sentido.

### O que já existe

A Máquina de Vídeos é o app local das editoras do YouTube NINJA, na versão 1.3.1. O fluxo:

- **Locução:** gera a voz e a legenda `.srt`.
- **Legenda:** transcreve a fala de um trecho cortado.
- **Acabamento:** lê o roteiro no Notion, o Claude sugere as peças, a editora confere no preview e exporta para a pasta do dia no Drive.
- **Conferência:** confere o export (tela preta, silêncio, volume, duração).

O sistema gráfico de vídeo, feito sobre a v2:

- **23 composições implementadas** em 16x9 e 9x16, aprovadas em consulta com a equipe (5 pessoas, 228 registros, 02 a 04/11).
- **8 componentes compartilhados:** chapéu, caixa de texto, contraste, grifo, cartão, mídia, identificação e crédito.
- **25 variantes num arquivo só:** 8 vêm das decisões D1 a D8 e 17 são legado identificado (Issue 5).
- **Um motor único de animação**, usado no preview, no render e no estúdio (Issue 4).
- **Estúdio** que desenha todas as peças com os mesmos módulos do app.
- **Saída automática:** peça sem mídia sai em MOV ProRes 4444 com transparência; com foto ou vídeo, em MP4 H.264 a 16 Mbps. 30 fps.
- **T01 a T16 da v2 passaram.** A suíte da Máquina tem hoje 453 testes.

### As 23 composições

- **Abrir:** Chamada central, Pergunta-gancho, Manchete de outro veículo, Marcador de capítulo, Etiqueta de tema/série, Palavra-conceito.
- **Situar:** Tarja de nome e cargo, Localização, Linha do tempo.
- **Provar:** Documento com grifo, Post de rede social, Áudio obtido, Print/gravação de tela, Tela dividida e grid.
- **Explicar:** Número em destaque, Número sobre o vídeo, Sistema de gráficos, Comparação, O que se sabe/não se sabe, Selo de checagem.
- **Citar:** Citação, Crédito.
- **Fechar:** Cartão final de ponte.

Sem composição: Transições e Fundos (em espera), Legenda (a equipe estiliza no Premiere), CTA (removido), Pacote 360 (orquestração das saídas).

### Sugestão

Registrar no design system uma frente de **vídeo do YouTube**, ao lado dos cards, usando este acúmulo como ponto de partida. O `composicoes/registro.json` da v2 ainda marca o mapeamento como "proposto, não implementado"; ele já pode refletir o estado acima.
