# Spec: Fila do SUS e contestação

Issue: Hacktona-AGES-2026/SUSight#18
Status: rascunho

## Contexto

Além de revisar propostas, o médico precisa ver a fila do SUS inteira, entender por que cada paciente está naquela posição e, quando discordar, pedir uma reavaliação. A contestação é do médico: ele aponta um paciente cuja posição parece errada e a IA reavalia.

## Comportamento esperado

### Fila do SUS

- O usuário vê a fila de cirurgias eletivas na ordem atual.
- Cada linha mostra: posição, nome do paciente, CNS mascarado, procedimento, prioridade (Baixa, Moderada, Alta), tempo de espera e data da última alteração de posição.
- O usuário pode buscar por nome ou CNS e filtrar por procedimento e prioridade. Filtrar não muda a posição exibida de cada paciente.
- O usuário abre um paciente e vê os critérios atuais, a justificativa da posição e o histórico de mudanças com nome, data e hora de quem aprovou cada uma.
- A fila mostra quando o paciente tem proposta pendente ou contestação em andamento.

### Contestação

- No detalhe do paciente, o usuário clica em "Contestar posição".
- O usuário escreve a justificativa (obrigatória) e pode indicar se acha que o paciente deveria subir ou descer.
- Ao confirmar, o sistema registra a contestação com nome, data e hora e envia para a IA reavaliar.
- A fila não muda com a contestação. Se a IA gerar uma nova proposta, ela entra nas revisões pendentes (spec 003) e segue o fluxo normal de decisão.
- Enquanto houver contestação em andamento, o paciente mostra o status "Em reavaliação" e não aceita outra contestação.
- O usuário vê o resultado da contestação no histórico do paciente: nova proposta gerada ou posição mantida, com a justificativa da IA.

## Critérios de aceite

- [ ] A fila aparece na ordem atual com todos os campos listados e CNS mascarado.
- [ ] Busca e filtros não alteram a posição exibida.
- [ ] O detalhe mostra critérios, justificativa e histórico de mudanças com nome, data e hora.
- [ ] Contestação não aceita justificativa vazia.
- [ ] Contestação registrada não muda a fila e marca o paciente como "Em reavaliação".
- [ ] Não é possível abrir uma segunda contestação para o mesmo paciente enquanto a primeira está em andamento.
- [ ] Fila vazia ou falha ao carregar mostram mensagem em português.

## Fora do escopo

- Reordenar a fila manualmente.
- Contestações enviadas pelo paciente.
- Export da fila (spec 006).
- O reprocessamento da IA (responsabilidade do backend).

## Questões em aberto

- A fila é uma só ou separada por procedimento, especialidade ou unidade?
- Tamanho da fila no dataset e necessidade de paginação.
- O médico pode contestar a posição de qualquer paciente ou só dos seus?
- A contestação pode ser cancelada pelo médico antes do resultado?
