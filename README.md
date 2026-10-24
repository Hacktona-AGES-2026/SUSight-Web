# SUSight-Web

SUSight Clínica: aplicação web para o médico revisar propostas de fila, decidir e exportar a fila ordenada em CSV.

## Como rodar

Pré-requisitos: Node 22 (veja `.nvmrc`) e pnpm. Com Node 22 instalado, ative o pnpm na versão do projeto com `corepack enable pnpm`.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Abra http://localhost:3000. Por padrão a aplicação usa dados de demonstração e não precisa do backend.

### Fonte de dados

A variável `NEXT_PUBLIC_DATA_SOURCE` em `.env.local` escolhe de onde vêm os dados:

| Valor           | Fonte                                                |
| --------------- | ---------------------------------------------------- |
| `mock` (padrão) | Dados de demonstração em memória, sem backend        |
| `api`           | SUSight-Backend no endereço de `NEXT_PUBLIC_API_URL` |

No modo mock, o médico de demonstração entra com o identificador `CRM/RJ 52871` e a senha `demo1234`.

## Comandos

| Comando             | O que faz                                 |
| ------------------- | ----------------------------------------- |
| `pnpm dev`          | Sobe a aplicação em modo desenvolvimento  |
| `pnpm build`        | Gera a versão de produção                 |
| `pnpm lint`         | Roda o ESLint                             |
| `pnpm format`       | Formata o código com Prettier             |
| `pnpm format:check` | Confere a formatação sem alterar arquivos |
| `pnpm typecheck`    | Checa os tipos do TypeScript              |
| `pnpm test`         | Roda os testes uma vez (Vitest)           |
| `pnpm test:watch`   | Roda os testes a cada mudança             |
| `pnpm api:types`    | Gera os tipos a partir do contrato da API |

## Estrutura de pastas

```
docs/
  api/openapi.yaml      Contrato da API (fonte única para web, mock e backend)
  sdd/MANUAL.md         Passo a passo do SDD
specs/                  Constituição, modelos e specs de cada feature
public/                 Arquivos estáticos (ícones)
src/
  app/                  Páginas (Next.js App Router) e estilos globais
  components/ui/        Componentes do shadcn/ui
  lib/
    api/
      schema.ts         Tipos gerados do contrato (não edite à mão)
      types.ts          Nomes curtos para os tipos do contrato
    data/
      source.ts         Interface única de acesso aos dados
      mock/             Fonte de demonstração e suas fixtures
      api/              Fonte que chama o SUSight-Backend
      index.ts          Escolhe a fonte pela variável de ambiente
```

## Contrato e mocks

O contrato da API fica em [docs/api/openapi.yaml](docs/api/openapi.yaml). Ao mudar o contrato, rode `pnpm api:types` para atualizar `src/lib/api/schema.ts`. O TypeScript aponta onde o mock ou a fonte da API deixaram de seguir o contrato.

As fixtures do mock ficam em [src/lib/data/mock/fixtures.ts](src/lib/data/mock/fixtures.ts). Os dados são fictícios, e o CNS só aparece mascarado.

## Design

As telas seguem o Figma "Hackathona 2026" (página "Telas · Estilo Apple"). Os tokens de cor e texto estão em [src/app/globals.css](src/app/globals.css), com nomes semânticos e o nome original do Figma em comentário. A fonte é a Inter, no lugar da SF Pro do Figma.

## Spec-Driven Development (SDD)

No SDD, a especificação vem antes do código. Cada feature passa por quatro etapas:

1. **Spec:** o que a feature faz e como saber que está pronta.
2. **Plano:** como será construída.
3. **Tarefas:** passos pequenos, cada um vira um commit atômico.
4. **Implementação:** código que segue a spec. Se precisar divergir, a spec é atualizada primeiro.

Os princípios do projeto estão em [specs/constitution.md](specs/constitution.md). Os modelos estão em [specs/_template](specs/_template). O passo a passo completo está em [docs/sdd/MANUAL.md](docs/sdd/MANUAL.md).

## Regras de contribuição

- Commits atômicos.
- Nenhum merge sem revisão de uma pessoa desenvolvedora.
