# Dependências das 28 aplicações

Mapa proposto para implementação, baseado na auditoria preservada. As dependências não afirmam compartilhamento já existente no código. Animações atuais permanecem intactas

| Aplicação | Estado | Componentes propostos |

|---|---|---|

| [Chamada central (modelo de vídeo do Canva)](composicoes/manchete-central-modelo-de-video-do-canva.md) | mapeada_especificacao_parcial | chapeu, texto_editorial, tratamento_contraste, midia |

| [Pergunta-gancho / título em tarja](composicoes/pergunta-gancho-titulo-em-tarja.md) | mapeada_especificacao_parcial | texto_editorial, caixa_texto, grifo, midia |

| [Manchete de outro veículo](composicoes/manchete-de-outro-veiculo.md) | mapeada_especificacao_parcial | cartao, recurso_grafico, texto_editorial, grifo, informacao_auxiliar, midia |

| [Marcador de capítulo](composicoes/marcador-de-capitulo.md) | mapeada_especificacao_parcial | texto_editorial, etiqueta, tratamento_contraste, midia |

| [Etiqueta de tema / série](composicoes/etiqueta-de-tema-serie.md) | mapeada_especificacao_parcial | etiqueta, tratamento_contraste |

| [Palavra-conceito](composicoes/palavra-conceito.md) | mapeada_especificacao_parcial | texto_editorial, grifo, midia |

| [Tarja de nome e cargo](composicoes/tarja-de-nome-e-cargo.md) | mapeada_especificacao_parcial | identificacao, caixa_texto |

| [Localização](composicoes/localizacao.md) | mapeada_especificacao_parcial | identificacao, recurso_grafico, informacao_auxiliar, caixa_texto |

| [Linha do tempo](composicoes/linha-do-tempo.md) | mapeada_especificacao_parcial | sequencia_temporal, cartao, texto_editorial, midia |

| [Documento com grifo](composicoes/documento-com-grifo.md) | mapeada_especificacao_parcial | cartao, midia, grifo, informacao_auxiliar |

| [Post de rede social](composicoes/post-de-rede-social.md) | mapeada_especificacao_parcial | cartao, identificacao, texto_editorial, midia, informacao_auxiliar, grifo |

| [Áudio obtido](composicoes/audio-obtido.md) | mapeada_especificacao_parcial | etiqueta, onda_audio, transcricao, identificacao, midia, tratamento_contraste |

| [Print / gravação de tela](composicoes/print-gravacao-de-tela.md) | mapeada_especificacao_parcial | cartao, midia, grifo, credito, tratamento_contraste |

| [Tela dividida (2, 3, 4)](composicoes/tela-dividida-2-3-4.md) | mapeada_especificacao_parcial | grade_midia, midia, credito |

| [Número em destaque](composicoes/numero-em-destaque.md) | mapeada_especificacao_parcial | dado_numerico, texto_editorial, informacao_auxiliar, midia, tratamento_contraste |

| [Número sobre o vídeo](composicoes/numero-sobre-o-video.md) | mapeada_especificacao_parcial | dado_numerico, identificacao, recurso_grafico |

| [Sistema de gráficos](composicoes/sistema-de-graficos.md) | mapeada_especificacao_parcial | visualizacao_dados, texto_editorial, informacao_auxiliar |

| [Comparação](composicoes/comparacao.md) | mapeada_especificacao_parcial | grade_midia, midia, identificacao, texto_editorial, dado_numerico |

| [O que se sabe / o que não se sabe](composicoes/o-que-se-sabe-o-que-nao-se-sabe.md) | mapeada_especificacao_parcial | lista_editorial, texto_editorial, cartao |

| [Selo de checagem](composicoes/selo-de-checagem.md) | mapeada_especificacao_parcial | texto_editorial, selo, grifo, informacao_auxiliar, midia |

| [Grid de fotos](composicoes/grid-de-fotos.md) | mapeada_especificacao_parcial | grade_midia, midia, credito |

| [Citação](composicoes/citacao.md) | mapeada_especificacao_parcial | texto_editorial, caixa_texto, identificacao, cartao, midia |

| [Crédito](composicoes/credito.md) | mapeada_especificacao_parcial | credito |

| [Transições — fitas NINJA](composicoes/transicoes-fitas-ninja.md) | em_espera | transicao |

| [Fundos](composicoes/fundos.md) | em_espera | fundo_grafico |

| [Legenda](composicoes/legenda.md) | mapeada_especificacao_parcial | transcricao, caixa_texto, grifo |

| [Cartão final de ponte](composicoes/cartao-final-de-ponte.md) | mapeada_especificacao_parcial | chapeu, texto_editorial, assinatura, tratamento_contraste |

| [Pacote 360 nas redes](composicoes/pacote-360.md) | agrupamento_de_entregas | composicao_por_midia, chapeu, texto_editorial, assinatura, midia, tratamento_contraste |



## Compartilhamento inverso

Uma mudança deve alcançar apenas consumidores da mesma variante, não todos os usos de um componente indiscriminadamente

| Componente | Entradas consumidoras propostas |

|---|---|

| assinatura | 2 — cartao-final-de-ponte, pacote-360 |

| caixa_texto | 5 — pergunta-gancho-titulo-em-tarja, tarja-de-nome-e-cargo, localizacao, citacao, legenda |

| cartao | 7 — manchete-de-outro-veiculo, linha-do-tempo, documento-com-grifo, post-de-rede-social, print-gravacao-de-tela, o-que-se-sabe-o-que-nao-se-sabe, citacao |

| chapeu | 3 — manchete-central-modelo-de-video-do-canva, cartao-final-de-ponte, pacote-360 |

| composicao_por_midia | 1 — pacote-360 |

| credito | 4 — print-gravacao-de-tela, tela-dividida-2-3-4, grid-de-fotos, credito |

| dado_numerico | 3 — numero-em-destaque, numero-sobre-o-video, comparacao |

| etiqueta | 3 — marcador-de-capitulo, etiqueta-de-tema-serie, audio-obtido |

| fundo_grafico | 1 — fundos |

| grade_midia | 3 — tela-dividida-2-3-4, comparacao, grid-de-fotos |

| grifo | 8 — pergunta-gancho-titulo-em-tarja, manchete-de-outro-veiculo, palavra-conceito, documento-com-grifo, post-de-rede-social, print-gravacao-de-tela, selo-de-checagem, legenda |

| identificacao | 7 — tarja-de-nome-e-cargo, localizacao, post-de-rede-social, audio-obtido, numero-sobre-o-video, comparacao, citacao |

| informacao_auxiliar | 7 — manchete-de-outro-veiculo, localizacao, documento-com-grifo, post-de-rede-social, numero-em-destaque, sistema-de-graficos, selo-de-checagem |

| lista_editorial | 1 — o-que-se-sabe-o-que-nao-se-sabe |

| midia | 17 — manchete-central-modelo-de-video-do-canva, pergunta-gancho-titulo-em-tarja, manchete-de-outro-veiculo, marcador-de-capitulo, palavra-conceito, linha-do-tempo, documento-com-grifo, post-de-rede-social, audio-obtido, print-gravacao-de-tela, tela-dividida-2-3-4, numero-em-destaque, comparacao, selo-de-checagem, grid-de-fotos, citacao, pacote-360 |

| onda_audio | 1 — audio-obtido |

| recurso_grafico | 3 — manchete-de-outro-veiculo, localizacao, numero-sobre-o-video |

| selo | 1 — selo-de-checagem |

| sequencia_temporal | 1 — linha-do-tempo |

| texto_editorial | 15 — manchete-central-modelo-de-video-do-canva, pergunta-gancho-titulo-em-tarja, manchete-de-outro-veiculo, marcador-de-capitulo, palavra-conceito, linha-do-tempo, post-de-rede-social, numero-em-destaque, sistema-de-graficos, comparacao, o-que-se-sabe-o-que-nao-se-sabe, selo-de-checagem, citacao, cartao-final-de-ponte, pacote-360 |

| transcricao | 2 — audio-obtido, legenda |

| transicao | 1 — transicoes-fitas-ninja |

| tratamento_contraste | 8 — manchete-central-modelo-de-video-do-canva, marcador-de-capitulo, etiqueta-de-tema-serie, audio-obtido, print-gravacao-de-tela, numero-em-destaque, cartao-final-de-ponte, pacote-360 |

| visualizacao_dados | 1 — sistema-de-graficos |



## Limites

28 entradas: 25 composições candidatas, duas categorias em espera (transições e fundos) e um agrupamento de saídas (pacote 360). Tela dividida e grid de fotos apontam à mesma ficha observada; isso permite estudar uma mesma grade com variantes, sem presumir renderizador compartilhado atual

Os campos de conteúdo foram preservados como evidência. A migração semântica será explícita: título de veículo externo continua sendo título da fonte; não renomear todo campo texto ou titulo para chamada

As fichas ainda não cobrem todas as medidas e variantes. Não entregar ao Gian como especificação final até fechar essas lacunas
