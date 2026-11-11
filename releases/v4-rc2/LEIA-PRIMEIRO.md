# V4 RC2 — ponto de entrada

1. Confirmar `../ATIVO.json` e `manifesto.json`: versão `4.0.0-rc.2`
2. Conferir o pacote: `python3 ferramentas/conferir-pacote.py`
3. Ler `regras-comuns.json` e `tokens-chapeu.json`
4. Para card, ler `cards/catalogo.json`, o `modelo.html`, a `ficha.json` e sua `ficha-tecnica.json`, quando indicada
5. Para Reels estático, ler `reels/registro.json`; o renderizador de cards não exporta Reels
6. Para vídeo da Máquina, ler `video/contrato-integracao.json`; a dependência legada declarada é a única exceção à política de versões

Cada template define seus próprios valores. Preencher a área editorial com equilíbrio; número de linhas é consequência. Carregar fontes antes de medir, não transportar quebras entre templates e revisar visualmente. Não usar ponto final ao término dos blocos; preservar pontuação interna e sinais ? e !

Ao concluir, informar `NINJA Design System V4 RC2 ativo` e listar o escopo instalado com precisão: cards, fichas estáticas de Reels e/ou contrato de vídeo. Não afirmar suporte a MP4, thumbnail ou marcas de vídeo sem implementação validada
