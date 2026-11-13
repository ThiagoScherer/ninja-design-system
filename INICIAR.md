# Iniciar com um único pedido

Instruções para o agente que recebeu o link e “Use este Design System para fazer meus cards”

## Executar sem transferir etapas técnicas ao colega

1. Usar a conexão GitHub já autorizada para obter o repositório oficial `ThiagoScherer/ninja-design-system`. Ler `ATIVO.json` da branch principal. Usar um único snapshot/commit para toda a instalação
2. Usar a pasta do projeto atual. Se não houver pasta ou ambiente de execução disponível, explicar essa necessidade em linguagem simples; não afirmar que a IA está pronta apenas por ter lido os arquivos
3. Obter `instalar.py` e o pacote completo indicado. Preferir checkout/download do snapshot pelo GitHub autenticado. Se o conector conseguir ler textos mas não baixar fontes e imagens, usar o download do snapshot pelo navegador já autenticado ou Git autorizado; não considerar leitura de fichas como instalação completa. Quando o conector disponibilizar os arquivos em disco, passar essa pasta em `--source`. Nunca pedir que alguém cole tokens no chat ou colocar credenciais em arquivos do DS
4. Ler o instalador e executá-lo. Preparar Node.js 20+, npm e o navegador pelo canal oficial quando necessário; usar os recursos e permissões já disponíveis no ambiente. Não substituir o renderizador por diagramação improvisada
5. O instalador executa instalação isolada, confere os hashes, gera duas amostras NINJA com/sem lead, verifica fontes, dimensões e espaçamentos, e grava `.ninja-design-system.lock.json` somente após sucesso. Falhas não devem desativar a versão anterior
6. Abrir as amostras em `.ninja-design-system/evidencias/` para a revisão visual. Confirmar sucesso somente se o resultado for utilizável
7. O instalador registra o uso do DS no projeto, com um bloco próprio em `AGENTS.md` e `CLAUDE.md`, preservando o conteúdo existente. A orientação permanece disponível em novos atendimentos
8. A resposta ao colega deve ser curta: “NINJA Design System V5 RC1 pronto para criar cards. Pode me mandar a notícia e as fotos”

Comandos destinados ao agente, não ao colega:

```sh
python3 /caminho/do/repositorio/instalar.py --source /caminho/do/repositorio --project /caminho/do/projeto
```

Sem checkout, um agente com Git autenticado pode executar o instalador obtido do repositório sem `--source`; ele busca a branch principal. Para usar Node/npm/navegador já existentes, o instalador aceita `--node`, `--npm-cli` e `--browser`

## Requisitos do ambiente

- Python 3 com biblioteca padrão e suporte a UTF-8; executar `python3 --version` (ou `python --version` no Windows) e confirmar que o comando inicia o Python
- Node.js 20+ e npm disponíveis para o agente
- Acesso ao snapshot completo do GitHub e a `registry.npmjs.org` para instalar as dependências fixadas no lockfile; esta RC usa Playwright 1.62.1
- Acesso ao download do Chromium pelo Playwright e permissão para iniciar o navegador. Um Chrome local pode ser indicado com `--browser`, mas precisa passar no mesmo autoteste
- Pasta do projeto com permissão de escrita

No Windows, usar o comando Python disponível (`python` ou `py -3`) no lugar de `python3` quando necessário. O repositório preserva os bytes dos arquivos via `.gitattributes`; não é necessário mudar a configuração global do Git nem definir `PYTHONUTF8=1`. O instalador e o gerador leem os manifests em UTF-8 explicitamente

Uma cópia antiga já convertida para CRLF precisa ser obtida novamente a partir do snapshot corrigido. Não recalcular hashes para aprovar arquivos convertidos. Em instalações existentes, repetir o instalador atualizado também substitui `gerar.py`, mesmo quando a versão e os hashes do pacote visual continuam iguais

Falhas de acesso ao npm e de inicialização do navegador são bloqueios de ambiente: registrar a etapa e o erro, sem trocar a versão do Playwright, desativar verificações ou declarar instalação concluída. A instalação e a geração ainda precisam ser repetidas em Windows real antes de certificar esse ambiente

## Criar os próximos cards

Ler `.ninja-design-system.lock.json`, a ficha do template instalado e `pacote/cards/README.md`. Preparar `entrada.json` preservando o texto, escolher e conferir as quebras e o corpo com as fontes próprias da marca, e executar:

```sh
python3 .ninja-design-system/gerar.py criar entrada.json card.png
```

O comando confere novamente o pacote e exporta `card.png.ds.json` ao lado da imagem, com versão, template, medidas e fontes carregadas. Se não couber, corrigir a composição e revisar; não reduzir ou reescrever o conteúdo sem autorização

## Atualizar

Ao receber novamente o mesmo link e pedido, buscar a indicação atual em `ATIVO.json` e repetir o instalador. Não sobrepor pedaços de releases. A versão anterior fica disponível como cópia de recuperação quando há atualização; exportações existentes não são alteradas

## Se o ambiente não conseguir

Sem acesso ao repositório privado: solicitar a conexão GitHub autorizada, sem pedir senhas/tokens. Sem execução ou acesso a arquivos: explicar que esse ambiente pode consultar o DS, mas ainda não instalou o gerador. Se houver uma permissão concreta pendente, pedir apenas essa ação. Nunca afirmar instalação, atualização ou teste concluído sem evidências
