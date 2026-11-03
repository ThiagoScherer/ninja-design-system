# Organização da biblioteca — proposta de implementação

Esta classificação organiza as dependências do mapa; não aprova novos visuais nem cria 24 componentes independentes. A divisão final de arquivos pode ser ajustada pelo Gian mantendo as responsabilidades e referências compartilhadas

| Grupo | Elementos do mapa | Implementação sugerida |
|---|---|---|
| Base reutilizável | texto_editorial, caixa_texto, midia, tratamento_contraste | Primitivas que recebem variantes e área disponível |
| Papéis e conjuntos | chapeu, etiqueta, identificacao, credito, assinatura, informacao_auxiliar | Variantes ou combinações da base; informação auxiliar é papel tipográfico, não exige novo motor de texto |
| Estruturas de layout | cartao, grade_midia, lista_editorial | Contêineres reutilizáveis; distribuição e âncoras escolhidas pela composição |
| Recursos especializados | grifo, sequencia_temporal, onda_audio, transcricao, dado_numerico, visualizacao_dados, selo | Preservar comportamento existente e conectar aparência aos tokens; não substituir por texto genérico |
| Recursos e categorias | recurso_grafico, transicao, fundo_grafico | Recurso gráfico referencia um asset; transições e fundos permanecem em espera |
| Orquestração | composicao_por_midia | Escolher composição e perfil para cada saída; não é elemento desenhado |

## Regras de fronteira

- Identificar uma pessoa, um lugar e o autor de um post não obriga usar a mesma aparência. Compartilhar texto e caixa; declarar variantes próprias quando a função visual muda
- Chapéu e etiqueta podem compartilhar construção sem assumir tamanhos idênticos
- Cartão é um contêiner; não deve absorver o conteúdo de documento, publicação e citação em um formulário genérico
- Grifo editorial e marcação em captura são variantes distintas: a segunda precisa acompanhar coordenadas do recurso
- Transcrição compartilha tipografia quando apropriado, mas mantém segmentos, falantes e sincronização existentes
- Contagem numérica e gráficos conservam dados estruturados; não transformar valores em texto impossível de atualizar
- Grade de mídia mantém crop, recurso e crédito vinculados por célula
- Recurso gráfico é referência a vetor ou imagem, não um novo componente para cada ícone

## Propagação esperada

Compartilhar a variante implica compartilhar sua definição. Cor, fonte, padding ou raio da variante atualizam seus consumidores. Alterações locais de posição, divisão de grade ou crop permanecem na composição ou na instância do recurso

Uma mudança de tipografia pode alterar medidas. Nesse caso, recalcular caixas, fluxo, máscaras e contraste de todos os consumidores afetados. Preservar os movimentos existentes; não congelar medidas antigas para evitar recomposição
