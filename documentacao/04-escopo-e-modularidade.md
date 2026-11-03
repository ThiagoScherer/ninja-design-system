# Escopo e modularidade

## Prioridades definidas pelo usuário

- O sistema deve ser modular e permitir incorporar novos cenários sem refazer o conjunto
- A primeira versão pode atender somente à Mídia NINJA
- A estrutura deve comportar outras marcas e universos da Floresta Ativista desde a base
- Chegar rapidamente a um sistema útil para produzir materiais NINJA; não esperar uma solução completa para todos os cenários

## Próximo passo proposto

Consolidar o piloto em um gerador mínimo de notícia NINJA, lendo o contrato diretamente. Aproveitar os templates e recursos aprovados em vez de redesenhá-los. Escopo inicial atualizado pelo usuário: card com e sem lead, Reels sem lead e thumbnail de YouTube (1920×1080) com uma, duas ou três imagens.

## Separação mínima de responsabilidades

| Parte | Responsabilidade |
|---|---|
| Contrato comum | Vocabulário, estrutura, unidades e significado dos comportamentos |
| Pacote da marca | Fontes, cores, logos, grafismos e referências da marca |
| Templates | Composições, parâmetros e comportamentos habilitados por mídia/dimensão |
| Renderização | Executar os comportamentos declarados e produzir o resultado |
| Entrega | Preencher conteúdo, mídia de publicação, recursos e opções permitidas |

Adicionar uma marca que usa comportamentos existentes deve exigir dados e recursos, sem ramificações de marca espalhadas pelo motor. Um comportamento novo deve poder ser acrescentado como módulo identificado, sem modificar todos os templates. Comportamentos não suportados devem ser sinalizados explicitamente, sem substituição silenciosa.

Esta divisão é de responsabilidades; não exige cinco serviços, cinco repositórios nem uma arquitetura de plugins completa na primeira versão.

## Critério de utilidade da primeira versão

Uma entrada de dados conhecida gera um arquivo NINJA com o template aprovado, ajusta texto e degradê, verifica limites e registra a composição calculada. Mesmos dados e mesma versão devem permitir reproduzir a entrega no ambiente suportado. Não pode depender de editar manualmente o HTML a cada notícia.

## Fora do caminho crítico

- Migrar todas as marcas nesta etapa
- Criar uma plataforma online ou interface nova
- Implementar todos os modelos de motion graphics
- Resolver antecipadamente todos os cenários futuros
- Alterar a Máquina de Vídeos antes de estabilizar a geração local mínima

Os demais templates aprovados permanecem no acervo e servem para verificar se a estrutura está ficando específica demais para a NINJA. O cine.ninja, por exemplo, é uma referência de extensão futura para boxes por linha; não precisa bloquear a primeira entrega útil da NINJA.

## Thumbnail — diretrizes aprovadas

Dimensão 1920×1080; margem 60 px; TipoNinja com alternativos desativados. Uma, duas ou três imagens são variações do mesmo template. Primeira implementação em biblioteca-local/em-validacao/ninja-thumbnail.
