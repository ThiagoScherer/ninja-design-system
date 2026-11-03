# Integração com a Máquina de Vídeos — orientações para Gian

O NINJA Design System v1 será a fonte das definições gráficas. A Máquina de Vídeos deve adequar sua arquitetura e nomenclatura ao contrato, em vez de exigir que o Design System preserve nomes e decisões anteriores da aplicação. Este documento registra diferenças conhecidas; não significa que a integração já foi executada

## Materiais ainda sem template

Consumir os [fundamentos da NINJA](../fundamentos.json) e selecionar o perfil de mídia. Aplicar primeiro marca, depois perfil e finalmente template, quando houver. Sem template, o resultado é uma proposta baseada na marca e precisa de revisão visual; não deve ser identificado como template aprovado

## Diferenças e ações sugeridas

A análise anterior consultou o repositório público de aprovação das peças, que é uma vitrine gerada, não necessariamente a arquitetura completa e atual da Máquina. Gian deve conferir estes pontos no projeto principal antes de migrar

| Diferença conhecida | Ação na Máquina de Vídeos |
|---|---|
| Uso de `manchete` ou nomes de componentes para o texto principal | Usar `chamada` no conteúdo de notícia; não renomear títulos de outros contextos indiscriminadamente |
| Tokens e medidas próprios da aplicação | Ler os fundamentos, o perfil e o template do Design System; eliminar duplicações depois de conferir o resultado |
| Áreas e margens de vídeo diferentes | Usar o perfil NINJA correspondente; revisar GCs e componentes que hoje ultrapassem a nova área útil |
| Regra de fonte fixa em peças existentes | Para notícia, executar o ajuste de tamanho e quebras aprovado; peças que exijam fonte fixa precisam declarar essa política própria |
| Paletas antigas diferentes | Adotar as cores NINJA; cores de campanhas permanecem definições específicas, não substituições silenciosas |
| Posições e gradientes fixos em componentes | Resolver âncoras e alturas a partir da composição; opacidade máxima no fim visível da foto, quando houver degradê editorial |
| Dados, preview e render separados | Fazer preview e exportação consumirem o mesmo resultado de composição |

Usar os termos `marca`, `tipo`, `midia`, `dimensao`, `template`, `variacao`, `entrega` e `recurso` com os significados do contrato. Chapéu, chamada, lead, crédito e assinatura são elementos distintos. Logo é recurso; bug é aplicação

## Sequência mínima de adoção

1. Fixar uma versão identificável do pacote do Design System
2. Resolver recursos a partir do pacote, sem caminhos absolutos do computador de Thiago
3. Ler fundamentos e perfis; depois executar um template aprovado completo
4. Comparar exportação e preview com as referências aprovadas, incluindo quebras, margens, fontes e recortes
5. Migrar as demais peças progressivamente e registrar regras que ainda não estejam configuradas

Não substituir fontes silenciosamente, alterar o conteúdo para fazê-lo caber ou anunciar suporte a regras que o motor não executa. Fontes proprietárias precisam ter seu fornecimento e uso resolvidos na instalação; estar no acervo local não equivale a autorização de distribuição pública

## Limites atuais

O acervo contém templates e renderizadores locais, além de um piloto de contrato. Ainda há referências e implementações históricas a consolidar. Não se trata de uma API de produção já integrada. Movimento, duração, GCs e saídas não configuradas continuam sem padrões aprovados; margens e tipografia iniciais não resolvem essas decisões automaticamente
