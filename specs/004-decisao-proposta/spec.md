# Spec: Aprovar, rejeitar com motivo ou pedir informações

Issue: Hacktona-AGES-2026/SUSight#17
Status: rascunho

## Contexto

O médico é quem decide se a proposta da IA vale. A decisão muda ou não a fila do SUS, precisa ser auditável (constituição, item 2) e, quando é rejeição, precisa voltar para a IA com um motivo que ela consiga usar.

## Comportamento esperado

Na tela de revisão da proposta (spec 003), o usuário tem três ações: "Rejeitar", "Pedir informações" e "Aprovar nova fila".

### Aprovar

- O usuário clica em "Aprovar nova fila", na revisão ou em "O que mudou", e vê a janela "Aprovar nova fila?" com o texto: "A fila do SUS será atualizada e <N> pacientes serão avisados da nova posição. A decisão fica registrada com seu nome, data e hora."
- Quando algum agente do tribunal fez ressalvas, a janela mostra o aviso "Antes de aprovar" com a ressalva (ex.: "O laudo da ressonância tem mais de 60 dias. Você pode pedir informações ao paciente em vez de aprovar agora.").
- Os botões são "Cancelar" e "Aprovar e atualizar fila".
- Ao confirmar, o sistema atualiza a fila do SUS, avisa os pacientes que mudaram de posição e registra a decisão com nome do médico, data e hora.
- A proposta sai das pendentes e o sistema mostra a notificação "Nova fila aprovada. A fila do SUS foi atualizada e os pacientes serão avisados."

### Rejeitar com motivo

- O usuário clica em "Rejeitar" e vê a janela "Rejeitar a proposta": "Diga por que a proposta não deve valer. A IA vai reavaliar a fila considerando o seu motivo."
- O usuário escolhe um motivo:
  - Dados insuficientes ou desatualizados;
  - Piora não comprovada por exame;
  - Contraria a regra de equidade;
  - Outro motivo.
- O campo "Detalhes para a IA" complementa o motivo.
- Escolher um motivo é obrigatório. Os detalhes são obrigatórios quando o motivo é "Outro motivo".
- Os botões são "Cancelar" e "Rejeitar e devolver à IA".
- O sistema não muda a fila, registra a decisão com motivo, detalhes, nome, data e hora e devolve a proposta para a IA reavaliar com esse motivo.
- A proposta sai das pendentes. Se a IA gerar uma nova proposta, ela entra como um novo item pendente.

### Pedir informações

- O usuário clica em "Pedir informações" e vê a tela "Pedir informações ao paciente", com nome, CNS mascarado e o texto "O paciente recebe o pedido no aplicativo."
- Em "O que você precisa", o sistema sugere itens a partir da proposta (ex.: "Laudo recente da ressonância do joelho", "Foto legível do raio-X de 20 out", "Atualizar dor e mobilidade") e oferece "Outro documento". O usuário marca um ou mais.
- Em "Mensagem para o paciente", o sistema sugere um texto em linguagem simples, que o usuário pode editar.
- Um aviso explica: "A proposta fica em espera. Nenhuma mudança entra na fila até o paciente responder e você decidir."
- É obrigatório marcar pelo menos um item e ter uma mensagem.
- Os botões são "Cancelar" e "Enviar pedido".
- O sistema não muda a fila, envia a mensagem para o paciente no app SUSight Paciente e registra o pedido com nome, data e hora.
- A proposta fica em espera e sai da lista de revisões pendentes.
- Quando o paciente responde, a proposta volta para a lista com a resposta anexada como evidência, marcada como relato do paciente ou como exame, conforme o caso.

### Regras gerais

- Cada ação pede confirmação antes de valer.
- Enquanto a decisão é enviada, os botões ficam desabilitados.
- Uma proposta só recebe uma decisão. Se outro médico decidir antes, o sistema avisa e não aplica a segunda.
- Toda decisão aparece em "Decisões registradas" (spec 009).

## Critérios de aceite

- [ ] Aprovar exige confirmação, atualiza a fila, tira a proposta das pendentes e mostra a notificação "Nova fila aprovada".
- [ ] A janela de aprovação mostra o aviso "Antes de aprovar" quando o tribunal fez ressalvas.
- [ ] Rejeitar não aceita confirmação sem motivo, nem "Outro motivo" sem detalhes, e não muda a fila.
- [ ] Pedir informações não aceita confirmação sem item marcado ou sem mensagem, não muda a fila e tira a proposta da lista principal.
- [ ] Resposta do paciente faz a proposta voltar à lista com a resposta anexada.
- [ ] Toda decisão aparece em "Decisões registradas" com tipo, texto, nome do médico, data e hora.
- [ ] Duplo clique não gera duas decisões.
- [ ] Decisão em proposta já decidida por outro médico mostra aviso e não é aplicada.
- [ ] Falha ao enviar mantém o que foi escolhido e digitado e permite tentar de novo.

## Fora do escopo

- Editar a posição proposta manualmente antes de aprovar.
- Desfazer uma decisão já aplicada.
- A notificação no app do paciente em si (responsabilidade do app SUSight Paciente e do backend).
- O reprocessamento da IA após a rejeição (responsabilidade do backend).

## Questões em aberto

- Onde o médico vê as propostas em espera e o que foi pedido? O Figma não mostra essa lista.
- Os itens sugeridos e a mensagem para o paciente são gerados pela IA ou por modelos fixos?
- "<N> pacientes serão avisados" conta todos os pacientes que mudam de posição com a aprovação?
- Prazo para resposta do paciente: depois de quanto tempo a proposta em espera expira ou volta ao médico?
- O médico pode cancelar um pedido de informações em aberto?
