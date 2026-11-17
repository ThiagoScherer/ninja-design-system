# V5 RC2 — 17/11/2026

Candidato local para testes de compatibilidade. Sem publicação ou alteração do link ativo

- Preservação dos bytes assinados pelo Git, inclusive com core.autocrlf=true
- UTF-8 explícito no instalador, verificadores e comando instalado; JSON de entrada aceita BOM
- npm executado pelo CLI JavaScript com o mesmo Node, sem depender de npm.cmd
- Detecção de Chrome/Edge disponível; opção `--browser chromium` para instalação gerenciada
- PATH do Node explícito nas dependências e diagnóstico de sistema, versões e etapa da falha
- Geração pelo comando instalado após mover a instalação para a pasta definitiva
- Recuperação da versão anterior e do lock se a geração definitiva falhar
- Regressões de codificação, finais de linha, caminhos e recuperação incluídas em `../testes/`

Templates, fontes, fotos de referência, logos e espaçamentos da RC1 preservados. Mudança no renderizador limitada à versão e leitura de JSON com BOM. A diferença histórica de assinatura NINJA continua registrada, sem promover referências novas

Escopo: cards 1080 × 1440. Vídeo continua no contrato V4; thumbnails previstas para V6

Evidências da validação local ficam separadas do pacote imutável, em `output/v5-rc2-validacao/`. Windows/Linux e testes conversacionais da equipe continuam pendentes
