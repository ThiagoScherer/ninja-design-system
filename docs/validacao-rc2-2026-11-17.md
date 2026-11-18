# Validação RC2 — 17/11/2026

Base: V5 RC1, commit `01988242a8000101dd85c762efefc7a80d6ca796`. Candidata: `5.0.0-rc.2`, manifesto SHA-256 `c32f194e02abc83e04680df6a36e25502ef91bbc4163735edaae7fbd0c41ce85`

## Evidências concluídas

- 18 regressões de compatibilidade do instalador passaram no Mac
- Integridade dos 121 arquivos do pacote conferida
- 66 arquivos HTML/fontes/imagens/logos preservados byte a byte contra a RC1
- Seis entradas de teste preservadas; fichas mantêm valores de composição, com atualização do número da release
- Execução manual no Terminal do Mac concluiu instalação com cache novo, geração dos seis PNGs e reinstalação
- Card com foto fornecida pelo usuário gerado pela RC2; fontes e geometria conferidas. Revisão visual identificou crop fechado e competição das letras da faixa com a chamada, sem aprovar a composição como referência

## Comparação com saídas locais da RC1

Cinco dos seis PNGs são idênticos pixel a pixel às imagens de `output/v5-validacao` do acervo local. O caso `media-sem-lead` difere em 1.560 pixels somente na assinatura, na região x=964–1028, y=1350–1389. Não confundir essa comparação com o conjunto histórico de referências aprovadas: a divergência de assinatura já estava documentada na rodada anterior e continua pendente

A igualdade das cinco imagens não promove novas referências e a diferença da assinatura não foi corrigida alterando templates nesta etapa

## Execução pela conversa

A inicialização do Chrome pela execução restrita falhou antes de abrir o template. Registros históricos mostram que gerações anteriores usavam permissão ampliada, indisponível nesta conversa. A mesma falha aparece em relatórios de 10/11, portanto o uso de Chrome não foi introduzido pela RC2. Pelo Terminal do usuário, o gerador funcionou

Isso motivou a preparação de um serviço central, não uma alteração de segurança ou um motor de diagramação aproximado

## Pendências

- Execução real em Windows e Linux
- Atualização completa RC1 → RC2 em ambiente de destino
- Navegador gerenciado em instalação limpa da RC2
- Build Docker e geração de cards no novo servidor Hetzner
- Comparação e revisão visual das saídas do servidor
- Conexão da ferramenta de IA e entrega da imagem na conversa
- Aprovação das referências de assinatura NINJA

Os testes de API e MCP do servidor usam processo controlado. Eles não comprovam geração real no contêiner. Fotos, PNGs de matérias reais, logs pessoais e credenciais não acompanham esta preparação no GitHub
