# Plano: Ficha na fila, envio de documento, decisões registradas e barra do topo

Spec: ./spec.md
Status: rascunho

## Abordagem

Quatro telas sob o grupo `(app)`, só no front por enquanto: `/fila/[id]` (já existe, ganha remover e restaurar), `/enviar-documento`, `/decisoes` e a barra do topo no `AppShell`.

## Dados e interfaces

- Remover e restaurar: estado local da tela (`Removal` em `queue-entry.tsx`) com `RemoveDialog`. Não existe endpoint no contrato; ao criar, mudar `docs/api/openapi.yaml` primeiro e regenerar os tipos.
- Enviar documento: `send-document.tsx` valida extensão e tamanho no cliente e mostra a confirmação, sem enviar o arquivo. Falta endpoint para receber o upload.
- Decisões registradas: `decisions.tsx` junta o histórico das propostas (todos os status) e das fichas com contestação em andamento, ordena por data e usa `eventTitle` e `eventDetail` de `src/lib/history.ts`. Falta `GET /decisions`.
- Barra do topo: cabeçalho do `AppShell` com logo, nome, lema, médico (iniciais), CRM e "Sair".

## Decisões

| Decisão | Alternativas consideradas | Motivo |
|---|---|---|
| Implementar só o front agora | Esperar contrato | As telas já estavam no Figma e o front precisa ser demonstrável |
| Lista de decisões montada no cliente | Endpoint dedicado | Contrato ainda sem o endpoint; marcado com `ponytail:` |
| Remover vale só na tela | Alterar a fila do mock | Evita um comportamento que o backend pode não ter |

## Riscos

- Remover, restaurar e enviar documento parecem funcionar, mas não persistem: não podem ser apresentados como reais.
- Lista de decisões faz várias chamadas por proposta (N+1).
