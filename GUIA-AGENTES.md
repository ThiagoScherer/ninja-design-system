# Como usar a biblioteca

1. Ler `manifesto.json`, `fundamentos.json` e a definição do template escolhido em `templates`
2. Selecionar `marca`, `tipo`, `midia`, `dimensao` e `template` com os significados do contrato
3. Copiar o exemplo mais próximo em `exemplos`, trocar conteúdo e recursos, e preservar as regras do template
4. Compor a chamada: escolher tamanho e quebras para preencher a largura útil e a área editorial sem ultrapassar margens. Registrar a escolha em `composicao_referencia`; não confundir essa escolha com um token fixo
5. Renderizar, abrir o PNG e revisar tamanho, quebras, grupos de sentido, foto, assinatura, crédito e contraste. Corrigir e repetir somente se necessário

O renderizador aceita novos exemplos pelo nome: `node ferramentas/renderizar.cjs minha-entrega`. O arquivo deve estar em `exemplos/minha-entrega.json`. Recursos das entregas são relativos à raiz do pacote, por exemplo `recursos/foto.jpg`. O motor resolve essas referências para o HTML de saída. Não usar caminhos absolutos

## Texto

Não usar ponto final no término dos blocos. Preservar pontuação interna, perguntas e exclamações. Não alterar conteúdo silenciosamente. TipoNinja usa caixa alta, alternativos e ligaturas desligados; lead usa Manrope Medium. Os números de fonte dos exemplos são resultados de composição, não regras universais

Para notícia NINJA, preferir quatro linhas; permitir menos em textos curtos. Se não couber, tentar reduzir a fonte em até cerca de 15%; se ainda não couber, restaurar o tamanho inicial e tentar cinco linhas, reduzindo novamente se necessário. Reels tem faixa habitual de 64 a 170 px. Casos extremos menores foram aceitos como exceção, não como novo padrão. Não inventar um piso universal para card ou thumbnail. Conectivos no fim de linha não são reprovação automática

Na thumbnail, respeitar o preenchimento e equilíbrio do exemplo, mas três linhas não são uma obrigação universal. O motor verifica se as linhas fornecidas preservam o conteúdo; a inspeção visual do encaixe é responsabilidade do agente nesta versão

## Valores e herança

Fundamentos → perfil da mídia → template. O renderizador consulta as margens nos fundamentos, as fontes na marca e as medidas específicas nos templates. Um novo material sem template usa os fundamentos como ponto de partida e continua sendo uma proposta, não um template aprovado

O template card guarda variações com e sem lead. O renderizador remove o lead e seu espaço quando não há conteúdo. Reels e thumbnail com lead ainda não têm suporte aprovado. Não transportar automaticamente a proteção diagonal do logo da thumbnail para card ou Reels

Usar o fim visível da foto como ponto preto do degradê. O ponto transparente fica 80 px acima do chapéu; na thumbnail, 80 px acima da chamada. Preservar as camadas de 5% e o degradê superior direito de 30% a 45° da thumbnail

## Responsabilidade da aplicação

Usar estes nomes e medidas; não manter valores gráficos antigos como segunda fonte de verdade. Fazer preview e exportação consumirem o mesmo resultado de composição. Registrar a versão da biblioteca na entrega. Uma capacidade não implementada deve ser declarada, sem substituição silenciosa de fonte, layout ou conteúdo
