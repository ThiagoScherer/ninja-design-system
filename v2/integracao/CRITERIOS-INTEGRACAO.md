# Casos de aceitação da integração

Estado: resultados esperados para o Gian executar após implementação. Nenhum destes casos foi certificado na Máquina nesta etapa. Usar uma cópia de teste dos projetos; registrar versão do DS e da aplicação

| ID | Ação | Resultado esperado |
|---|---|---|
| T01 | Alterar padding de uma variante de caixa | Todas as composições que referenciam essa variante atualizam; outras variantes mantêm seus valores |
| T02 | Mover um conjunto editorial em uma composição | Somente essa composição muda de posição |
| T03 | Trocar chamada curta por longa | Encaixe segue a política do papel, mede largura e altura e preserva conteúdo |
| T04 | Exigir quinta linha e redução além de 15% | A redução continua até o limite do contexto; não fica travada no primeiro patamar |
| T05 | Remover chapéu, apoio e função opcionais | Elementos e espaços correspondentes desaparecem; animação não procura alvo inexistente |
| T06 | Alterar altura do texto ou fim da fotografia | Degradê usa a geometria final: 100% no fim da foto e 0% acima da âncora declarada |
| T07 | Renderizar identificação junto de legenda | Áreas respeitam convivência e perfil; não há deslocamento contínuo novo inventado pela integração |
| T08 | Usar duas instâncias do mesmo componente | IDs e vínculos são distintos; animação atua na instância correta |
| T09 | Alterar fonte ou caixa em uma composição animada | Máscaras acompanham medidas novas, sem cortar letras; tempos, curvas e movimento permanecem os existentes |
| T10 | Trocar recurso em célula de grade | Crop e crédito permanecem associados à célula correta |
| T11 | Aplicar grifo e recortar documento | Marca acompanha a coordenada do recurso, sem migrar para trecho errado |
| T12 | Atualizar dados numéricos e gráfico | Unidade, rótulos e fonte continuam associados; animação existente é preservada |
| T13 | Comparar preview e exportação | Mesmas fontes, medidas, linhas, caixas, recursos e alvos de animação |
| T14 | Abrir projeto anterior à migração | Versão e migração explícitas; sem troca silenciosa da composição arquivada |
| T15 | Gerar pacote 360 | Cada saída usa seu perfil e composição; vídeo horizontal não herda tratamentos exclusivos de thumbnail |
| T16 | Testar horizontal e vertical | Horizontal 1920×1080 com margens 60; vertical aplica seu perfil e área segura, sem simples escala do horizontal |

## Evidência mínima

Para cada caso: resultado passou/falhou/não aplicável, composição e variante usadas, versões, captura de referência e observação da limitação encontrada. Para movimento, comparar trecho anterior e posterior à integração; uma imagem estática não comprova preservação de animação

## Lacunas a fechar aqui antes do repasse

As fichas geradas contêm os campos observados e a divisão de responsabilidades. Ainda faltam correspondências completas entre variantes existentes e variantes do DS, além de medidas locais não cobertas pelas referências aprovadas. Não inventar esses valores nem apresentar o inventário como especificação final
