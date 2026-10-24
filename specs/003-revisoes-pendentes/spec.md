# Spec: Revisões pendentes e revisão da proposta

Issue: Hacktona-AGES-2026/SUSight#16
Status: rascunho

## Contexto

A IA analisa exames, laudos e atualizações dos pacientes e propõe mudanças de posição na fila. Nada muda sem um médico aprovar (constituição, item 1). O médico precisa de uma lista do que espera revisão e de uma tela que explique cada proposta de forma legível (item 5).

## Comportamento esperado

### Lista de revisões pendentes

- O usuário vê, logo após o login, a lista de propostas que aguardam revisão.
- Cada item mostra: nome do paciente, CNS mascarado, procedimento, prioridade atual (Baixa, Moderada, Alta), posição atual e posição proposta, motivo resumido da IA e há quanto tempo a proposta está aguardando.
- A lista vem ordenada da proposta mais antiga para a mais nova.
- O usuário vê o total de pendentes.
- O usuário pode buscar por nome ou CNS e filtrar por prioridade e procedimento.
- Propostas em "aguardando paciente" (ver spec 004) aparecem em uma aba separada, não na lista principal.

### Revisão da proposta

- O usuário abre uma proposta e vê:
  - dados do paciente (CNS mascarado), procedimento, prioridade validada pela regulação e tempo de espera;
  - posição atual, posição proposta e a diferença;
  - os critérios que a IA usou (limitação funcional, ASA, dor, questões socioeconômicas, comorbidades, tempo de espera, deterioração) com o valor de cada um e o que mudou desde a última avaliação;
  - os documentos que originaram a proposta (exame, laudo ou relato), indicando se cada um é exame ou relato do paciente;
  - o tribunal de IAs: o parecer de cada agente (Evidências, Contestação, Equidade e regras) em texto legível;
  - as regras de equidade verificadas: limite de elevação por reavaliação e não ultrapassar quem tem prioridade maior e mais espera;
  - o histórico de decisões anteriores deste paciente, com nome, data e hora.
- O usuário vê os botões de decisão da spec 004.
- O usuário pode voltar à lista sem perder busca e filtros.

## Critérios de aceite

- [ ] A lista mostra só propostas pendentes, da mais antiga para a mais nova, com o total.
- [ ] Nenhuma tela mostra o CNS completo.
- [ ] Busca por nome ou CNS e filtros por prioridade e procedimento funcionam juntos.
- [ ] Lista vazia mostra "Nenhuma revisão pendente." em vez de uma tabela vazia.
- [ ] A revisão mostra critérios, documentos, os três pareceres do tribunal, regras de equidade e histórico.
- [ ] Relatos do paciente são identificados como relato, separados dos exames.
- [ ] Falha ao carregar mostra mensagem em português e opção de tentar de novo.
- [ ] Proposta que outro médico já decidiu mostra "Esta proposta já foi decidida por <nome> em <data e hora>." e não aceita nova decisão.

## Fora do escopo

- Tomar a decisão (spec 004).
- Ver a fila completa (spec 005).
- Editar critérios ou pesos.
- Visualizar o arquivo do exame além de nome, tipo e data (pode virar issue própria).

## Questões em aberto

- Modelo do tribunal ainda em aberto no projeto: três agentes ou um advogado por paciente. Esta spec assume três agentes.
- Médico vê propostas de todos os pacientes ou só das suas especialidades e unidades?
- Paginação: qual volume de pendentes esperamos?
- Os documentos precisam abrir dentro do Pulse Clinical?
