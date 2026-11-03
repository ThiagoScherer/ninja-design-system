# Contrato dos componentes — consolidação para implementação

Estado: organização das decisões D1–D8 e D10, sem novo visual aprovado ou alteração da Máquina. Este contrato descreve responsabilidades; a sintaxe final dos módulos será definida no pacote da v2

## Entradas e resultados compartilhados

Todo componente recebe conteúdo, referência de variante e área disponível. A composição fornece posição, perfil de mídia e recursos associados. A variante fornece aparência e limites; uma entrega não sobrescreve livremente os fundamentos

O resultado informa geometria final, elementos renderizáveis e estado de encaixe. IDs de instância devem ser únicos quando um componente aparece mais de uma vez. A geometria é medida após carregar fontes e resolver linhas; não deve incluir deslocamentos temporários da animação

| Componente | Dados e propriedades | Responsabilidade | Fora de sua responsabilidade |
|---|---|---|---|
| Texto editorial | Conteúdo, papel, variante, área disponível, alinhamento, política de encaixe | Resolver fonte, linhas e caixa ocupada; preservar conteúdo | Posição na tela e duração |
| Caixa de texto | Texto resolvido, preenchimento, raio, padding e modo | Fundo por linha ou único; centralização visual | Fonte, conteúdo e animação |
| Chapéu | Conteúdo e variante branca ou destaque | Combinar texto e caixa conforme seu papel | Posição absoluta ou movimento |
| Conjunto editorial | Chapéu opcional, chamada, apoio opcional e espaçamentos | Fluxo entre blocos; retirar espaço de elementos ausentes | Escolher recurso visual ou alterar texto |
| Contraste | Retângulo da mídia, geometria editorial e variante | Calcular degradê adaptável, véu ou desfoque | Definir crop ou animação de fundo |
| Identificação | Nome, função opcional, variante e área disponível | Compor nome e função; centralizar visualmente o nome | Escolher pessoa, posição ou intervalo de exibição |
| Crédito | Texto, recurso associado e variante | Exibir atribuição com a tipografia definida | Descobrir autoria ou escolher posição global |
| Assinatura | Recurso de logo, largura e variante | Manter proporção e aparência do recurso | Inserir automaticamente logo em toda composição |

Os quatro últimos papéis reutilizam decisões já conferidas em propostas/convivencia. Suas medidas não substituem as de notícia, thumbnail ou de outras marcas. Legendas mantêm a segmentação e o comportamento existentes na Máquina; a composição considera sua área ocupada

## Herança e variantes

Ordem: fundamentos da marca → perfil de mídia → variante de componente → composição → conteúdo da entrega. Uma propriedade local de posição não duplica a aparência do componente

A regra de centralização visual vale para todas as caixas. A variante de faixas D8 usa padding 18 px; a caixa única correspondente usa 38 px. Os chapéus e as identificações já aprovados conservam seus paddings próprios. Compartilhar a implementação de caixa não obriga esses papéis a ter a mesma variante

Uma atualização da variante se propaga aos consumidores que a referenciam. Uma composição não deve manter uma cópia dos valores para impedir essa propagação. Projetos identificam a versão do DS utilizada; atualizar a biblioteca não migra silenciosamente projetos arquivados

## Conexão com animações existentes — D10

A Máquina conserva movimentos, tempos, curvas e escalonamento. O componente entrega alvos identificáveis e suas medidas; a Máquina aplica a animação que já usava

| Alvo visual | Exemplo de uso existente | Integração esperada |
|---|---|---|
| Conjunto editorial | #m-bloco | Vincular à instância do conjunto |
| Chapéu | #m-chapeu | Vincular ao chapéu da instância |
| Chamada | #m-chamada | Vincular ao texto resolvido |
| Identificação | #t-bloco, #t-nome, #t-cargo | Vincular conjunto, nome e função quando presente |
| Crédito | #c-texto | Preservar o comportamento atual, inclusive ausência de animação |
| Fundo e contraste | .m-fundo, #m-veu, #m-degrade, #m-base | Manter alvos distintos quando a animação existente os distingue |

Esses seletores são evidência da implementação auditada, não nomes obrigatórios do contrato. Gian pode adaptar seletores e envoltórios. Máscaras devem usar a geometria final do componente, sem conservar alturas antigas que cortem o texto. Isso não autoriza criar movimentos por linha onde hoje a animação é do bloco inteiro

Sequência técnica: carregar recursos → resolver texto → medir caixas → compor posições e contraste → vincular alvos → executar a animação existente. Preview e exportação usam o mesmo resultado de composição

## Critérios de aceitação

1. Alterar uma variante compartilhada atualiza todos os seus consumidores no app e no estúdio
2. Mover uma instância não move outras composições
3. Remover chapéu, apoio ou função remove também o espaço correspondente, sem deixar alvo de animação inválido
4. Textos longos recalculam caixas, máscara e contraste sem corte nem alteração silenciosa do conteúdo
5. Entrada, saída, duração, curva e escalonamento continuam iguais aos da Máquina antes da integração
6. Uma composição com duas instâncias não anima a instância errada por colisão de identificadores
7. Preview e exportação apresentam a mesma composição

A verificação destes critérios pertence à implementação do Gian; ainda não foi executada na Máquina
