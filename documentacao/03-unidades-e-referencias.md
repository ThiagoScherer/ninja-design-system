# 3. Unidades e referências — proposta para revisão

Status: convenções aprovadas pelo usuário em 02/11/2026. Esta aprovação não muda medidas dos templates nem migra suas configurações atuais.

## Convenções

| Informação | Unidade e significado | Exemplo |
|---|---|---|
| Dimensão, margem, padding, raio, distância, tamanho de fonte | Pixels no quadro final | Margem lateral 70 px em um quadro de 1080 × 1920 |
| Coordenadas | Pixels, origem no canto superior esquerdo da referência declarada; x cresce à direita e y para baixo | Área segura: x=0, y=240, largura=1080, altura=1440, relativa ao quadro |
| Entrelinha | Multiplicador do tamanho da fonte; distância entre linhas de base | 1 = 100%; 1.25 = 125%; fonte 32 px com entrelinha 1.25 produz avanço de 40 px |
| Espaçamento entre letras | Multiplicador do tamanho da fonte | 0.02 = +2%; fonte 40 px resulta em 0,8 px de espaçamento adicional |
| Cor sólida | Hexadecimal #RRGGBB, interpretado em sRGB | #009941 |
| Opacidade | Número de 0 a 1, separado da cor | 0 = transparente; 1 = opaco |
| Duração e instante | Segundos, relativos ao início da peça | Entrada em 0,2 s com duração de 0,4 s |
| Taxa de quadros | Quadros por segundo, declarada para a saída de vídeo | 30 fps; não é um valor obrigatório para todo vídeo |

Os valores são números nos dados; a unidade é definida pelo campo no contrato, não por textos livres como “70px” ou “20%”. A definição técnica dos nomes de campos será feita no schema. A interface pode exibir percentuais e unidades legíveis.

Pixels significam pixels de composição, não pixels físicos da tela nem o zoom do preview. Um preview reduzido aplica uma escala ao quadro inteiro; não recalcula fontes ou margens. Não usar pontos tipográficos como unidade compartilhada.

Espaçamento entre letras não substitui kerning: kerning é o ajuste entre pares de caracteres. Recursos OpenType, ligaturas e caracteres alternativos são configurações próprias da tipografia.

## Referências de posicionamento

Cada posição declara a que elemento se refere. Os casos iniciais são quadro, área segura, bloco editorial, elemento ou fotografia visível.

- **Posição absoluta:** x e y medidos a partir da origem da referência
- **Posição por âncora:** alinhar pontos identificados de dois elementos, com distância e direção explícitas
- **Fluxo:** elementos empilhados com distância entre suas caixas; não fixar a coordenada de cada texto quando sua altura depende do conteúdo

Não declarar simultaneamente uma coordenada fixa e uma âncora concorrente para a mesma posição. A coordenada resultante pode ser registrada como medida de uma entrega, sem virar outra regra.

## Exemplo 1 — assinatura do Reels NINJA

Regra: logo com largura 72 px e altura proporcional ao recurso; centro horizontal alinhado ao centro da área segura; base do logo 50 px acima da base da área segura.

Área segura: x=0, y=240, largura=1080, altura=1440.

Resultado para esta dimensão: centro x=540 e base y=1630, porque 240 + 1440 − 50 = 1630. O resultado é derivado da regra; não deve competir com ela como posição fixa.

O alinhamento usa a caixa do recurso. Se o arquivo tiver espaços vazios internos ou precisar de ajuste óptico, registrar o recorte ou o ajuste explicitamente; não alterar silenciosamente a referência de posição.

## Exemplo 2 — espaço entre textos

“Chapéu → chamada: 20 px” significa distância entre o limite inferior da caixa do chapéu e o limite superior da caixa da chamada. Não é uma medida entre as letras visíveis.

- **Padding:** distância interna entre o conteúdo e o contorno da caixa
- **Espaço entre elementos:** distância externa entre caixas
- **Ajuste óptico:** deslocamento do texto ou do elemento para centralização visual, descrito separadamente

Se o chapéu inteiro for deslocado 4 px para cima e o restante não mudar, a distância efetiva até a chamada aumenta 4 px. A aplicação deve executar as mesmas referências; não confundir o gap nominal de uma implementação com a distância final aprovada.

## Exemplo 3 — degradê adaptável

Regra comum, quando o tratamento estiver habilitado:

- Base: limite inferior visível da fotografia, após recorte e composição; preto com opacidade 1
- Topo padrão: 80 px acima da caixa do chapéu; preto com opacidade 0
- Extensão: distância entre essa base e esse topo, multiplicada pelo fator do template
- ELLA e Casa NINJA Amazônia: fator 1.25, mantendo a base e estendendo o topo para cima
- cine.ninja: tratamento desabilitado

Fórmula: `topo = base − (base − (topo_do_chapeu − 80)) × fator`.

O limite da fotografia não é necessariamente a base do quadro, nem a altura original do arquivo da imagem. Depende da região efetivamente mostrada na composição.

## O que estas convenções não padronizam

- Não impõem uma margem única nem uma escala de espaçamento única para todas as marcas
- Não obrigam toda chamada a ter fonte variável; a política pertence ao template
- Não definem o algoritmo de escolha de quebras e tamanho da fonte
- Não impõem uma área segura universal para Reels, Shorts e outras mídias
- Não atribuem animações a templates que ainda não têm movimento aprovado

## Próxima etapa

Depois de validar estas convenções, escrever a estrutura técnica mínima e um exemplo completo do Reels NINJA. Verificar se a Máquina de Vídeos e um renderizador de card conseguem interpretar os campos com o mesmo significado, sem manter traduções particulares.
