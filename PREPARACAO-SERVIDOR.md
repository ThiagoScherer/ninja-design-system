# Preparação da RC2 e do servidor de cards

Estado em 17/11/2026: **organização local concluída e envio autorizado ao repositório privado, sem deploy**

| Frente | Situação |
| --- | --- |
| Versão distribuída pelo link principal | V5 RC1, preservada |
| V5 RC2 | Candidata de compatibilidade, separada em `candidatos/v5-rc2/` |
| Teste local no Mac | Instalação, seis PNGs, reinstalação e card com foto concluídos |
| Servidor de renderização | Piloto em `servidor/`, testes de contrato sem navegador |
| Hospedagem | Conta Hetzner da equipe; novo servidor exclusivo a definir com Gian |
| Deploy e acesso da equipe | Pendentes |

GitHub: visibilidade privada confirmada em 17/11/2026. Preparação em branch separada para revisão em PR de rascunho. [Registro do envio](docs/github-pendente.md)

## Onde continuar

- [Servidor: implementação e contratos](servidor/README.md)
- [Hetzner: roteiro da futura implantação](servidor/HOSPEDAGEM.md)
- [Guia para agentes de IA](servidor/GUIA-AGENTES.md)
- [Validação do servidor e limites](servidor/VALIDACAO.json)
- [Situação consolidada da RC2](docs/validacao-rc2-2026-11-17.md)
- [Candidata RC2](candidatos/v5-rc2/README.md)

A cópia RC2 continua idêntica ao candidato testado no Mac, com seus hashes próprios. O arquivo `VALIDACAO.json` dentro desse pacote registra a situação no momento do empacotamento inicial; a evidência posterior do teste manual está consolidada no documento acima, sem reescrever o pacote assinado

## Próxima etapa

Com Gian disponível, escolher a máquina nova na Hetzner e o domínio dos cards. Depois fazer build e deploy, testar as saídas no servidor e conectar a IA. A conversa precisa ter uma ferramenta conectada para chamar o serviço; hospedar não ativa isso automaticamente

Esta preparação não publica release, não troca a versão oficial para RC2 e não cria um servidor
