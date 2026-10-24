# Plano: Setup de ambiente, tecnologias e organização do repositório

Spec: ./spec.md
Status: em revisão

## Abordagem

Projeto Next.js (App Router) com TypeScript, Tailwind CSS e shadcn/ui, usando pnpm e Node 22. As telas leem dados por uma interface única (`DataSource`) com duas implementações: mock e API. A variável `NEXT_PUBLIC_DATA_SOURCE` escolhe a fonte. O contrato da API fica em OpenAPI e gera os tipos usados pelo mock e pela fonte da API, então os dois seguem o mesmo formato.

## Dados e interfaces

- Contrato: `docs/api/openapi.yaml` (auth, propostas, decisões, fila, contestação, export).
- Tipos gerados: `src/lib/api/schema.ts` (`pnpm api:types`), com aliases em `src/lib/api/types.ts`.
- Camada de dados: `src/lib/data/` com `source.ts` (interface), `mock/` (fixtures em pt-BR, CNS mascarado), `api/` (fetch em `NEXT_PUBLIC_API_URL`) e `index.ts` (seletor).
- Tela: página inicial em `src/app/page.tsx` com "SUSight Clínica", baseada no frame "Splash · SUSight Clínica" do Figma (nó 44:835, página "Telas · Estilo Apple").
- Estilo: tokens do Figma como variáveis CSS em `src/app/globals.css`, mapeados para nomes semânticos do shadcn/ui (`--primary`, `--muted`, `--border` etc.). Os nomes das variáveis no Figma (`azul/*`, `verde/*`, `amarelo/*`) não batem com as cores atuais (tons de rosa), então não são copiados.
- Fonte: Inter via `next/font/google`, com os tamanhos e pesos dos estilos de texto `Pulse/*` do Figma.

## Decisões

| Decisão | Alternativas consideradas | Motivo |
|---|---|---|
| Tailwind + shadcn/ui | Só Tailwind, CSS Modules | Rápido para o hackathon e fácil de alinhar aos tokens do Figma |
| OpenAPI + tipos gerados | Tipos TS compartilhados + Markdown | O backend pode usar o mesmo arquivo; tipos sempre batem com o contrato |
| Node 22 LTS + pnpm | npm | Instalação mais rápida e versão fixada em `packageManager` |
| Vitest + Testing Library | Jest | Configuração mais simples com TS e ESM |
| CNS só mascarado no contrato | Mascarar no web | O CNS completo nunca chega ao navegador (LGPD) |
| Inter no lugar de SF Pro | SF Pro, fonte do sistema | A licença da SF Pro não permite uso como webfont; Inter tem métricas parecidas e é gratuita |
| Tokens com nomes semânticos | Copiar os nomes do Figma | Os nomes do Figma descrevem cores antigas e confundiriam quem lê o código |

## Riscos

- Contrato mudar quando o backend começar: o contrato é a fonte única; qualquer mudança passa por ele e regenera os tipos.
- Divergência entre mock e API: o mock é tipado pelos tipos gerados e tem teste.
- Contrato incompleto em relação ao Figma (veredito dos agentes, prioridade proposta, confiança dos dados, evidências citadas, dados do médico, login gov.br, formato do CNS mascarado): fica fora desta spec e é resolvido nas specs 002 a 005, atualizando o contrato antes do código.
