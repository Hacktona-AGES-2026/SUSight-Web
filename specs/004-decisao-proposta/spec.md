# Spec: Aprovar, rejeitar com motivo ou pedir informações

Issue: Hacktona-AGES-2026/SUSight#17
Status: rascunho

## Contexto

O médico é quem decide se a proposta da IA vale. A decisão muda ou não a fila do SUS, precisa ser auditável (constituição, item 2) e, quando é rejeição, precisa voltar para a IA com um motivo que ela consiga usar.

## Comportamento esperado

Na tela de revisão da proposta (spec 003), o usuário tem três ações.

### Aprovar

- O usuário clica em "Aprovar" e confirma em uma janela que resume a mudança (posição atual para posição proposta).
- O sistema atualiza a fila do SUS, avisa o paciente e registra a decisão com nome do médico, data e hora.
- A proposta sai das pendentes e o usuário volta para a lista com a mensagem "Proposta aprovada. Fila atualizada."

### Rejeitar com motivo

- O usuário clica em "Rejeitar", escreve o motivo e confirma.
- O motivo é obrigatório.
- O sistema não muda a fila, registra a decisão com o motivo, nome, data e hora e devolve a proposta para a IA reavaliar com esse motivo.
- A proposta sai das pendentes. Se a IA gerar uma nova proposta, ela entra como um novo item pendente.

### Pedir informações

- O usuário clica em "Pedir informações", escreve o que precisa do paciente e confirma.
- A mensagem é obrigatória e vai para o paciente no app Pulse.
- O sistema não muda a fila e registra o pedido com nome, data e hora.
- A proposta fica pausada: sai da lista principal e vai para a aba "Aguardando paciente", que mostra o que foi pedido e há quanto tempo.
- Quando o paciente responde, a proposta volta para a lista principal com a resposta anexada e marcada como relato do paciente.

### Regras gerais

- Cada ação pede confirmação antes de valer.
- Enquanto a decisão é enviada, os botões ficam desabilitados.
- Uma proposta só recebe uma decisão. Se outro médico decidir antes, o sistema avisa e não aplica a segunda.

## Critérios de aceite

- [ ] Aprovar exige confirmação, atualiza a fila e tira a proposta das pendentes.
- [ ] Rejeitar não aceita motivo vazio e não muda a fila.
- [ ] Pedir informações não aceita mensagem vazia, não muda a fila e move a proposta para "Aguardando paciente".
- [ ] Resposta do paciente faz a proposta voltar à lista principal com a resposta anexada.
- [ ] Toda decisão aparece no histórico do paciente com tipo, texto, nome do médico, data e hora.
- [ ] Duplo clique não gera duas decisões.
- [ ] Decisão em proposta já decidida por outro médico mostra aviso e não é aplicada.
- [ ] Falha ao enviar mantém o texto digitado e permite tentar de novo.

## Testes (TDD)

Os testes vêm antes do código. Cada critério de aceite acima vira pelo menos um teste automatizado que falha primeiro (red), e a implementação só termina quando todos passam (green). Critério que não puder ser testado automaticamente leva uma justificativa escrita. Testes de unidade e de ponta a ponta no navegador (spec 007).

## Fora do escopo

- Editar a posição proposta manualmente antes de aprovar.
- Desfazer uma decisão já aplicada.
- A notificação no app do paciente em si (responsabilidade do app Pulse e do backend).
- O reprocessamento da IA após a rejeição (responsabilidade do backend).

## Questões em aberto

- Existe tamanho mínimo para o motivo da rejeição?
- Motivos de rejeição pré-definidos além do texto livre ajudam a IA?
- Prazo para resposta do paciente: depois de quanto tempo a proposta pausada expira ou volta ao médico?
- O médico pode cancelar um pedido de informações em aberto?
