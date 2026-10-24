# Plano: Widgets e avisos do médico (Windows 11)

Spec: ./spec.md
Status: em revisão

## Abordagem

O SUSight Clínica vira um PWA, com manifest e service worker. O Windows 11 aceita widgets de PWAs instalados pelo Edge: cada widget é descrito no manifest com um modelo em Adaptive Cards e uma URL de dados. O service worker trata os eventos de widget (`widgetinstall`, `widgetresume`, `widgetclick`) e a atualização periódica, e busca os dados numa rota do próprio web que usa a sessão do médico (spec 002).

Os avisos com o sistema fechado usam Web Push. O navegador assina o push com uma chave VAPID e o web guarda a assinatura. Quem dispara o aviso depende de onde o evento acontece:

- **Modo API:** o backend sabe quando há nova proposta ou resposta do paciente. Ele envia o push para as assinaturas registradas no contrato.
- **Modo mock:** o servidor do web envia o push com a biblioteca `web-push`, a partir das ações do mock (aprovação) e de uma rota de demonstração (nova proposta, resposta do paciente).

O service worker mostra o aviso com os botões e abre a tela certa no clique.

Toda regra (textos, números, links e o que pode aparecer) fica em TypeScript puro e é testada com Vitest. O service worker e os modelos de widget só usam o que vem pronto.

## Dados e interfaces

- **Manifest (`src/app/manifest.ts`):** nome, ícones PNG (192 e 512 px), `display: standalone`, `start_url: /revisoes` e `widgets` com dois itens:
  - `aprovacoes`: modelo `public/widgets/aprovacoes.json`, dados em `/api/widgets/aprovacoes`;
  - `enviar-documento`: modelo `public/widgets/enviar-documento.json`, dados estáticos.
- **Regras (`src/lib/widgets/`):**
  - `approvalsWidgetData(session, pendingTotal)`: devolve o número, o texto e a URL do botão, com o estado "sem sessão";
  - `notificationFor(event)`: transforma `new_proposal`, `queue_updated` ou `patient_replied` em título, texto, botões e URL, sem CNS nem dado clínico.
- **Rotas:**
  - `GET /api/widgets/aprovacoes`: dados do widget com a sessão do cookie;
  - `POST /api/push/subscription`: guarda a assinatura de push do médico logado (no modo mock, em memória; no modo API, repassa para o backend);
  - `POST /api/push/demo`: só no modo mock, dispara um aviso de demonstração.
- **Service worker (`public/sw.js`):** widgets (`widgetinstall`, `widgetresume`, `widgetclick`, `periodicsync`), `push`, que mostra o aviso com `actions`, e `notificationclick`, que abre a URL.
- **Contrato (`docs/api/openapi.yaml`):** `POST /me/web-push-subscription`, para o backend guardar a assinatura, e o formato do evento de push `{ type, proposalId, patientName, detail, notifiedCount }`.
- **Variáveis de ambiente:** `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` e `VAPID_SUBJECT` no `.env.example`.

## Decisões

| Decisão | Alternativas consideradas | Motivo |
|---|---|---|
| PWA com widgets do Windows 11 | App desktop nativo; painel dentro do app | É o widget real do Figma sem criar outro app. |
| Web Push com VAPID | Avisos só com o app aberto | A spec pede avisos com o sistema fechado. |
| Backend envia o push no modo API; web envia no modo mock | Sempre o web | O backend é quem sabe dos eventos. O mock permite demonstrar sem backend. |
| Regras e textos em TypeScript; service worker só exibe | Lógica no service worker | Fica testado com Vitest e reaproveita a camada de dados. |
| Modelos em Adaptive Cards com `Action.Execute` para "Revisar" | Links diretos | É o formato que o painel do Windows aceita. O clique passa pelo service worker, que abre a URL. |
| Textos de acessibilidade nos modelos (`altText`, rótulos dos botões) | Só o visual | O Narrador do Windows lê os widgets e os avisos. |

## Riscos

- **Widgets de PWA dependem do Edge e de recurso novo do Windows 11.** Mitigação: a primeira tarefa é uma prova de conceito num Windows 11 real.
- **Depende das specs 002 (sessão), 003 (revisões) e 004 (aprovação), ainda não implementadas.** Mitigação: a rota de dados usa a camada de dados existente com a fonte mock e só passa a usar a sessão quando a spec 002 existir.
- **Ninguém confirmou ter Windows 11 com Edge.** Mitigação: confirmar antes da validação final.
- **Nome do paciente nos avisos (LGPD)** está em aberto. Mitigação: o texto fica num lugar só (`notificationFor`) e é fácil trocar por iniciais.
