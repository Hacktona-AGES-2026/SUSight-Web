# Plano: Widgets e avisos do Windows

Spec: ./spec.md
Status: rascunho

## Abordagem

Ainda não implementada, e não cabe no app web: widget e avisos no painel do Windows exigem um aplicativo instalado (questão em aberto da spec). O plano é decidir o alvo antes de qualquer código. O web só precisa expor o que o widget e os avisos consomem: a contagem de revisões pendentes (já vem de `listProposals()`) e os links que abrem o item certo (`/revisoes`, `/revisoes/[id]`).

## Dados e interfaces

- Contagem de pendentes: `GET /proposals` (campo `total`).
- Links profundos já existentes: `/revisoes` e `/revisoes/[id]`.
- Avisos (nova proposta, paciente respondeu, fila aprovada): precisam de um canal de eventos no backend (push ou polling); não existe no contrato.
- Sessão: sem sessão ativa o widget não mostra contagem nem nomes (spec 002).

## Decisões

| Decisão | Alternativas consideradas | Motivo |
|---|---|---|
| Não implementar no web | PWA com notificações | Widgets do Windows 11 não são fornecidos por PWA; avaliar com a equipe |
| Links profundos nas rotas atuais | Rotas dedicadas | Já abrem a lista e a revisão |

## Riscos

- Alvo técnico indefinido (app instalado, PWA ou fora do hackathon).
- Avisos podem expor dados pessoais: mostrar o mínimo e nunca o CNS completo.
