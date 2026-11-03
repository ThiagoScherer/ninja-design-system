# Caixas de texto — D8 aprovada

Regras solicitadas por Thiago: texto centralizado visualmente na faixa em todas as aplicações; padding padrão equilibrado; caixa única com 20 px adicionais de padding em cada lado em relação ao padrão

Referência revisada: faixa por linha com padding de 18 px; caixa única com 38 px. Os 18 px são o padrão aprovado desta variante. Centralização considera a altura visível dos caracteres, incluindo acentos e descendentes, não apenas o line-height

O componente recebe fonte, tamanho e conteúdo e recalcula suas medidas. Ajustes numéricos de uma fonte não devem ser repetidos automaticamente em outra. A demonstração usa texto SVG vetorial; a implementação final pode usar HTML ou outra técnica que preserve o resultado óptico e a consistência de preview/exportação

No modo por linha cada faixa acompanha a sua linha. No modo caixa única o fundo envolve todo o conjunto e o padding ampliado diferencia visualmente esse modo. Layout, cor e fonte continuam propriedades explícitas da variante e composição

A nova regra de centralização é transversal; o padding de 18 px desta demonstração não sobrescreve automaticamente paddings já aprovados de chapéus e identificações. A compatibilização dos papéis será conferida na consolidação das fichas da v2

Referência visual aprovada por Thiago, incluindo os dois formatos e modos de caixa
