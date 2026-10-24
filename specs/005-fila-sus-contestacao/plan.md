# Plano: Fila do SUS e contestação

Spec: ./spec.md
Status: em revisão

## Abordagem

`/fila` lista a fila com `getQueue()`, `/fila/[id]` mostra a ficha com `getQueueEntry(id)` e `/fila/contestar` envia `contest(patientId, { justification, direction })`. Busca, filtros e abas (Todos, Com proposta, Contestadas) rodam no cliente e não mudam a posição, que vem sempre de `entry.position`.

## Dados e interfaces

- `queue-table.tsx`: tabela semântica com posição, paciente (CNS mascarado), procedimento, prioridade, espera em dias, situação ("Em dia", "Proposta", "Em reavaliação") e ação "Contestar" (oculta quando já há contestação). Botão "Exportar CSV" leva à spec 006.
- `[id]/queue-entry.tsx`: resumo, justificativa e critérios, histórico de movimentação (`src/lib/history.ts`), ações (revisar proposta e pedir informações quando há proposta pendente, contestar, remover) e documentos da proposta.
- `contestar/contest-form.tsx`: paciente, motivo, direção opcional (subir ou descer) e justificativa obrigatória; 409 mostra a mensagem do contrato.
- Remover e restaurar da fila: ver spec 009.

## Decisões

| Decisão | Alternativas consideradas | Motivo |
|---|---|---|
| Contestar também pela ficha e pela tabela | Só pela ficha | Atalho; ambas levam ao mesmo formulário |
| Documentos da ficha vêm da proposta pendente | Endpoint de documentos do paciente | Contrato não tem; "Abrir" fica de fora (visualizar arquivo é fora do escopo da spec 003) |

## Riscos

- Fila grande: sem paginação, filtros no cliente.
- Idade do paciente aparece no Figma, mas não está no contrato; omitida.
