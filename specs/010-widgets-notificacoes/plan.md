# Plano: Widgets e notificações do SUSight Clínica (Windows 11)

Spec: ./spec.md
Status: em revisão

## Abordagem

O SUSight Clínica vira um PWA: ganha um manifest e um service worker. O Windows 11 aceita widgets de PWAs instalados pelo Edge. O widget é descrito no manifest com um modelo em Adaptive Cards e uma URL de dados. O service worker responde aos eventos de widget (`widgetinstall`, `widgetresume`, `widgetclick`) e busca os dados numa rota do próprio web, que usa a sessão do médico (spec 002). As notificações usam a API de notificações do navegador pelo service worker, disparadas no web logo depois de uma aprovação.

## Dados e interfaces

- **Manifest (`src/app/manifest.ts`):** nome, ícones PNG (192 e 512 px), `display: standalone`, `start_url: /revisoes` e o membro `widgets` com `name`, `tag: "clinica"`, `ms_ac_template`, `data`, `type: application/json`, `update` (intervalo em segundos) e `screenshots`.
- **Modelo do widget (`public/widgets/clinica-template.json`):** Adaptive Card com as três linhas e as ações `Action.Execute` (`documento`, `revisoes`, `fila`).
- **Dados do widget (`src/app/api/widgets/clinica/route.ts`):** lê a sessão e devolve `{ signedIn, pending: { total, oldestDays }, queue: { approvedAt, approvedBy } }`, ou `{ signedIn: false }` sem sessão. Usa a camada de dados (`listProposals`) e um novo `getQueueSummary`.
- **Contrato (`docs/api/openapi.yaml`):** `QueueList` ganha `lastApprovedAt` e `lastApprovedBy` (`Doctor`), para a linha "Fila atualizada".
- **Service worker (`public/sw.js`):** trata `widgetinstall`, `widgetresume` e `periodicsync`, que buscam os dados e chamam `self.widgets.updateByTag`; trata também `widgetclick`, que abre a tela da ação, e `notificationclick`, que abre `/fila`. Registrado por um componente cliente no layout interno.
- **Notificações (`src/lib/notifications.ts`):** `askPermission()`, com explicação antes do pedido do navegador, e `notifyQueueApproved()`. Chamadas pelo fluxo de aprovação da spec 004.

## Decisões

| Decisão | Alternativas consideradas | Motivo |
|---|---|---|
| PWA com widgets do Windows 11 | App desktop nativo; painel dentro do app | Decisão da equipe. Reaproveita o web e dá o widget real do Figma, sem outro app. |
| Dados do widget numa rota do web, com a sessão em cookie | Chamar o backend direto do service worker | O token continua só no servidor (spec 002), e o widget usa as mesmas regras de sessão. |
| Widget só com números, datas e nomes de médicos | Mostrar pacientes no widget | O painel fica visível na tela do computador (constituição, item 6). |
| Notificação local depois da aprovação | Push do backend | Não depende do backend. O push fica para uma spec própria. |
| Pedir permissão de notificação só na primeira aprovação, com explicação | Pedir ao abrir o sistema | Pedido no momento certo é mais aceito e não assusta (constituição, item 7). |
| Service worker escrito à mão, sem biblioteca de PWA | next-pwa, Serwist | Precisamos só dos eventos de widget e notificação, sem cache offline. É menos dependência para revisar. |

## Riscos

- **Widgets de PWA no Windows 11 dependem do Edge e de recursos novos do sistema.** Mitigação: a tarefa 1 é uma prova de conceito numa máquina Windows 11 real, antes do resto.
- **Ninguém da equipe usa Windows 11 com Edge.** Mitigação: confirmar antes de começar. Sem isso, não há como validar o critério principal.
- **Depende das specs 002 (sessão) e 004 (aprovação), ainda não implementadas.** Mitigação: as tarefas de dados e notificação só começam depois delas. A prova de conceito usa dados fixos.
- **O tipo de manifest do Next não conhece o membro `widgets`.** Mitigação: estender o tipo localmente, sem `any`.
