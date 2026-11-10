# Vídeo do YouTube — compatibilidade RC2

A Máquina é administrada pelo Gian; a identidade visual vem do Design System do Thiago

Ler `contrato-integracao.json` e seu snapshot `contrato-legado-v2.json`. Essa dependência explícita mantém o vídeo operacional sem importar regras históricas para cards

As 23 composições em `composicoes.json` foram relatadas como implementadas pelo Gian. Os 453 testes são um resultado informado na issue #1, não executado ou certificado por esta RC

Movimentos, tempos, cores semânticas, variantes, tamanhos de partida e extensões de perfil permanecem locais e em validação. Os relatos completos estão em `relatos/`; a lista de decisões pendentes está em `pendencias-v5.json`

Na migração, validar fonte carregada, chapéu curto/longo, preservação da altura da caixa, contraste, quebras em ambos os formatos e tempo de leitura. Comparar amostras antes/depois com o Gian antes de substituir a política legada de encaixe
