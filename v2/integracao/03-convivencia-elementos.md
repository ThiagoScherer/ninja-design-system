# Convivência de elementos — proposta D3

Estado: comportamento D3 aprovado por Thiago, sem medidas novas aprovadas. Esta proposta não move elementos nos templates existentes

## Princípio

A composição precisa conhecer todos os elementos simultâneos antes de resolver posições e alturas. Um componente informa sua caixa ocupada; a composição resolve conflitos conforme o perfil e as âncoras. Não delegar a cada elemento uma posição isolada que ignore os demais

## Regras propostas

| Elemento | Regra de convivência |
|---|---|
| Legenda | Quando ativa, reservar a região correspondente; quando ausente, liberar a reserva |
| Identificação de pessoa | Permanecer associada visualmente à pessoa; respeitar a região da legenda e a área útil |
| Chapéu + chamada + apoio | Compor como conjunto em fluxo; encaixar dentro da área disponível após as reservas |
| Crédito | Associado à foto/vídeo correto; posição de borda pode ser exceção explícita ao conteúdo principal |
| Assinatura | Elemento independente e opcional da composição, com posição declarada |

A presença de um elemento não o insere automaticamente nas outras composições. Compartilhar um componente de crédito não significa colocar crédito em qualquer peça, assim como compartilhar assinatura não impõe logo em toda tela

Se houver conflito, a composição deve usar uma alternativa declarada de posição ou recompor o bloco editorial dentro dos limites. Não reduzir indefinidamente, ocultar crédito obrigatório ou mover identificação para longe da pessoa sem regra. Se não houver solução, sinalizar revisão

As reservas podem ser condicionais ao intervalo de presença no vídeo. A geometria exata e a escolha entre reserva durante toda a cena ou somente no intervalo ativo serão definidas junto das referências de composição; não inferir movimento contínuo de layout automaticamente

## O que esta decisão não define

- Posição, largura e altura exatas da legenda
- Tamanhos e distâncias da identificação, crédito e assinatura em vídeo
- Reservar o mesmo espaço no horizontal e no vertical
- Replicar em todas as telas o logo da notícia Reels ou o rodapé do card
- Herança automática de créditos e assinatura entre fotos de uma tela dividida

## Referências para a próxima conferência visual

Preparar exemplos horizontal e vertical de identificação com legenda, crédito com legenda e conjunto editorial com assinatura. Usar as regras existentes como ponto de partida e marcar medidas novas como proposta. Os exemplos devem mostrar a situação com e sem os elementos opcionais

## Critérios de aceitação para o Gian

1. Legenda ausente libera a região que lhe pertence, conforme a variante de layout
2. Identificação, legenda e assinatura não se sobrepõem nas combinações previstas
3. O crédito permanece associado ao recurso correto, inclusive em mudança de mídia
4. Alterar um componente recalcula a caixa ocupada e a composição dependente
5. Falta de espaço gera um estado identificável de revisão
6. Os dois perfis de vídeo utilizam suas próprias medidas e alternativas declaradas
