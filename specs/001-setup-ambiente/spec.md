# Spec: Setup de ambiente, tecnologias e organização do repositório

Issue: Hacktona-AGES-2026/SUSight#24
Status: rascunho

## Contexto

O SUSight Clínica ainda não tem código. Antes das telas do médico, a equipe precisa de um projeto que qualquer pessoa consiga rodar, testar e evoluir seguindo o SDD. O backend ainda não tem API, então o web precisa funcionar com dados de demonstração sem depender dele.

## Comportamento esperado

- A pessoa desenvolvedora clona o repositório, segue o README e sobe a aplicação localmente com poucos comandos.
- O projeto usa Next.js com TypeScript (decisão da equipe).
- A aplicação abre em uma página inicial em português com o nome SUSight Clínica.
- O sistema lê os dados de uma camada de acesso única. Essa camada tem duas fontes: dados de demonstração (mock) e a API do SUSight-Backend. Uma configuração de ambiente escolhe a fonte, sem mudar o código das telas.
- O contrato esperado da API (recursos, campos e formatos) fica documentado no repositório. Ele é a referência para o mock e para o backend.
- Lint, formatação, checagem de tipos e testes rodam com um comando cada.
- O README explica como rodar, testar e onde ficam specs, contrato e mocks.

## Critérios de aceite

- [x] Uma pessoa sem contexto sobe a aplicação seguindo só o README.
- [x] A página inicial mostra "SUSight Clínica" em português.
- [x] Com a fonte em modo mock, a aplicação funciona sem backend rodando.
- [x] O contrato da API está documentado e os mocks seguem esse contrato.
- [x] Os comandos de lint, checagem de tipos e testes rodam sem erro no projeto limpo.
- [x] Existe um teste de exemplo passando.
- [x] A estrutura de pastas está descrita no README.

## Testes (TDD)

Os testes vêm antes do código. Cada critério de aceite acima vira pelo menos um teste automatizado que falha primeiro (red), e a implementação só termina quando todos passam (green). Critério que não puder ser testado automaticamente leva uma justificativa escrita. Testes de unidade e de ponta a ponta no navegador (spec 007).

## Fora do escopo

- Telas de login, revisões, fila e export (specs 002 a 006).
- Deploy e pipeline de CI (podem virar uma issue própria).
- Implementar qualquer parte do backend.
- Completar o contrato com o que as telas do Figma mostram e ele ainda não cobre (specs 002 a 005).

## Decisões tomadas

- Estilo e componentes: Tailwind CSS com shadcn/ui, usando os tokens do design no Figma (Hackathona 2026).
- Contrato: OpenAPI em `docs/api/openapi.yaml`, com tipos TypeScript gerados a partir dele.
- Node 22 LTS e pnpm.
- Nome do produto na interface: SUSight Clínica, como no Figma.
- Fonte: Inter, no lugar da SF Pro usada no Figma.
