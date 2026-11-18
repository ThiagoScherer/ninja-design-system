# Servidor NINJA DS — piloto 0.1.0

Recebe texto e foto, executa o renderizador imutável da V5 RC2 e retorna PNG 1080 × 1440 com metadados. O objetivo é permitir produção por conversa sem instalar Chrome em cada computador

Estado: preparação para um novo servidor exclusivo na Hetzner, sem deploy. A integração com um cliente de IA e a validação gráfica no servidor ainda precisam ser concluídas

## O que está incluído

- API REST com PNG binário ou base64 e metadados
- Endpoint MCP stateless com três ferramentas: `listar_modelos`, `consultar_modelo` e `gerar_card`
- Fila de um render por vez, até quatro aguardando por até 30 segundos, timeout de execução e limpeza dos arquivos temporários
- Autenticação por token; foto recebida por bytes, sem aceitar URLs ou caminhos do computador
- Verificação do pacote SHA-256 antes de gerar e conferência da saída: versão, hash, dimensões e fontes
- Teste real de geração na inicialização; `/readyz` só libera quando passar
- Dockerfile com Playwright e navegador na mesma versão do pacote; adaptador stdio opcional para clientes MCP

O agente define quebras e corpo da chamada e revisa o resultado; não foi criado um algoritmo universal de diagramação. O servidor preserva os templates. Vídeos e thumbnails não entram nesta rodada

## Preparar o pacote

Na raiz do projeto, com Node 20+ disponível:

```sh
node servidor/scripts/preparar.cjs
```

O pacote RC2 é resolvido em `candidatos/v5-rc2/v5` no GitHub e no workspace organizado, ou em `distribuicao/ninja-ds-v5-rc2/v5` no acervo local histórico.

Cria `output/servidor-ninja-rc2`, com o código, o pacote completo V5 e um manifesto dos arquivos. Não inclui fotos do usuário, tokens, caches ou instalações de testes. O ZIP preparado é um artefato para hospedar; não altera o link oficial da RC2

## Testes sem navegador

```sh
node --test servidor/testes/*.test.cjs
```

Esses testes cobrem API, entrada, protocolo MCP, integridade, filas, isolamento e limpeza com processo de renderização controlado. Não comprovam que o navegador funciona na hospedagem

## Hospedar

A hospedagem escolhida é Hetzner, em um novo servidor separado dos dois projetos existentes. O pacote requer execução de contêiner com processo Node persistente, possibilidade de executar Chromium e espaço temporário. Não é um site estático nem um serviço compatível automaticamente com qualquer ambiente serverless

1. Com Gian, escolher e criar o novo servidor na conta Hetzner já existente; seguir `HOSPEDAGEM.md`
2. Configurar `NINJA_RENDER_TOKEN` como segredo aleatório com pelo menos 32 bytes. Não incluir o segredo no repositório ou no chat
3. Na etapa futura de deploy, construir o Dockerfile na raiz do pacote preparado e iniciar `compose.yaml`, com o domínio e segredo configurados. O Caddy fornece a entrada HTTPS; o renderizador fica na rede interna
4. Esperar `/readyz` responder 200; ele exige uma geração real bem-sucedida
5. Gerar os seis casos e um card com foto pelo serviço, comparar com a RC2 local e revisar tipografia e contraste. Fontes podem variar na rasterização entre macOS e Linux; não presumir igualdade pixel a pixel
6. Conectar o cliente de IA conforme `GUIA-AGENTES.md` e verificar que a imagem aparece na conversa

A imagem base oficial Playwright precisa existir na versão fixada. Docker não está disponível neste ambiente de desenvolvimento, portanto o build e a geração dentro do contêiner ainda não foram executados aqui

## API

`GET /healthz` verifica processo vivo. `GET /readyz` informa se o teste de geração passou. As demais rotas exigem Bearer token

| Rota | Resultado |
| --- | --- |
| `GET /v1/catalog` | Marcas, variantes e regras comuns |
| `GET /v1/templates/{marca}/{variante}` | Ficha do modelo e regras |
| `POST /v1/cards` | `{pngBase64, metadata}`; com `Accept: image/png`, PNG binário |
| `POST /mcp` | MCP JSON-RPC stateless, resposta JSON e imagens inline |
| `GET /openapi.json` | Contrato OpenAPI 3.1 |

Entrada de exemplo sem foto, para diagnóstico:

```json
{
  "marca": "ninja",
  "chapeu": "CULTURA VIVA",
  "chamada": "Festival ocupa praças com arte e música",
  "linhas": ["FESTIVAL OCUPA PRAÇAS", "COM ARTE E MÚSICA"],
  "tamanho": 90,
  "credito": "TESTE SEM FOTO",
  "fundo": "#167a46"
}
```

Para foto, remover `fundo` e enviar `imagem: {"mimeType":"image/png","base64":"..."}`. Limite da imagem 16 MiB; limite total JSON 24 MiB. Não enviar caminhos locais nem links de fotos

## Dados e limites do piloto

Fotos, entradas e PNGs ficam apenas no diretório temporário da tarefa e são removidos após a resposta. Os logs registram código de erro e identificador, sem conteúdo editorial nem token. Não há biblioteca de peças, contas individuais, faturamento ou fila durável. O cliente precisa salvar a imagem recebida; o servidor não oferece um link público permanente

O token é compartilhado pelo piloto; um serviço de equipe com identidade por pessoa requer outra etapa. O transporte MCP adotado atende clientes compatíveis com HTTP JSON stateless ou ponte stdio; não equivale a compatibilidade universal com todas as IAs

Fontes técnicas: https://playwright.dev/docs/docker e https://modelcontextprotocol.io/specification/2025-11-25/basic/transports
