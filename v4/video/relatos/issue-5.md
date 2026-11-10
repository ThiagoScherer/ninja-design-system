# Issue #5 — Variantes locais do vídeo e estados com significado

Origem: https://github.com/ThiagoScherer/ninja-design-system/issues/5
Autor: gian-dot
Estado: relato recebido; aprovação local não equivale a aprovação global do DS

**1. Estados semânticos** (a D1 deixou para depois). "Ao vivo" e "falso" usam vermelho `#E8202A`; "verdadeiro" usa verde `#2BD35A`. Nunca entram como cor de destaque. Sugestão: definir ao vivo, falso, verdadeiro, enganoso e sem provas, com suas cores.

**2. Variantes legadas aprovadas pela equipe e ainda sem decisão:**
- Cartões: branco (padding 40 × 48), post (44, raio 32), papel (64).
- Contraste extra: véu escuro 72% e fundo preto com grão.
- Sombra: caixa `0 24px 64px rgba(0,0,0,.5)` e texto `0 6px 32px rgba(0,0,0,.6)`.
- Grifo: faixa na cor de destaque a 55% da altura, 82% de espessura.
- Identificação sem caixa.
- Crédito colado na borda: 24 px no 16x9, 20 px no 9x16.

Sugestão: aprovar, ajustar ou trocar cada uma. Mudar o valor na Máquina propaga para todas as peças que usam a variante.
