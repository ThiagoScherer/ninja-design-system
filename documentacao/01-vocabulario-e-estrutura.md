# 1. Vocabulário e estrutura — proposta para revisão

Status: vocabulário e organização conceitual aprovados pelo usuário em 02/11/2026, após a adoção de tipo, mídia e dimensão. Escopo inicial: templates de notícia. Não renomeia arquivos existentes nem altera aplicações.

## Nomes compartilhados

| Termo | Definição | Exemplo |
|---|---|---|
| Marca | Identidade à qual o material pertence | NINJA, FODA, Clímax |
| Tipo | Natureza editorial do conteúdo | Notícia, coluna |
| Mídia | Modalidade de publicação ou destino da entrega | Reels, vídeo longo YouTube, Shorts YouTube, card de feed |
| Template | Modelo gráfico com regras para um tipo de conteúdo e uma ou mais mídias | Notícia NINJA |
| Variação | Alternativa prevista pelo template, sem mudar sua finalidade | Verde ou laranja; com ou sem lead |
| Dimensão | Largura e altura finais do quadro, em pixels | 1080 × 1440 ou 1080 × 1920 |
| Entrega | Material preenchido para uma publicação ou uso concreto | Card da notícia sobre o Vale do Javari |
| Recurso | Arquivo utilizado pela composição | Fonte, logo, fotografia, vídeo |

Reels passa a ser um valor de mídia. Reels e Shorts podem compartilhar a dimensão 1080 × 1920 e até a mesma composição, mas podem exigir áreas seguras e saídas diferentes. A mídia não cria automaticamente um template novo: o template declara para quais mídias e dimensões está preparado.

Marca, tipo, mídia e dimensão são campos distintos, não uma árvore rígida de pastas. As regras visuais ficam no template; requisitos de publicação pertencem à mídia. A entrega precisa atender a ambos.

## Anatomia da notícia

| Nome compartilhado | Chave proposta | Significado |
|---|---|---|
| Chapéu | `chapeu` | Texto curto que contextualiza a notícia |
| Chamada | `chamada` | Texto principal da notícia |
| Lead | `lead` | Texto complementar opcional |
| Recurso principal | `recurso_principal` | Foto ou vídeo utilizado na composição, com arquivo, natureza (imagem ou vídeo) e enquadramento |
| Crédito | `credito` | Atribuição da foto ou do vídeo utilizado |
| Assinatura | `assinatura` | Composição de identificação da marca, usando logo e outros elementos quando previstos |

`chamada` é o nome compartilhado para o que se chama manchete no contexto desta notícia. Não é um sinônimo universal para títulos de capítulos, gráficos ou outras peças. `logo` designa o recurso; `assinatura`, seu uso na composição. `bug` é uma aplicação de assinatura no vídeo, não o nome do arquivo do logo.

As chaves usam português, sem acentos e com sublinhado quando necessário. O nome visível na interface pode ter acentos. Não criar chaves paralelas para o mesmo conceito.

## Estrutura comum

### A. Marca

Guarda recursos e valores de identidade: fontes, paletas, logos e grafismos. O template aponta para eles; não cria uma cópia independente a cada aplicação.

### B. Template

Declara quais elementos existem, quais são opcionais, as composições disponíveis, as mídias e dimensões aceitas e as regras de cada elemento: fonte, cor, limites de tamanho, quebras, margens, âncoras, espaçamentos, tratamentos e movimento quando aplicável.

Com e sem lead são opções da mesma estrutura de notícia, embora possam ter prévias e regras de recomposição específicas. Uma variação de cor não exige duplicar todas as regras de layout.

### C. Entrega

Referencia marca, tipo, mídia, template, dimensão e versão da biblioteca, e preenche:

- `conteudo`: textos de chapéu, chamada, lead e crédito
- `recursos`: foto ou vídeo utilizado e enquadramento
- `opcoes`: escolhas que o template permite, como variação de cor

Fontes e logos vêm das referências declaradas pelo template. Ausência de lead é ausência de conteúdo, não uma linha vazia reservada. A entrega não recebe regras arbitrárias de diagramação fora das opções do template.

Essa é a organização conceitual. Nomes finais dos campos de composição, IDs, versões e o schema serão definidos no próximo passo, sem impor duplicações ao banco atual.

## Exemplo conceitual

Marca: NINJA

Tipo: notícia

Template: notícia NINJA

Mídia: Reels

Dimensão: 1080 × 1920

Conteúdo: chapéu “ABSURDO”, chamada sobre ameaças contra indígenas, sem lead, crédito da fotografia

Recursos: fotografia e seu enquadramento

Regras vindas do template: TipoNinja; chamada entre 64 e 170 px; preferência por quatro linhas; margens laterais 70 px; assinatura centralizada; degradê adaptável

Resultado da composição: chamada em 75,6 px e suas quatro quebras específicas. Esse resultado pertence à entrega e não redefine o tamanho do template para outras notícias.

## O que deve ser validado nesta etapa

1. `chamada` como nome compartilhado do texto principal da notícia
2. Distinção entre marca, tipo, mídia, template, dimensão e entrega
3. Identidade na marca, regras no template e preenchimento na entrega
4. Cores e presença do lead como variações, sem duplicar o template inteiro

## Cuidados de nomenclatura

- `midia` significa destino/modalidade de publicação, não o arquivo inserido na composição; o arquivo fica em `recursos`
- “Série” pode atravessar notícias e colunas; não torná-la um tipo exclusivo automaticamente. Se necessário, registrar o vínculo com uma série separadamente
- Dimensão é largura e altura, não extensão de arquivo, codec ou proporção isolada
- Mudanças neste contrato são conceituais: chaves antigas dos templates e da Máquina não são renomeadas sem uma migração planejada

## Depois desta etapa

Converter uma ficha real do Reels NINJA para a estrutura validada. Só então definir o schema e confrontar a estrutura com a Máquina de Vídeos. Questões de algoritmos, distribuição e migração não precisam ser resolvidas para validar estes conceitos.
