# Registro da preparação no GitHub

Em 17/11/2026, Thiago autorizou tornar `ThiagoScherer/ninja-design-system` privado e enviar a preparação da V5 RC2 e do servidor de cards. A visibilidade privada foi confirmada pela API do GitHub antes do envio.

A primeira tentativa havia sido bloqueada pela revisão automática porque o repositório estava público. Esse bloqueio foi resolvido com a mudança para privado; nenhum arquivo foi enviado enquanto o destino estava público.

O lote é destinado à branch `preparacao/rc2-servidor-hetzner-2026-11-17`, para revisão em PR de rascunho. Inclui servidor, snapshot RC2 e documentação. O `ATIVO.json` principal continua na RC1. Não inclui fotos de matérias reais, credenciais, caches ou resultados locais.

Base da preparação: `01988242a8000101dd85c762efefc7a80d6ca796`. Recursos binários do candidato já existentes no repositório são referenciados pelos mesmos hashes.

Esta etapa não publica release, não promove a RC2 à versão oficial e não faz deploy. O teste real do contêiner no Linux, a implantação na Hetzner e a conexão com o cliente de IA continuam pendentes.
