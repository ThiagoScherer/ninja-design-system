# Hospedagem — Hetzner

Decisão de 17/11/2026: usar a conta Hetzner existente da equipe e criar **um novo servidor exclusivo para os cards**. O servidor atual hospeda dois projetos e fica fora desta implantação. Gian tem acesso ao painel

Estado: preparação local e no GitHub. Não houve contratação, criação de máquina, acesso remoto, mudança de DNS ou deploy. A sugestão anterior de Railway foi substituída por esta decisão

## Dados a definir com Gian depois

- Tipo de máquina, arquitetura, memória, região e custo
- Sistema operacional Linux e Docker com Compose
- Domínio/subdomínio para os cards e responsável pelo DNS
- Acesso administrativo para a instalação e mecanismo de guardar os segredos

Ainda não foi medido o consumo em Linux, portanto não há especificação de hardware ou orçamento aprovados. Conferir as opções do painel antes de criar a máquina. O pacote precisa executar Chromium e manter espaço temporário

## Estrutura preparada

`Dockerfile` inclui o gerador da RC2 e as dependências. `compose.yaml` sobe o renderizador e um Caddy para HTTPS. O renderizador não publica sua porta na internet; recebe pedidos pela rede interna do Compose. O Caddy aguarda o renderizador passar no teste real de prontidão. Os volumes do Caddy preservam certificados; fotos e PNGs não recebem volume persistente

O domínio e `NINJA_RENDER_TOKEN` serão configurados num `.env` exclusivo do servidor. O arquivo não deve ir para o Git. `.env.example` contém somente nomes e placeholders. Gerar o segredo no ambiente de implantação, sem enviá-lo pelo chat

## Preparação do pacote, sem deploy

Na raiz do checkout, com Node 20+:

```sh
node servidor/scripts/preparar.cjs
```

Se a pasta de saída já existir, informar uma nova pasta no argumento do comando; o preparador não sobrescreve pacotes anteriores

O contexto de build é a **pasta preparada**, que contém `Dockerfile`, `src/` e `pacote/`. Não executar o build a partir da raiz do repositório usando somente `-f servidor/Dockerfile`, pois esse contexto não tem a estrutura esperada

## Roteiro para a etapa futura de deploy

1. Gian confirma o novo servidor e os dados acima
2. Instalar Docker e o plugin Compose segundo a documentação oficial do sistema escolhido
3. Levar o pacote completo e identificado por commit para a máquina nova
4. Configurar domínio, DNS e entrada HTTPS; Caddy precisa que o domínio aponte para a máquina e as portas 80/443 estejam acessíveis. O acesso administrativo segue a configuração combinada com Gian
5. Criar o `.env` com domínio real e segredo. O exemplo é um modelo, não uma configuração utilizável
6. Na pasta preparada, conferir `docker compose config --quiet`. Na etapa autorizada de implantação, usar `docker compose up -d --build`
7. Esperar `/readyz` retornar 200. Isso exige uma geração real pelo servidor
8. Gerar seis casos oficiais e um card com foto; conferir fontes, dimensões, espaçamentos, hash e enquadramento. Comparar com o Mac, considerando diferenças possíveis de rasterização Linux/macOS
9. Conectar o cliente de IA e testar o caminho completo: texto + foto na conversa → imagem recebida. A API online sozinha não cria uma ferramenta na conversa
10. Medir consumo e tempos antes de liberar para a equipe

## Atualização e recuperação

- Cada implantação usa um commit e um pacote verificado; não sobrepor templates isolados
- Manter a imagem/pacote anterior para retorno se a candidata falhar
- Não promover a RC2 no `ATIVO.json` principal apenas porque o servidor iniciou
- Voltar para a versão anterior também exige conferir a imagem de teste

## Validação ainda pendente

Docker não está disponível neste ambiente. O arquivo Compose foi conferido estruturalmente, mas o build, os certificados, a inicialização do Chromium no contêiner, a máquina Hetzner e a conexão com IA ainda precisam de testes reais. A configuração não foi executada contra o servidor existente

Fontes técnicas:

- https://docs.docker.com/engine/install/
- https://docs.docker.com/compose/how-tos/startup-order/
- https://caddyserver.com/docs/automatic-https
- https://caddyserver.com/docs/caddyfile/directives/reverse_proxy
- https://playwright.dev/docs/docker
