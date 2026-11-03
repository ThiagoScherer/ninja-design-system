# NINJA Design System v2

Pacote local 2.0.0 para integrar componentes gráficos compartilhados à Máquina de Vídeos. Inclui a base v1 aprovada, as decisões da v2, mapa de composições, referências e instruções de implementação e testes

Comece por IMPLEMENTAR-COM-AGENTE.md. O contrato estruturado está em contrato-integracao.json e as aprovações em integracao/decisoes.json. O comparativo esperado está em integracao/IMPACTO-POR-COMPOSICAO.md

## Conteúdo

- base-aprovada/: biblioteca v1 preservada, fontes, recursos, templates, renderizador e seis exemplos
- integracao/: fichas e referências da v2, 28 entradas inventariadas e critérios de aceitação
- testes/: 16 casos e modelo de relatório para execução na Máquina
- ferramentas/conferir-pacote.cjs: integridade, caminhos e estrutura deste pacote
- arquivos.sha256.json: hashes dos arquivos distribuídos

A v2 preserva todas as animações existentes. Valores sem redefinição explícita permanecem como variantes legadas locais, identificadas durante a migração. O teste exploratório de movimento foi excluído da distribuição

Conferência local: `node ferramentas/conferir-pacote.cjs`. Esta conferência não executa nem certifica a Máquina. O agente implementador deve rodar os testes da aplicação, preview/exportação e casos T01–T16, anexando evidências

Os recursos incluídos mantêm suas condições de uso; o pacote não concede novas licenças. Distribuição destinada ao fluxo privado existente do projeto
