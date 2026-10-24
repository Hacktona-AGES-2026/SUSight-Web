# Spec: Decisões registradas

Issue: a criar
Status: rascunho

## Contexto

Toda decisão precisa ser auditável, com nome, data e hora de quem decidiu (constituição, item 2). Médicos e regulação precisam de um lugar para ver o que foi decidido na fila, por quem, quando e por quê.

## Comportamento esperado

- No menu, o usuário abre "Decisões registradas" e vê o texto "Histórico auditável: quem decidiu, quando e por quê."
- A lista vem da decisão mais recente para a mais antiga.
- Cada item mostra:
  - o tipo e o paciente, com a mudança de posição quando houver (ex.: "Fila aprovada · Marina Albuquerque (42ª → 31ª)");
  - um resumo de quem decidiu ou do que foi feito (ex.: "Dra. Helena Duarte aprovou a proposta da IA.", "Motivo: dados insuficientes. Devolvida à IA para reavaliação.");
  - a data e a hora (ex.: "24 out · 09:42");
  - um marcador colorido pelo tipo.
- Os tipos são:
  - "Fila aprovada" (spec 004);
  - "Proposta rejeitada", com o motivo (spec 004);
  - "Informações solicitadas", com o que foi pedido (spec 004);
  - "Contestação registrada" e o seu resultado (spec 005).
- A lista mostra as decisões de todos os médicos, não só as do usuário logado.
- A lista é só de leitura.

## Critérios de aceite

- [ ] A lista vem da decisão mais recente para a mais antiga.
- [ ] Cada item mostra tipo, paciente, médico, data e hora.
- [ ] Rejeições mostram o motivo, e pedidos de informação mostram o que foi pedido.
- [ ] Decisões de outros médicos aparecem com o nome de quem decidiu.
- [ ] Nenhum item mostra o CNS completo.
- [ ] Não é possível editar nem apagar uma decisão.
- [ ] Lista vazia mostra "Nenhuma decisão registrada ainda."
- [ ] Falha ao carregar mostra mensagem em português e opção de tentar de novo.

## Fora do escopo

- Desfazer decisões.
- Exportar o histórico.
- Registros que não são decisões, como login e export da fila.

## Questões em aberto

- O contrato da API não tem uma rota que liste as decisões. Ela precisa ser criada.
- A lista precisa de filtros por tipo, médico, paciente ou período?
- Clicar em um item abre a proposta ou o paciente?
- A lista mostra as decisões de todas as unidades ou só da unidade de regulação do médico?
- Paginação: quantas decisões esperamos?
