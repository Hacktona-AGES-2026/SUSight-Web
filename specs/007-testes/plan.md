# Plano: Testes do SUSight Clínica

Spec: ./spec.md
Status: em revisão

## Abordagem

Duas camadas. Testes de unidade e de tela com Vitest e Testing Library, usando a fonte mock (`pnpm test`, sem backend). Testes de ponta a ponta no navegador para os cinco fluxos da spec, rodando contra `pnpm dev` ou `pnpm build && pnpm start` em modo mock. Cada critério de aceite das specs 002 a 006 aponta para o teste que o cobre numa tabela no README.

## Dados e interfaces

- Já existem: `src/lib/csv.test.ts`, `src/lib/format.test.ts`, `src/lib/data/mock/mock.test.ts`, `src/app/page.test.tsx` e `src/app/(app)/revisoes/screens.test.tsx` (lista de revisões e aprovar).
- A fonte de dados exportada pelas telas mantém a sessão no `sessionStorage` e aceita qualquer login; os testes de unidade criam instâncias novas com a regra estrita (`createDataSource("mock")`).
- Ponta a ponta: ferramenta a escolher (Playwright é o candidato; hoje não há dependência instalada).
- Tabela critério ↔ teste em `docs/` ou no README.

## Decisões

| Decisão | Alternativas consideradas | Motivo |
|---|---|---|
| Vitest para unidade e tela | Jest | Já configurado na spec 001 |
| Testes de tela com `fireEvent` | `user-event` | Sem dependência nova; cobre os cliques dos fluxos |
| Ponta a ponta contra o mock | Contra a API real | Backend ainda não está pronto (fora do escopo da spec) |

## Riscos

- Sem pipeline de CI, os testes só rodam se alguém os executar.
- O mock mantém estado em memória: cada teste de ponta a ponta precisa recarregar a página para partir dos dados originais.
