# Tarefas: Login do médico e navegação

Plano: ./plan.md

Cada tarefa é pequena, verificável e vira um commit atômico.

- [ ] 1. Contrato: `LoginRequest` com CRM, UF, senha e código; `Doctor` com especialidade e unidade; rota `POST /auth/govbr/session`. Regenerar os tipos.
- [ ] 2. Camada de dados: login novo e `loginWithGovBr` nas fontes mock e API; mock valida o token a cada chamada; fixtures e testes do mock atualizados.
- [ ] 3. Sessão: iron-session com cookie `susight_session`, `SESSION_PASSWORD` no `.env.example`, `getCurrentDoctor` e `getDataSource`.
- [ ] 4. `proxy.ts`: rotas internas sem sessão vão para `/login?next=` e respondem com `Cache-Control: no-store`.
- [ ] 5. Tela de login: painel da marca, formulário com CRM, UF, senha e código, validação com zod, mensagem genérica de erro, botão desabilitado durante o envio, CRM e UF mantidos e mensagem de falha de rede.
- [ ] 6. Login com gov.br: botão, retorno em `/login/govbr` e entrada direta no modo mock.
- [ ] 7. Sessão expirada: resposta 401 leva a `/login?expired=1&next=`, com o aviso e o retorno à tela anterior.
- [ ] 8. Layout interno: menu lateral com item atual destacado e contador de revisões, rodapé com nome, especialidade, CRM mascarado e unidade, e botão "Sair".
- [ ] 9. Rotas internas com só o título (revisões, fila, enviar documento, decisões, exportar); `/` redireciona; abertura vira `loading.tsx` e o teste da spec 001 passa a testar o componente.
- [ ] 10. Testes: validação do formulário, máscara do CRM, Server Action de login com o mock (válido, inválido e falha de rede), logout e redirecionamento do proxy.
- [ ] 11. README: médico de demonstração (CRM, UF, senha e código), login gov.br no mock e `SESSION_PASSWORD`.
