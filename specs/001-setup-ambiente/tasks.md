# Tarefas: Setup de ambiente, tecnologias e organização do repositório

Plano: ./plan.md

Cada tarefa é pequena, verificável e vira um commit atômico.

- [x] 1. Documentar o contrato da API em `docs/api/openapi.yaml`.
- [x] 2. Registrar as decisões da spec, plano e tarefas.
- [x] 3. Criar o projeto Next.js com TypeScript, Tailwind e ESLint usando pnpm; fixar Node 22 em `.nvmrc`, `engines` e `packageManager`.
- [x] 4. Configurar Prettier e os scripts `lint`, `format`, `format:check`, `typecheck` e `test` (Vitest + Testing Library).
- [ ] 5. Iniciar o shadcn/ui e aplicar os tokens do Figma em `globals.css` com nomes semânticos; configurar a fonte Inter.
- [ ] 6. Página inicial em português com "SUSight Clínica", seguindo o frame "Splash · SUSight Clínica" do Figma.
- [ ] 7. Gerar os tipos do contrato com `pnpm api:types`.
- [ ] 8. Camada de dados: interface, fonte mock com fixtures, fonte API, seletor por variável de ambiente e `.env.example`.
- [ ] 9. Testes de exemplo: página inicial e dados do mock (incluindo CNS mascarado).
- [ ] 10. README: como rodar, testar, estrutura de pastas e onde ficam specs, contrato e mocks.
