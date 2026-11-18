# Usar o servidor NINJA DS

Antes de gerar, chamar `listar_modelos` e `consultar_modelo` para a marca e a variante da entrega. O servidor desta rodada usa V5 RC2; não misturar fichas de outra release

O agente continua responsável pela composição: preservar conteúdo e ordem das palavras, escolher quebras e corpo usando a ficha e comparar alternativas quando necessário. Evitar ponto final no encerramento dos blocos, conforme regras comuns. Usar o texto original sem reescrever por iniciativa própria

`gerar_card` recebe o objeto da entrada do DS, com `imagem: {mimeType, base64}` no lugar de caminho local de foto. O corpo da chamada é `tamanho` em px e as quebras são `linhas`. Foto e fundo sólido são alternativas mutuamente exclusivas. Cores alternativas dependem do catálogo. Para cine.ninja com lead, informar também `linhasLead`

O serviço devolve o PNG como conteúdo de imagem MCP e os metadados. O cliente/agente deve encaminhar o conteúdo de imagem ao usuário usando o mecanismo de anexos/imagens disponível, sem inventar um caminho sandbox do servidor. A exibição final depende do cliente conectado e deve ser testada. Pela API REST, a imagem vem em `pngBase64`, ou como PNG binário quando solicitado com `Accept: image/png`

Antes de entregar, revisar o PNG: fontes, quebras, espaços, enquadramento, contraste e assinatura. O aceite geométrico não substitui aprovação visual. A geração não publica a peça em redes e não promove referências aprovadas

Falhas retornam código e mensagem, sem foto/texto nos logs do servidor. Se a geometria falhar, ajustar a entrada; não editar o template. Se o serviço ou navegador falhar, não substituir a composição por aproximação

Na ponte stdio local, `gerar_card` recebe `arquivoFoto` com o caminho absoluto da imagem fornecida pelo usuário; a ponte lê os bytes e os envia ao servidor sem colocar a imagem em base64 na conversa/modelo. O caminho local não é enviado ao servidor. Em clientes remotos, a integração de upload deve enviar os bytes pela API, evitando transportar base64 pelo contexto do modelo

## Conectar à conversa

- `/mcp` é um endpoint HTTP JSON-RPC stateless que retorna `application/json`; negocia protocolos MCP 2025-03-26, 2025-06-18 e 2025-11-25. Não implementa OAuth, sessões persistentes, SSE nem carregamento de arquivos por URL
- Requer `Authorization: Bearer <segredo>` em cada chamada. Usar HTTPS na hospedagem e guardar o segredo no mecanismo de configuração do cliente
- Para clientes MCP que aceitam comando local, `src/cliente-mcp.cjs` faz a ponte stdio → servidor remoto usando apenas Node 20+ e HTTPS. Nenhum Chrome é executado no computador do cliente
- Para um cliente que exigir OAuth ou outro transporte, será necessário adaptar a autenticação/transporte antes de conectá-lo. Um endpoint online sozinho não cria uma ferramenta nesta conversa
- A configuração da conta e a chamada de ponta a ponta ainda precisam ser feitas após hospedar o servidor. Não afirmar que a integração já está ativa
