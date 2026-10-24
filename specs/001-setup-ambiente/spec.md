# Spec: Setup de ambiente, tecnologias e organização do repositório

Issue: Hacktona-AGES-2026/SUSight#24
Status: rascunho

## Contexto

O Pulse Clinical ainda não tem código. Antes das telas do médico, a equipe precisa de um projeto que qualquer pessoa consiga rodar, testar e evoluir seguindo o SDD. O backend ainda não tem API, então o web precisa funcionar com dados de demonstração sem depender dele.

## Comportamento esperado

- A pessoa desenvolvedora clona o repositório, segue o README e sobe a aplicação localmente com poucos comandos.
- O projeto usa Next.js com TypeScript (decisão da equipe).
- A aplicação abre em uma página inicial em português com o nome Pulse Clinical.
- O sistema lê os dados de uma camada de acesso única. Essa camada tem duas fontes: dados de demonstração (mock) e a API do SUSight-Backend. Uma configuração de ambiente escolhe a fonte, sem mudar o código das telas.
- O contrato esperado da API (recursos, campos e formatos) fica documentado no repositório. Ele é a referência para o mock e para o backend.
- Lint, formatação, checagem de tipos e testes rodam com um comando cada.
- O README explica como rodar, testar e onde ficam specs, contrato e mocks.

## Critérios de aceite

- [ ] Uma pessoa sem contexto sobe a aplicação seguindo só o README.
- [ ] A página inicial mostra "Pulse Clinical" em português.
- [ ] Com a fonte em modo mock, a aplicação funciona sem backend rodando.
- [ ] O contrato da API está documentado e os mocks seguem esse contrato.
- [ ] Os comandos de lint, checagem de tipos e testes rodam sem erro no projeto limpo.
- [ ] Existe um teste de exemplo passando.
- [ ] A estrutura de pastas está descrita no README.

## Fora do escopo

- Telas de login, revisões, fila e export (specs 002 a 006).
- Deploy e pipeline de CI (podem virar uma issue própria).
- Implementar qualquer parte do backend.

## Questões em aberto

- Biblioteca de componentes e estilo (ex.: Tailwind, shadcn/ui) e se seguimos o design do repositório SUSight.
- Formato do contrato: OpenAPI ou tipos TypeScript compartilhados com o backend.
- Versão mínima do Node e gerenciador de pacotes (npm, pnpm).
