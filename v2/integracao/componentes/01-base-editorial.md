# Base editorial reutilizável — proposta para revisão

Estado: proposta de estrutura da v2. Regras aprovadas na v1 são identificadas abaixo; sua extensão a outros usos de vídeo ainda precisa ser validada. Este arquivo não altera os templates aprovados

## 1. Texto

Responsabilidade: apresentar conteúdo conforme um papel tipográfico e compor suas linhas dentro do espaço informado. Propriedades: conteúdo, papel, largura disponível, altura disponível, alinhamento e política de encaixe. A posição vem da composição, não de coordenadas internas fixas

Papéis iniciais: chamada, apoio, identificação e informação auxiliar. As famílias padrão já registradas são TipoNinja Regular para chamada e chapéu e Manrope Medium para apoio e crédito. Isso não aprova automaticamente tamanhos nem caixa alta para qualquer papel novo

Na chamada NINJA aprovada: alternativos e ligaturas desligados, entrelinha 1, tracking 0 e tamanho variável. Preservar conteúdo e grupos de sentido; procurar equilíbrio das linhas. Quatro linhas são preferência para notícia, não regra universal para toda frase, legenda ou capítulo

Sequência de encaixe de notícia: tentar o tamanho inicial; reduzir até cerca de 15% em quatro linhas; restaurar o inicial e tentar cinco; depois reduzir até o piso definido para o contexto. Textos curtos podem usar menos linhas. Reels tem faixa habitual de 64–170 px; não aplicar essa faixa automaticamente ao card ou vídeo horizontal. Casos extremos e palavra dominante seguem as decisões registradas, sem mudar o piso habitual

Resultado esperado do componente: tamanho escolhido, linhas, caixa ocupada e estado de encaixe. Se falhar, sinalizar revisão. Medir a largura real das linhas e das palavras, além da quantidade de linhas e altura. Não encurtar o conteúdo silenciosamente

Sem conteúdo opcional, não renderizar texto nem seu espaço. Nos materiais NINJA, não encerrar blocos com ponto final; preservar a pontuação interna necessária

## 2. Caixa de texto

Responsabilidade: desenhar o fundo que acompanha o conteúdo. Propriedades: conteúdo, preenchimento, padding, raio, limite de largura e modo de caixa. O componente não determina a fonte ou a posição editorial por conta própria

Modos propostos:
- Caixa única: envolve o bloco inteiro, dimensionada pelo conteúdo
- Caixa por linha: acompanha cada linha; padding e união entre linhas devem evitar vincos indesejados

Os dois modos são necessários no acervo, mas seus valores pertencem às variantes aprovadas. A solução por linha do cine.ninja é uma referência de comportamento, não motivo para aplicar seu raio e sobreposição a todos os afluentes ou aos vídeos NINJA

Alterar a aparência de uma variante compartilhada deve atingir seus consumidores. Mudar a posição da caixa em uma composição não deve mover caixas em outras composições

## 3. Chapéu e etiqueta

Proposta: o chapéu é uma aplicação editorial da etiqueta. Ambos usam Texto + Caixa de texto. Sua função semântica permanece explícita: o chapéu contextualiza a chamada; etiquetas podem identificar tema, capítulo ou origem, conforme sua variante

Padrão já aprovado de chapéu NINJA: TipoNinja Regular em caixa alta, tracking +0,02, texto preto em caixa branca, padding horizontal 15 e vertical 9. Caixa obrigatória. O alinhamento óptico deve ser conferido sem transformar um deslocamento local em regra geral

A composição determina alinhamento com a chamada e posição do conjunto. A distância padrão de chapéu → chamada é 20 px. Ausência do chapéu elimina também esse espaço. Tamanhos aprovados dos templates continuam próprios: 37,4 px no card e 44,85 px no Reels atual; valores de 38/40 usados pela Máquina são propostas de vídeo, não substituições aprovadas

Decisão D1 aprovada por Thiago: duas variantes de chapéu para vídeo — caixa branca com texto preto como padrão e caixa na cor de destaque com texto preto. A opção de caixa preta com texto branco foi excluída. Não inferir vermelho de ao vivo como parte da paleta já aprovada; tratar separadamente quando definirmos estados semânticos

Mesmo usando a mesma base, etiqueta e chapéu não precisam ter tamanho idêntico em todos os usos. Uma variante é compartilhada apenas quando de fato representa a mesma decisão visual

## 4. Tratamento de contraste

Responsabilidade: melhorar a leitura do conteúdo sobre mídia. Recebe o retângulo visível da mídia e a caixa editorial medida depois do encaixe do texto. Posição e extensão precisam ser recalculadas quando o conteúdo muda

Degradê editorial aprovado: preto 100% no fim visível da fotografia; 0% 80 px acima do chapéu. Quando um template não usa chapéu, sua âncora alternativa deve estar declarada; a thumbnail aprovada usa o topo da chamada. Não inferir automaticamente essa alternativa para composições ainda não definidas

A foto e a sombra são camadas diferentes: o fim da foto não deve ser presumido como a base do quadro. A implementação deve usar as medidas finais da composição, não posições antigas escritas em pixels fixos

Na thumbnail NINJA, a camada preta de 5% e o degradê de proteção do logo de 30%/45° são tratamentos específicos. Não ativá-los globalmente em todos os vídeos

D6 aprovada: véu preto uniforme com opacidade 0,55; ou desfoque de 24 px com véu preto de opacidade 0,35. Referências horizontal e vertical em propostas/contraste-central. A composição escolhe o tratamento; nenhum deles é aplicado automaticamente a todos os vídeos

## Onde termina o componente e começa a composição

O componente possui sua aparência e comportamento reutilizáveis. A composição define referências de posição, área disponível, alinhamento do conjunto e quais variantes são utilizadas. O perfil de mídia define dimensões, margens e áreas de convivência. O conteúdo da entrega fornece os textos e recursos

Exemplo estrutural, ainda sem aprovação de layout: chamada central = mídia + contraste + conjunto editorial de chapéu opcional e chamada. Áudio obtido pode usar a mesma etiqueta e o mesmo texto, adicionando onda de áudio e identificação. O cartão final pode usar o mesmo conjunto editorial, adicionando assinatura

## Testes que devem acompanhar esta base

1. Alterar o padding de uma mesma variante de chapéu e observar os consumidores previstos no estúdio e no app
2. Alterar somente a posição do chapéu de uma composição e confirmar que as demais permanecem nas suas âncoras
3. Remover o chapéu e confirmar a remoção do espaço correspondente
4. Trocar texto curto por longo e verificar encaixe, equilíbrio e preservação do conteúdo
5. Exigir cinco linhas e tamanho abaixo de 85% do inicial, mas dentro do piso, e confirmar encaixe
6. Alterar a altura do texto e o fim visível da foto e confirmar o recálculo do degradê
7. Conferir as mesmas propriedades no preview e no arquivo exportado

Os testes são critérios para a futura implementação, não resultados já demonstrados na Máquina

## Refinamento transversal solicitado por Thiago — D8

Texto deve ficar visualmente centralizado verticalmente na faixa em todas as aplicações. Considerar a altura visível das letras, acentos e descendentes; padding CSS igual sozinho pode não produzir esse resultado. Equilibrar o respiro vertical e horizontal. No modo caixa única, acrescentar 20 px ao padding padrão em cada lado; no modo por linha usar o padrão da variante. Referência D8 aprovada: 18 px nas faixas e 38 px na caixa única. Paddings específicos de papéis já aprovados serão compatibilizados na consolidação, sem alteração silenciosa
