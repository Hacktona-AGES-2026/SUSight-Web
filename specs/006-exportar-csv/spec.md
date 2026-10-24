# Spec: Exportar fila ordenada em CSV

Issue: Hacktona-AGES-2026/SUSight#20
Status: rascunho

## Contexto

A entrega final do hackathon é um CSV com a fila de cirurgias eletivas ordenada corretamente. O médico também precisa desse arquivo para compartilhar a fila fora do sistema.

## Comportamento esperado

- Na tela da fila do SUS (spec 005), o usuário clica em "Exportar CSV".
- O sistema gera um arquivo com a fila na ordem atual, só com mudanças já aprovadas. Propostas pendentes e contestações em andamento não alteram a ordem exportada.
- O arquivo baixa com o nome `fila-sus-AAAA-MM-DD-HHmm.csv`.
- Por padrão, o export traz a fila completa, mesmo com filtros aplicados na tela. Se houver filtros, o sistema pergunta se o usuário quer exportar a fila completa ou só o recorte filtrado.
- O arquivo abre corretamente no Excel e no LibreOffice em português, com acentos preservados.
- O sistema registra o export com nome do médico, data e hora.

## Critérios de aceite

- [ ] O CSV tem uma linha de cabeçalho e uma linha por paciente, na mesma ordem da fila exibida.
- [ ] A ordem do CSV ignora propostas pendentes e contestações em andamento.
- [ ] O nome do arquivo segue `fila-sus-AAAA-MM-DD-HHmm.csv`.
- [ ] Acentos aparecem corretamente ao abrir no Excel e no LibreOffice.
- [ ] Campos com vírgula, aspas ou quebra de linha não quebram as colunas.
- [ ] Com filtros ativos, o usuário escolhe entre fila completa e recorte.
- [ ] Fila vazia gera um CSV só com o cabeçalho e um aviso na tela.
- [ ] O export fica registrado com nome, data e hora.

## Fora do escopo

- Outros formatos (Excel, PDF).
- Export agendado ou automático.
- Export das revisões pendentes ou do histórico de decisões.

## Questões em aberto

- Colunas exatas e formato exigidos pela organização do hackathon. Proposta inicial: posição, identificador do paciente, procedimento, prioridade, pontuação, tempo de espera em dias, data de entrada na fila e data da última alteração.
- O CSV leva o CNS completo, mascarado ou um identificador anônimo (LGPD)?
- Separador vírgula ou ponto e vírgula? Ponto e vírgula abre melhor no Excel em português.
- O CSV é gerado no web ou pelo backend? Se o arquivo oficial do hackathon sair do backend, o web só baixa.
