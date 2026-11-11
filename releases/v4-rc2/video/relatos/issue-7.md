# Issue #7 — Organização do pacote

Origem: https://github.com/ThiagoScherer/ninja-design-system/issues/7
Autor: gian-dot
Estado: relato recebido; aprovação local não equivale a aprovação global do DS

Pontos encontrados ao atualizar a Máquina para a V4 RC1:

- O repositório não tem etiquetas (tags) de versão. Uma por versão permitiria fixar pelo nome.
- A V4 não publica `arquivos.sha256.json`, então a pasta `v4/` não pode ser conferida por hash como a v2.
- As fichas citam `ficha-tecnica.json` e `biblioteca-local/regras-comuns.json`, que não estão no pacote.
- A ficha da Mídia NINJA com lead ainda diz "priorizar 4 linhas a 5", enquanto o `AGENTS.md` diz que o número de linhas é consequência do conteúdo.
- O `manifesto.json` da raiz segue em 1.0.0, e a versão ativa está em `ATIVO.json`.
- Aktiv e Microgramma estão no acervo da Máquina, sem uso. Vale registrar se alguma tem papel aprovado.
