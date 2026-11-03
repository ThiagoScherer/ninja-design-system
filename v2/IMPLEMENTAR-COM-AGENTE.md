# Instruções para o agente implementador — NINJA DS 2.0.0

Implemente a integração na Máquina de Vídeos usando este pacote como fonte. Trabalhe no repositório da Máquina; não altere o Design System para acomodar código antigo. Conclua implementação, verificações e relatório antes de solicitar revisão ao usuário. Não publique nem faça deploy sem autorização correspondente

## Leia antes de editar

Leia as instruções locais do repositório da Máquina e, nesta ordem: LEIA-PRIMEIRO.md, manifesto.json, contrato-integracao.json, integracao/decisoes.json, integracao/REPASSE-GIAN.md, integracao/IMPACTO-POR-COMPOSICAO.md e as fichas dos componentes usados. Consulte base-aprovada/GUIA-AGENTES.md para templates existentes. A v1 preservada dentro da base não substitui as decisões explícitas desta integração

O pacote define componentes gráficos; todas as animações atuais devem ser conservadas. O inventário tem 28 entradas, não 28 implementações ativas: 25 composições candidatas, duas categorias em espera e um agrupamento de saídas. Não ativar itens em espera por conta própria

## 1. Diagnóstico e referência anterior

- Identifique o commit atual, comandos de desenvolvimento, testes, preview e exportação
- Compare o código atual com o mapa auditado; a auditoria é de outro commit e pode estar desatualizada
- Capture referências anteriores nos formatos disponíveis, incluindo vídeos das animações. Guarde dados de entrada reproduzíveis
- Mapeie caminhos reais do app e estúdio, componentes duplicados e todos os consumidores. Documente diferenças entre o código atual e este inventário
- Execute a conferência deste pacote: `node ferramentas/conferir-pacote.cjs` a partir da raiz do pacote

## 2. Integração da biblioteca

- Registre a versão do DS e use referências compartilhadas; não espalhe cópias dos valores entre renderizadores
- Consuma contrato-integracao.json e os templates aprovados. Preserve seus caminhos relativos para recursos
- Separe componente, variante, composição, perfil e conteúdo. Não é necessário imitar a organização de arquivos deste pacote
- Extraia valores atuais não redefinidos para variantes legadas identificadas, com origem e consumidores. Preserve sua aparência. Não as apresente como padrões novos aprovados
- Se houver decisão explícita do DS, aplique-a no contexto correspondente. Não escolha silenciosamente o valor antigo conflitante
- Use o mesmo componente no estúdio e no app quando representarem a mesma função e variante

## 3. Composição e comportamento

- Resolva texto após carregar fontes; meça largura e altura reais, depois caixas e fluxo, posições e contraste
- Implemente o ajuste progressivo de notícia integralmente. Não limite toda redução ao primeiro patamar de 15%. Use limites do contexto; não invente um piso universal
- Preserve conteúdo, pontuação interna e perguntas/exclamações. Nos blocos NINJA não inserir ponto final ao término
- Aplique centralização visual às caixas e os paddings próprios da variante. 18/38 são os valores das variantes D8, não de toda caixa da biblioteca
- Remova espaço de elementos opcionais ausentes. Respeite convivência com legenda e associação entre crédito e recurso
- Recalcule degradê pela geometria final e pelo fim da fotografia. Não presumir foto até a base do quadro
- Implemente vídeo horizontal com perfil próprio. Não transportar sombras e assinatura específicas da thumbnail
- Revise visualmente linhas, tamanho e equilíbrio antes de concluir cada referência. Uma conferência de quantidade de linhas não basta

## 4. Animação, preview e exportação

- Vincule os alvos gráficos novos às timelines existentes. Preserve movimento, tempos, curvas, sincronização e escalonamento
- Recalcule máscaras conforme a geometria final e use identificadores distintos por instância
- Não introduza animação por linha onde o comportamento atual é do bloco inteiro
- Use a mesma composição resolvida em preview e exportação. Preserve codecs, fps e duração existentes
- Faça a migração de projetos com versão explícita e sem alteração silenciosa dos projetos arquivados

## 5. Testes obrigatórios

Execute testes existentes apropriados, build e verificações de renderização. Execute os casos T01–T16 em testes/casos.json. Preencha uma cópia de testes/resultado-modelo.json com evidências reais

Cada caso deve indicar passou, falhou ou não aplicável, com composição, variante e justificativa. Caso não aplicável precisa de motivo específico. Não marcar teste não executado como aprovado. Não forçar aprovação quando o ambiente não permitir exportação: registrar bloqueio e comando para reproduzir

Inclua alteração controlada de uma variante para provar propagação e restaure o valor depois. Compare consumidores previstos e não consumidores. Para movimento use vídeo anterior e posterior, pois imagens estáticas não comprovam preservação. Para preview/exportação confira quadros correspondentes

## 6. Entrega final

Entregue alterações no repositório da Máquina e relatório com:

- Componentes compartilhados e consumidores reais, incluindo diferenças entre app e estúdio
- Impacto por composição e variantes legadas preservadas
- Comandos executados, ambiente, versões e resultado dos 16 testes
- Capturas, vídeos e arquivos exportados usados como evidência
- Divergências, limitações e eventual decisão visual realmente necessária

Não afirmar que as 28 entradas foram implementadas quando categorias em espera, agrupamentos ou protótipos ainda não são saídas ativas. A especificação deste pacote e a integração executada têm estados diferentes
