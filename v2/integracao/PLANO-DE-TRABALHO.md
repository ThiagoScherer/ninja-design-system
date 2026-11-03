# V2 — nossa definição completa antes da implementação do Gian

Status: organização inicial, não lançamento nem especificação aprovada

Objetivo: aplicações compostas por componentes reutilizáveis. Uma alteração num componente atualiza seus consumidores; propriedades específicas de um layout continuam locais. A etapa de definição será fechada com Thiago antes de pedir implementação ao Gian

## Bloco A — nosso trabalho

| ID | Entrega | Estado |
|---|---|---|
| A1 | Inventário das 28 aplicações e mapa de componentes recorrentes | 28 entradas mapeadas com consumidores inversos; equivalências e variantes finais ainda em consolidação |
| A2 | Separar regras globais, perfis de mídia, componentes e regras locais de layout | Estrutura proposta; fechar com base no mapa |
| A3 | Definir vídeo horizontal e convivência dos elementos no vertical | D2–D4 aprovadas; referências de convivência registradas |
| A4 | Fichas dos componentes: conteúdo, aparência, medidas, comportamento, opcionais e variantes | Base editorial e contrato inicial consolidados; faltam componentes específicos |
| A5 | Corrigir e especificar ajuste de texto, contraste, encaixe e tratamento de ausência | D5–D8 aprovadas com exemplos; consolidar aplicação em cada composição |
| A6 | Documentar como as animações existentes recebem os componentes | D10 registrada; correspondências iniciais no contrato de componentes |
| A7 | Fichas de composição das 28 aplicações, referenciando componentes | 28 fichas estruturais produzidas; faltam variantes e medidas locais não aprovadas |
| A8 | Exemplos visuais e casos de aceitação, com resultados esperados | Referências D4–D8 e 16 critérios de integração registrados; completar cobertura das composições |
| A9 | Conferência de consistência e pacote de implementação para Gian | Depende de A1–A8 |

A1–A9 serão conduzidos aqui. Perguntas a Thiago serão agrupadas por assunto. Reutilizar decisões aprovadas, sem transformar escolhas ainda abertas em regras definitivas

As fichas de componente serão curtas: finalidade, propriedades, padrões, limites, comportamento e consumidores. Onde houver aparência específica, anexar referência visual. Onde faltar decisão, manter identificada até resolvê-la ou adiar explicitamente o item

## Bloco B — implementação do Gian, após nossa entrega

| ID | Trabalho | Resultado esperado |
|---|---|---|
| B1 | Atualizar consumo da biblioteca e o contrato de dados | Versão identificada; nenhuma edição manual da cópia dos fundamentos |
| B2 | Implementar componentes compartilhados e seus comportamentos | Estúdio e app utilizam a mesma implementação para cada componente equivalente |
| B3 | Montar as composições por referências aos componentes | Layouts próprios sem cópias concorrentes de aparência ou comportamento |
| B4 | Implementar perfis, fluxo, âncoras e convivência de elementos | Regras de margens, opcionais, legendas e sobreposições executadas |
| B5 | Integrar preview, exportação e compatibilidade de projetos anteriores | Mesma composição nos dois caminhos; migração de nomes sem redefinir o visual |
| B6 | Executar os casos de aceitação e entregar relatório | Evidências da propagação e dos resultados, incluindo limitações |

Cada tarefa de implementação deve apontar para a ficha e seus critérios de aceitação. Gian poderá implementar na sequência técnica adequada, sem depender de aprovações visuais intermediárias para decisões já fechadas

## Critérios para entregar nossa parte

- Cada aplicação possui dependências, variantes e estado explícitos
- Cada componente repetido tem uma definição identificável e seus consumidores mapeados
- Não há duas regras concorrentes para o mesmo campo e contexto
- Valores de referência de uma entrega não são apresentados como tamanho obrigatório
- Decisões visuais necessárias estão aprovadas ou explicitamente fora da entrega
- Há exemplos e resultados esperados suficientes para o Gian implementar sem reconstruir a conversa

## Critérios para concluir a v2 integrada

- Alterar um componente atualiza todos e somente os consumidores previstos
- Uma alteração local não modifica layouts independentes
- Textos curtos, longos e elementos opcionais recompõem sem corte ou modificação silenciosa
- Horizontal e vertical respeitam perfis distintos
- Preview e arquivo exportado executam as mesmas regras
- Projetos registram a versão usada e os casos de regressão passam

Concluir nossa especificação não equivale a certificar a integração. A comprovação final depende da implementação e dos testes de B1–B6. O trabalho do Gian poderá revelar questões técnicas; isso não exige alternar a implementação com cada decisão inicial de produto

## Primeira sequência de decisões aqui

1. Revisar o mapa e definir quais papéis compartilham componente e quais precisam de variantes
2. Fechar os perfis de mídia e as regras de convivência
3. Fechar primeiro texto, chapéu/caixa e contraste; depois identificação/crédito/assinatura e os componentes específicos
4. Mapear alvos das animações existentes aos componentes, fechar composições e preparar o pacote único

A v1 permanece preservada. Arquivos desta pasta são desenvolvimento da v2 e não substituem definições aprovadas ou publicadas até o fechamento da nova versão

## Limite de escopo — orientação explícita de Thiago

A v2 não redesenha animações. A Máquina mantém seus movimentos, tempos, easing, escalonamento, entrada e saída existentes. Nosso trabalho define os componentes gráficos e como a Máquina os consome. Gian conecta a animação existente à estrutura dos componentes, preservando o movimento. Seletores e wrappers podem exigir adaptação técnica; isso não autoriza alterar o motion. O teste A/B D9 permanece como histórico, fora das aprovações e pendências
