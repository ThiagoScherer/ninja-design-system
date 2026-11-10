# Issue #2 — Compatibilidade entre a V4 e as peças de vídeo

Origem: https://github.com/ThiagoScherer/ninja-design-system/issues/2
Autor: gian-dot
Estado: relato recebido; aprovação local não equivale a aprovação global do DS

A V4 é a versão ativa e pede para não combinar com V1 a V3, mas só cobre cards de notícia. O único contrato de vídeo publicado é o `v2/contrato-integracao.json`.

**Como a Máquina ficou:** fixa a V4 RC1 como ativa, segue o contrato da v2 nas peças de vídeo e aplica as regras comuns da V4 que não contradizem esse contrato. Os cards e a v3 não entram na cópia, porque a Máquina não os usa.

| Regra da V4 | Vídeo hoje | Situação |
|---|---|---|
| Chapéu com centralização óptica, tolerância 1 px | Aplicado, mantendo a altura da caixa: desvio de até 4,5 px caiu para 0 px | Compatível |
| Sem ponto final em chapéu, chamada, lead e crédito | Aplicado | Compatível |
| Degradê de 100% no limite da foto até 0% cerca de 80 px acima do chapéu | Já era assim (D5) | Compatível |
| Carregar as fontes antes de medir o texto | Já era assim | Compatível |
| Número de linhas é consequência, não ponto de partida | Contrato v2: 4 linhas, −15%, 5 linhas | Diverge (Issue 3) |
| Não transportar quebras manuais entre templates | O 9x16 herda as quebras do 16x9 | Diverge (Issue 3) |
| Tratamento de chapéu por marca | O vídeo só usa a Mídia NINJA | Não se aplica ainda (Issue 6) |

**Sugestão:** registrar na V4 que o contrato de vídeo da v2 segue valendo até existir um contrato de vídeo mais novo. Assim a regra "não combine versões" fica válida para cards sem deixar o vídeo sem base.
