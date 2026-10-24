# Spec: Fila do SUS e contestação

Issue: Hacktona-AGES-2026/SUSight#18
Status: rascunho

## Contexto

Além de revisar propostas, o médico precisa ver a fila do SUS inteira e, quando discordar da ordem, pedir uma reavaliação. A contestação é do médico: ele aponta um paciente cuja posição parece injusta e a IA reavalia.

## Comportamento esperado

### Fila do SUS

- O usuário vê a tela "Fila do SUS" com o texto "Ordem vigente da fila de cirurgias eletivas, atualizada em <data> às <hora>.", que indica a última aprovação.
- Abas filtram a fila: "Todos", "Com proposta" e "Contestadas". Filtrar não muda a posição exibida de cada paciente.
- Cada linha mostra:
  - posição (ex.: "31ª");
  - nome do paciente e CNS mascarado (ex.: "CNS •••• 4821");
  - procedimento;
  - prioridade em um selo (Baixa, Moderada, Alta);
  - tempo de espera em dias;
  - situação: "Em dia" (sem pendências), "Proposta" (proposta pendente, com a linha destacada) ou "Em revisão" (contestação em andamento);
  - a ação "Contestar".

### Contestação

- O usuário clica em "Contestar" em uma linha e vê a tela "Contestar a fila atual": "Registre por que a ordem atual parece injusta. A IA reavalia a fila com o seu motivo."
- O campo "Paciente ou posição" vem preenchido com o paciente da linha (ex.: "Rita de Cássia Lima · 33ª"). O usuário pode trocar, buscando por nome ou posição.
- O usuário escolhe um motivo:
  - Paciente com piora clínica não refletida;
  - Prioridade desatualizada;
  - Espera acumulada maior que a de quem está à frente;
  - Outro motivo.
- Em "Descreva o que está injusto", o usuário escreve a justificativa (obrigatória).
- Os botões são "Cancelar" e "Enviar contestação à IA".
- Ao confirmar, o sistema registra a contestação com nome, data e hora e envia para a IA reavaliar.
- A fila não muda com a contestação. Se a IA gerar uma nova proposta, ela entra nas revisões pendentes (spec 003) e segue o fluxo normal de decisão.
- Enquanto houver contestação em andamento, o paciente mostra a situação "Em revisão" e não aceita outra contestação.
- A contestação e o seu resultado (nova proposta gerada ou posição mantida, com a justificativa da IA) aparecem em "Decisões registradas" (spec 009).

## Critérios de aceite

- [ ] A fila aparece na ordem atual, com todos os campos listados, CNS mascarado e a data da última atualização.
- [ ] As abas "Todos", "Com proposta" e "Contestadas" filtram sem alterar a posição exibida.
- [ ] A situação de cada paciente reflete proposta pendente ou contestação em andamento.
- [ ] "Contestar" abre a contestação com o paciente da linha já preenchido.
- [ ] Contestação não aceita confirmação sem motivo ou sem justificativa.
- [ ] Contestação registrada não muda a fila e marca o paciente como "Em revisão".
- [ ] Não é possível abrir uma segunda contestação para o mesmo paciente enquanto a primeira está em andamento.
- [ ] Fila vazia ou falha ao carregar mostram mensagem em português.

## Fora do escopo

- Reordenar a fila manualmente.
- Contestações enviadas pelo paciente.
- Export da fila (spec 006).
- O reprocessamento da IA (responsabilidade do backend).

## Questões em aberto

- A versão anterior desta spec tinha um detalhe do paciente (critérios atuais, justificativa da posição e histórico de mudanças), a busca por nome ou CNS e a indicação de subir ou descer na contestação. Nada disso aparece no Figma. Entram depois ou saem? A constituição (item 5) pede justificativa legível para cada posição.
- A aba "Contestadas" e a situação "Em revisão" falam da mesma coisa? Vale usar um nome só.
- A fila é uma só ou separada por procedimento, especialidade ou unidade?
- Tamanho da fila no dataset e necessidade de paginação.
- O médico pode contestar a posição de qualquer paciente ou só dos seus?
- A contestação pode ser cancelada pelo médico antes do resultado?
