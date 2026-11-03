# Integração da v2 — pacote de definição para Gian

Estado: candidato a repasse, local e não publicado. Thiago pode revisar o impacto no documento IMPACTO-POR-COMPOSICAO.md. Não equivale a integração implementada ou validação das 28 saídas

## Objetivo

Usar o NINJA Design System como fonte de componentes gráficos compartilhados no app e no estúdio da Máquina. Cada composição conserva seu layout e referencia variantes identificadas; corrigir uma variante atualiza seus consumidores

## Escopo consolidado

- 28 entradas inventariadas: 25 composições candidatas, duas categorias em espera e um agrupamento de saídas
- Preservar todas as animações existentes, incluindo tempos, curvas, escalonamento, entradas e saídas. Adaptar alvos, identificadores e medidas de máscara quando necessário
- Aplicar decisões D1–D8 aos contextos correspondentes. D9 está fora do escopo; D10 define a preservação do motion
- Preservar o visual de variantes sem redefinição aprovada, como variantes legadas locais. Esta é a proposta de migração deste pacote, não aprovação retroativa de cada aparência
- Não converter todas as peças para a composição de notícia. Citação, legenda, dado numérico e título externo mantêm seus papéis
- Transições e fundos continuam em espera. Pacote 360 encaminha saídas a composições e perfis próprios

## Leitura e fontes de decisão

1. decisoes.json: decisões explícitas do usuário
2. componentes/01-base-editorial.md e 02-contrato-componentes.md: responsabilidades e comportamento
3. componentes/03-organizacao-biblioteca.md: construção compartilhada, variantes e recursos especializados
4. 02-perfis-video.md e 03-convivencia-elementos.md: perfis e convivência; referências D4 detalham as combinações aprovadas
5. propostas/: exemplos aprovados D4–D8 e suas medidas. A pasta movimento é histórica, fora do escopo
6. IMPACTO-POR-COMPOSICAO.md, MAPA-DEPENDENCIAS.md e composicoes/registro.json: impacto e consumidores propostos
7. CRITERIOS-INTEGRACAO.md: testes a executar

As regras canônicas do DS têm prioridade sobre instruções antigas da Máquina que imponham fonte fixa, redução limitada a 15%, coordenadas fixas de degradê ou herança do perfil de thumbnail para vídeo horizontal. Uma medida de exemplo não vira tamanho obrigatório

## Alterações concretas na Máquina

1. Consumir versão identificada da biblioteca; carregar fontes por declaração estruturada, evitando extrair significado de texto CSS
2. Criar implementação compartilhada dos componentes equivalentes, usada pelo app e pelo estúdio. Renomear campos somente quando a equivalência semântica estiver comprovada
3. Separar aparência de variante, geometria de composição e dados da entrega. Medidas ainda não redefinidas permanecem em variante legada identificada, com origem registrada
4. Adicionar perfil de vídeo horizontal 1920×1080, margens 60. Não herdar tratamentos de thumbnail. Vertical mantém seu perfil e área segura
5. Corrigir encaixe de chamada: redução inicial até aproximadamente 15%, tentativa de quinta linha com tamanho restaurado e redução posterior até o limite do contexto. Conferir largura real e altura. Piso 64 se aplica ao Reels definido, não a todo texto
6. Recalcular contraste depois de encaixar texto e definir mídia. Degradê termina em 100% no limite visível da fotografia, mesmo quando esse limite não é a base do quadro
7. Aplicar centralização visual das caixas e variantes de padding aprovadas. Faixas D8 usam 18 e caixa única correspondente 38; não sobrescrever paddings específicos de chapéu ou identificação
8. Associar recursos, créditos, grifos e células por identificador; preservar vínculos nas trocas e crops
9. Conectar timelines existentes aos elementos resultantes; medir máscaras conforme as caixas finais. Não trocar animação de bloco por animação por linha por iniciativa da integração
10. Reconciliar regras antigas em documentos e código para que agentes não recebam instruções concorrentes
11. Executar os 16 casos de aceitação e devolver evidências, incluindo comparação de animação anterior e posterior

## Dados mínimos de uma variante legada

Identificador, composição de origem, papel, perfil aplicável, valores atuais, versão/commit de origem e consumidores. Não marcar como padrão global aprovado. Se a Máquina atual divergir da cópia auditada, registrar o valor atual e a diferença antes da migração

## Projetos e saídas

Preservar versão do DS usada por projeto. Uma atualização da biblioteca deve propagar na versão adotada sem alterar silenciosamente projetos arquivados. Preview e exportação compartilham composição resolvida. Codecs, fps, duração e sincronização existentes permanecem sob responsabilidade da Máquina

## O que Gian deve devolver

- Relação dos componentes compartilhados implementados e consumidores reais
- Registro de variantes legadas preservadas e divergências encontradas
- Resultado dos testes, capturas e trechos de vídeo para conferência
- Limitações e itens que exigirem nova decisão visual, com exemplo concreto

Este pacote foi elaborado sobre o espelho público auditado no commit 6b9cf354eb4781afae5040bfa9f4227d1e19cfc4. A aplicação principal e eventuais alterações posteriores precisam ser conferidas pelo Gian. Não há comprovação aqui da integração final, exportação ou propagação no código atual
