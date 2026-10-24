# Plano: Aprovar, rejeitar com motivo ou pedir informações

Spec: ./spec.md
Status: em revisão

## Abordagem

As três ações usam `decide(proposalId, { type, text })` pelo hook `useDecide`, que impede envio duplo, trata 401 (volta ao login) e 409 (mostra "Esta proposta já foi decidida por <nome> em <data e hora>."). Aprovar e rejeitar abrem diálogos (Radix Dialog) na tela de revisão; pedir informações é uma tela própria. Ao concluir, volta para `/revisoes?aviso=...`.

## Dados e interfaces

- `src/app/(app)/revisoes/[id]/use-decide.ts`: envia uma vez, mantém o texto digitado em caso de falha.
- `decision-dialogs.tsx`: `ApproveDialog` (resumo `42ª → 31ª`, aviso "Antes de aprovar" com o parecer da contestação) e `RejectDialog` (motivos predefinidos mais detalhes; "Outro motivo" exige texto).
- `pedir-informacoes/request-info.tsx`: lista de documentos pedidos, mensagem sugerida editável, aviso "A proposta fica em espera".
- A proposta pausada aparece na aba "Aguardando paciente" (spec 003).

## Decisões

| Decisão | Alternativas consideradas | Motivo |
|---|---|---|
| Itens do pedido só pedem exames e laudos | Incluir "Atualizar dor e mobilidade" do Figma | O paciente não relata sintomas (constituição) |
| Motivo da rejeição = opção + detalhes em um só texto | Campo `reason` separado no contrato | O contrato já aceita `text`; ajuda a IA sem mudar a API |

## Riscos

- Resposta do paciente (volta à lista principal com a resposta) depende do backend e do app Pulse; sem teste ponta a ponta ainda.
- Sem tamanho mínimo para o motivo (questão em aberto).
