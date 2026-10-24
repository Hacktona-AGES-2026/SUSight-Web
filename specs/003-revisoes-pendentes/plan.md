# Plano: Revisões pendentes e revisão da proposta

Spec: ./spec.md
Status: em revisão

## Abordagem

Duas rotas sob `(app)`: `/revisoes` (lista) e `/revisoes/[id]` (revisão), mais `/revisoes/[id]/mudancas` ("O que mudou", critérios com valor anterior e atual). A lista usa `listProposals(status)` e busca o detalhe de cada item para mostrar o chip "Com ressalvas" ou "Compatível". Busca e filtros rodam no cliente. A revisão usa `getProposal(id)` e mostra indicadores, justificativa, tribunal, regras de equidade, evidências citadas e histórico.

## Dados e interfaces

- `src/app/(app)/revisoes/pending-reviews.tsx`: abas "Pendentes" e "Aguardando paciente", busca por nome ou CNS, filtros de prioridade e procedimento, tempo de espera da proposta (`relativeDays`), estados vazio, carregando e erro com "Tentar de novo".
- `src/app/(app)/revisoes/[id]/proposal-review.tsx`: indicadores (prioridade, posição, tempo de espera), "Por que a IA propõe esta mudança", pareceres do tribunal, regras de equidade, evidências E1..En, decisões anteriores e aviso "já decidida por <nome> em <data e hora>".
- `src/lib/review.ts`: veredito derivado do parecer (o contrato não tem veredito por agente).
- `src/lib/format.ts`: `maskCns` mostra só os 4 últimos dígitos; o CNS completo nunca chega à tela.
- Mensagem de sucesso depois de decidir via `?aviso=` (`FlashNotice`).

## Decisões

| Decisão | Alternativas consideradas | Motivo |
|---|---|---|
| Chip e vereditos derivados no cliente | Campos novos no contrato | Evita mudar o contrato agora; limitação anotada em `ponytail:` |
| Detalhe de cada proposta na lista (N+1) | Campo `verdict` no resumo | Simples para o volume da demo; trocar se a lista crescer |
| Terceiro indicador "Tempo de espera" | "Confiança dos dados" do Figma | O contrato não tem esse dado e a spec pede o tempo de espera |
| Prioridade atual, sem "Moderada → Alta" | Mostrar prioridade proposta | O contrato só traz a prioridade validada pela regulação |

## Riscos

- Lista grande: N+1 e filtros no cliente não escalam; exige paginação (questão em aberto da spec).
- Vereditos derivados podem divergir do que o backend considerar; revisar quando o tribunal final estiver decidido.
