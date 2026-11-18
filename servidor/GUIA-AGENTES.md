# Usar o servidor NINJA DS

Antes de gerar, chamar `listar_modelos` e `consultar_modelo` para a marca e a variante da entrega. O servidor desta rodada usa V5 RC2; não misturar fichas de outra release

O agente continua responsável pela composição: preservar conteúdo e ordem das palavras, escolher quebras e corpo usando a ficha e comparar alternativas quando necessário. Evitar ponto final no encerramento dos blocos, conforme regras comuns. Usar o texto original sem reescrever por iniciativa própria

`gerar_card` recebe o objeto da entrada do DS, com `imagem: {mimeType, base64}` no lugar de caminho local de foto. O corpo da chamada é `tamanho` em px e as quebras são `linhas`. Foto e fundo sólido são alternativas mutuamente exclusivas. Cores alternativas dependem do catálogo. Para cine.ninja com lead, informar também `linhasLead`

O serviço devolve o PNG como conteúdo de imagem MCP e os metadados. O cliente/agente deve encaminhar o conteúdo de imagem ao usuário usando o mecanismo de anexos/imagens disponível, sem inventar um caminho sandbox do servidor. A exibição final depende do cliente conectado e deve ser testada. Pela API REST, a imagem vem em `pngBase64`, ou como PNG binário quando solicitado com `Accept: image/png`

Antes de entregar, revisar o PNG: fontes, quebras, espaços, enquadramento, contraste e assinatura. O aceite geométrico não substitui aprovação visual. A geração não publica a peça em redes e não promove referências aprovadas

Falhas retornam código e mensagem, sem foto/texto nos logs do servidor. Se a geometria falhar, ajustar a entrada; não editar o template. Se o serviço ou navegador falhar, não substituir a composição por aproximação

Na ponte stdio local, `gerar_card` recebe `arquivoFoto` com o caminho absoluto da imagem fornecida pelo usuário; a ponte lê os bytes e os envia ao servidor sem colocar a imagem em base64 na conversa/modelo. O caminho local não é enviado ao servidor. Em clientes remotos, a integração de upload deve enviar os bytes pela API, evitando transportar base64 pelo contexto do modelo

## Conectar à conversa

- `/mcp` usa Streamable HTTP sem sessão persistente e retorna `application/json`. O cliente envia o token obtido no login OAuth quando esse modo está habilitado
- Integrações existentes podem continuar usando o token estático em `Authorization: Bearer <segredo>`. Guardar o segredo no mecanismo de configuração do cliente
- Para clientes MCP que aceitam comando local, `src/cliente-mcp.cjs` faz a ponte stdio → servidor remoto usando apenas Node 20+ e HTTPS. Nenhum Chrome é executado no computador do cliente

## Habilitar o login da equipe no Easypanel

1. No Auth0, registre uma API com identificador `https://ninja-design-system.ngiajr.easypanel.host/mcp`, assinatura RS256 e permissão `render:cards`. Ative **Resource Parameter Compatibility Profile** para os clientes que enviam `resource`. Use o registro OAuth compatível com o cliente do piloto e habilite a conexão de login escolhida para esse cliente. Use um tenant dedicado se optar por registro dinâmico aberto. [Guia Auth0 para MCP](https://auth0.com/blog/auth0-auth-for-mcp-servers-generally-available/) · [Compatibilidade do parâmetro resource](https://support.auth0.com/center/s/article/mcp-audience-error-with-auth0)
2. Em **User Management → Users**, obtenha os IDs das contas aprovadas no mesmo tenant. A lista aceita IDs de usuário, como `auth0|…` ou `github|…`, conforme o método de login. Use os valores do campo `user_id` e mantenha a lista no ambiente do servidor.
3. Na tela de ambiente do serviço de renderização no Easypanel, salve as três variáveis no mesmo envio e redeploye. Use o domínio do emissor com a barra final.

   ```dotenv
   NINJA_OAUTH_ISSUER=https://SEU-TENANT.REGIAO.auth0.com/
   NINJA_MCP_URL=https://ninja-design-system.ngiajr.easypanel.host/mcp
   NINJA_OAUTH_SUBJECTS=ID_USUARIO_1,ID_USUARIO_2
   ```

4. Confira `/readyz` e `/.well-known/oauth-protected-resource/mcp`. Em seguida, conecte uma conta incluída no Claude, solicite o PNG oficial e confira que a ferramenta `gerar_card` devolve a imagem. Tente conectar com uma conta fora da lista e confirme que ela não consegue chamar a ferramenta. Faça o teste de foto e entrega do PNG no cliente antes da liberação da equipe.
