# 2. Ficha comum de template — rascunho

Vocabulário da etapa 1 e organização da ficha comum aprovados pelo usuário em 02/11/2026. O notícia Reels NINJA é o primeiro exemplo preenchido. Esta aprovação não altera o estado de variantes ou comportamentos ainda não validados e não representa um schema final nem uma migração dos arquivos aprovados.

## Blocos da ficha

| Bloco | O que registra |
|---|---|
| Identificação | ID, nome, marca, tipo e versão do template |
| Aplicações | Mídias atendidas e dimensões disponíveis; composição própria de cada combinação |
| Elementos | Quais elementos existem, quais recebem conteúdo, quais usam recursos e quais são opcionais |
| Aparência | Referências a fontes, cores, logos e grafismos da marca; parâmetros de texto e caixas |
| Composição | Áreas seguras, margens, alinhamentos, âncoras, distâncias e camadas |
| Comportamento | Ajuste de texto, recomposição sem elementos opcionais, enquadramento e tratamentos adaptáveis |
| Movimento | Entrada, permanência, saída e sincronização, quando houver definição aprovada |
| Referência aprovada | Exemplo preenchido e prévia; valores circunstanciais separados das regras |

Estes blocos agrupam informações da mesma ficha, não exigem arquivos separados. Nenhum template precisa inventar regras de movimento que ainda não foram definidas.

## Exemplo: notícia NINJA para Reels

| Campo | Definição ou valor aprovado |
|---|---|
| Marca | NINJA |
| Tipo | Notícia |
| Template | Notícia NINJA |
| Mídia deste perfil de composição | Reels |
| Dimensão | 1080 × 1920 px |
| Área segura | x=0, y=240, largura=1080, altura=1440 |
| Margens laterais editoriais | 70 px |
| Alinhamento | Centro horizontal do quadro |
| Base do bloco editorial | y=1550 na composição aprovada |
| Fonte do chapéu | TipoNinja Regular, 44,85 px, espaçamento entre letras +2% |
| Caixa do chapéu | Fundo branco, texto preto, padding lateral 15 px e vertical 9 px |
| Chapéu → chamada | 20 px entre caixas |
| Fonte da chamada | TipoNinja Regular, branca, entrelinha 100%, espaçamento entre letras 0% |
| Ajuste da chamada | Variável entre 64 e 170 px; preferência por quatro linhas; equilibrar quebras e preservar grupos de sentido |
| Recursos OpenType | Alternativos e ligaturas desativados nos textos TipoNinja |
| Lead | Previsto como elemento opcional da família notícia; composição Reels com lead ainda não validada |
| Assinatura | Letreiro branco, largura 72 px, altura proporcional; centralizado; base 50 px acima da base da área segura, em y=1630 |
| Crédito | Manrope Medium 16 px, branco; esquerda=70 px, base a 170 px do fim do quadro, fora da área segura |
| Degradê | Transparente 80 px acima do chapéu; preto a 100% no limite inferior visível da fotografia |
| Movimento | Ainda sem regras de movimento aprovadas neste template; exemplo atual é imagem estática |

Se o lead não estiver aprovado para esse perfil, a aplicação não deve inventar sua diagramação. Um elemento pode existir no vocabulário comum sem estar habilitado em todas as composições.

## O que fica na entrega, não na regra do template

- Texto específico da notícia
- Foto ou vídeo e seu enquadramento
- Crédito preenchido
- Cor escolhida entre as opções permitidas
- Resultado calculado: quebras e tamanho usado na chamada

Exemplo aprovado: chamada de 75,6 px em quatro linhas e fim da fotografia em y=1580. O tamanho e o limite da foto pertencem a esse exemplo; a regra é ajustar a fonte dentro da faixa e ancorar o degradê no limite efetivo da foto.

## Próxima etapa

Padronizar unidades e referências de medidas; depois definir a estrutura técnica validável e testar a leitura direta na Máquina de Vídeos. Preservar a separação aprovada entre regras de marca/template e preenchimento da entrega.
