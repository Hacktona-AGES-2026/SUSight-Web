# Spec: Revisões pendentes e revisão da proposta

Issue: Hacktona-AGES-2026/SUSight#16
Status: rascunho

## Contexto

A IA analisa exames, laudos e atualizações dos pacientes e propõe mudanças de posição na fila. Nada muda sem um médico aprovar (constituição, item 1). O médico precisa de uma lista do que espera revisão e de uma tela que explique cada proposta de forma legível (item 5).

## Comportamento esperado

### Lista de revisões pendentes

- O usuário vê, logo após o login, a tela "Revisões pendentes" com o texto "<N> propostas da IA aguardam sua decisão. Nada muda na fila até você aprovar."
- Cada proposta aparece em um cartão com:
  - nome do paciente;
  - CNS mascarado, só com os 4 últimos dígitos (ex.: "CNS •••• 4821"), e procedimento;
  - prioridade atual e proposta, e posição atual e proposta (ex.: "Moderada → Alta · 42ª → 31ª");
  - um selo com o resultado do tribunal de IAs: "Compatível" ou "Com ressalvas";
  - o botão "Revisar".
- A lista vem ordenada da proposta mais antiga para a mais nova.
- Abaixo da lista, um aviso fixo: "A IA só propõe. Cada decisão exige a aprovação de um profissional e fica registrada com data e hora."
- Propostas em espera por um pedido de informações (spec 004) não aparecem nesta lista.

### Revisão da proposta

- O usuário clica em "Revisar" e vê a tela "Revisão da proposta", com nome, CNS mascarado e procedimento no cabeçalho.
- Três indicadores resumem a proposta:
  - **Prioridade:** atual e proposta, e quando a regulação validou (ex.: "Moderada → Alta · Validada pela regulação em 12 set");
  - **Posição na fila:** atual e proposta, com a elevação e se ela respeita o limite de equidade (ex.: "42ª → 31ª · Elevação de 11 posições, dentro do limite");
  - **Confiança dos dados:** o nível (ex.: "Parcial") e o motivo (ex.: "Falta laudo recente da ressonância").
- "Por que a IA propõe esta mudança": a justificativa em linguagem simples.
- "Tribunal de IAs": um cartão para cada agente (Agente de evidências, Agente de contestação e Agente de equidade e regras), com o parecer em texto e um selo de veredito (ex.: "Favorável", "Com ressalvas", "Compatível").
- "Evidências citadas": lista numerada (E1, E2, E3...) com cada documento usado, de onde veio, a data e se ainda está em análise. Relatos do paciente aparecem identificados como relato, separados dos exames.
- O usuário vê os botões de decisão da spec 004: "Rejeitar", "Pedir informações" e "Aprovar nova fila".

### O que mudou

- Da revisão, o usuário abre a tela "O que mudou": "Compare os dados de antes com os dados considerados agora, com a fonte de cada um."
- Cada linha mostra um critério, a fonte e a data (ex.: "Dor relatada · Paciente · 8 set"), o valor anterior e o valor atual (ex.: "5 em 10" e "8 em 10").
- Aparecem só os critérios que mudaram, entre os que a IA usa: prioridade, dor, mobilidade e limitação funcional, exames recentes, ASA, comorbidades, questões socioeconômicas, tempo de espera e deterioração.
- A tela tem os botões "Voltar à proposta" e "Aprovar nova fila".

## Critérios de aceite

- [ ] A lista mostra só propostas pendentes, da mais antiga para a mais nova, com o total no texto do topo.
- [ ] Cada cartão mostra prioridade e posição, atual e proposta, e o selo do tribunal.
- [ ] Nenhuma tela mostra o CNS completo.
- [ ] Lista vazia mostra "Nenhuma revisão pendente." em vez de uma lista vazia.
- [ ] A revisão mostra os três indicadores, a justificativa, os três pareceres do tribunal com veredito e as evidências citadas.
- [ ] Relatos do paciente são identificados como relato, separados dos exames.
- [ ] "O que mudou" mostra, para cada critério alterado, o valor anterior, o atual e a fonte.
- [ ] Falha ao carregar mostra mensagem em português e opção de tentar de novo.
- [ ] Proposta que outro médico já decidiu mostra "Esta proposta já foi decidida por <nome> em <data e hora>." e não aceita nova decisão.

## Fora do escopo

- Tomar a decisão (spec 004).
- Ver a fila completa (spec 005).
- Editar critérios ou pesos.
- Visualizar o arquivo do exame além de nome, tipo e data (pode virar issue própria).

## Questões em aberto

- Como o usuário chega em "O que mudou"? A tela de revisão no Figma não mostra o link.
- Quais são os níveis de "Confiança dos dados" (ex.: Completa, Parcial, Baixa) e o que define cada um?
- Quais vereditos cada agente pode dar, e como eles viram o selo da lista ("Compatível" ou "Com ressalvas")?
- Busca e filtros na lista, e o histórico de decisões do paciente na revisão, estavam na versão anterior desta spec e não aparecem no Figma. Entram depois ou saem?
- O médico vê propostas de todos os pacientes ou só da sua especialidade e unidade de regulação?
- Paginação: qual volume de pendentes esperamos?
- Os documentos precisam abrir dentro do SUSight Clínica?
