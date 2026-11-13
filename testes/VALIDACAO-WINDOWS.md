# Segunda rodada — instalação Windows

Objetivo: validar a correção de instalação da V5 RC1 antes dos testes de criação conversacional. O commit histórico da primeira rodada é `01988242a8000101dd85c762efefc7a80d6ca796`. O candidato desta rodada deve ser identificado pelo novo commit da proposta, sem misturar revisões

## Regressões locais

Na raiz do snapshot completo:

```sh
python3 -B -m unittest discover -s testes -v
```

No Windows, substituir `python3` por `python` ou `py -3` conforme disponível. Os testes usam somente Python e Git. Simulam a leitura padrão cp1252, validam o checkout Git com `core.autocrlf=true`, `false` e `input`, verificam instalação nova e atualização existente e mantêm a rejeição de pacote alterado. Dependências e navegador são simulados nos testes do instalador; a suíte não certifica instalação real, npm ou renderização

## Teste independente em Windows real

1. Obter um clone novo do commit candidato, em uma pasta nova. Registrar commit, Windows, agente, Python, Node, npm, navegador, valor efetivo de `core.autocrlf` e presença de `PYTHONUTF8`. Usar `core.autocrlf=true` apenas para esse clone e executar sem `PYTHONUTF8=1`, sem alterar a configuração global
2. Ler `AGENTS.md`, `INICIAR.md` e `ATIVO.json`. Executar o instalador oficial com `--source` apontando ao clone e `--project` a um projeto vazio. Não substituir versões de dependências. Registrar sucesso somente após o autoteste e a criação do lock
3. Usar o `gerar.py` instalado para renderizar os seis JSON de `v5/cards/testes/`, sem editar os parâmetros. Entregar seis PNGs e os seis metadados. Em seguida, gerar os seis casos adicionais de `testes/sombras/entradas/`, conforme `testes/sombras/README.md`, e entregar também seus PNGs e metadados
4. Repetir o instalador no mesmo projeto e gerar novamente um card. Para testar migração, usar separadamente uma instalação da primeira rodada, repetir o instalador candidato e confirmar que `gerar.py` foi atualizado mesmo com o mesmo hash de pacote. Preservar as saídas anteriores
5. Conferir hashes, resolução 1080 × 1440, fontes, alertas, margens e espaçamentos. Comparar visualmente os PNGs externos com as referências identificadas, incluindo a assinatura NINJA. Não presumir aprovação das cinco assinaturas pendentes
6. Entregar relatório com comandos, intervenções e resultados. Bloqueios de rede ou navegador devem constar como bloqueios, sem aprovar a etapa não executada

Critério desta rodada: instalação limpa e seis exportações oficiais sem os dois contornos anteriores (reclonar com `core.autocrlf=false` e definir `PYTHONUTF8=1`). A atualização de uma instalação existente também deve substituir o gerador antigo

## Sombras e degradê nesta rodada

A entrega passa a incluir 12 PNGs e 12 metadados: seis controles originais sem degradê e seis pares com a imagem verde e o degradê oficial ativo. Seguir `testes/sombras/README.md`. Os casos adicionais ficam fora de `v5/`, preservando o pacote e as referências existentes

O verde uniforme permite observar a transição, a posição e a intensidade do degradê. A avaliação de legibilidade sobre fotografias com regiões claras e escuras continua necessária para validar esse outro cenário. A comparação dos PNGs do Gian e a decisão das cinco assinaturas continuam pendentes

Após a instalação e a reprodução serem aprovadas, avançar para chamada nova com tamanho e quebras escolhidos pelo agente e, em seguida, notícia em linguagem natural até o PNG final. Novas marcas e editor visual ficam para depois dessa validação
