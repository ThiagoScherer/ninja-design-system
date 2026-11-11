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
