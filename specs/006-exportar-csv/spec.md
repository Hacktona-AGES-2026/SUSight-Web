# Spec: Exportar fila ordenada em CSV

Issue: Hacktona-AGES-2026/SUSight#20
Status: rascunho

## Contexto

A entrega final do hackathon é um CSV com a fila de cirurgias eletivas ordenada corretamente. O médico também precisa desse arquivo para compartilhar a fila fora do sistema.

## Comportamento esperado

- No menu, o usuário abre "Exportar fila" e vê a tela "Exportar fila atualizada": "Gere o arquivo com a lista ordenada vigente, pronta para entrega."
- Um cartão mostra o arquivo que será gerado: nome, número de pacientes e a versão da fila (ex.: "fila_sus_2026-10-24.csv · CSV · 1.284 pacientes · versão aprovada em 24 out às 09:42").
- Em "Formato", a opção "CSV (recomendado)" vem marcada.
- "Prévia das primeiras linhas" mostra o cabeçalho e as primeiras linhas do arquivo.
- Um aviso explica: "Só a fila aprovada. O arquivo traz a última fila aprovada por um profissional. Propostas pendentes não entram."
- Os botões são "Cancelar" e "Baixar CSV".
- O arquivo traz sempre a fila completa, na ordem atual, só com mudanças já aprovadas. Propostas pendentes e contestações em andamento não alteram a ordem exportada.
- O arquivo baixa com o nome `fila_sus_AAAA-MM-DD.csv`.
- As colunas são, nesta ordem: `posicao`, `cns`, `procedimento`, `prioridade`, `espera_dias` e `pontuacao`. O `cns` vai mascarado, só com os 4 últimos dígitos. A `pontuacao` usa ponto decimal (ex.: `0.94`).
- O separador é vírgula.
- O arquivo abre corretamente no Excel e no LibreOffice em português, com acentos preservados.
- O sistema registra o export com nome do médico, data e hora.

## Critérios de aceite

- [ ] O CSV tem uma linha de cabeçalho com as colunas na ordem definida e uma linha por paciente, na mesma ordem da fila.
- [ ] A ordem do CSV ignora propostas pendentes e contestações em andamento.
- [ ] A prévia mostra as mesmas primeiras linhas do arquivo baixado.
- [ ] O nome do arquivo segue `fila_sus_AAAA-MM-DD.csv`.
- [ ] Nenhuma linha traz o CNS completo.
- [ ] Acentos aparecem corretamente ao abrir no Excel e no LibreOffice.
- [ ] Campos com vírgula, aspas ou quebra de linha não quebram as colunas.
- [ ] Fila vazia gera um CSV só com o cabeçalho e um aviso na tela.
- [ ] O export fica registrado com nome, data e hora.

## Fora do escopo

- Excel e outros formatos além de CSV.
- Export agendado ou automático.
- Export das revisões pendentes ou do histórico de decisões.

## Questões em aberto

- O Figma mostra a opção "PDF para impressão". Ela entra nesta spec, vira outra ou sai do design?
- O formato do CSV atende à entrega oficial do hackathon? Confirmar colunas, separador e se o CNS mascarado é aceito.
- De onde vem a `pontuacao`? Ela ainda não existe no contrato da API.
- O CNS mascarado usa "••••" (caractere especial) ou "****"? O caractere especial pode atrapalhar quem processa o arquivo.
- O CSV é gerado no web ou pelo backend? Se o arquivo oficial do hackathon sair do backend, o web só baixa.
