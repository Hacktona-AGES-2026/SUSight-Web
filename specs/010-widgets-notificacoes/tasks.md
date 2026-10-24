# Tarefas: Widgets e avisos do médico (Windows 11)

Plano: ./plan.md

Cada tarefa é pequena, verificável e vira um commit atômico. Os testes vêm antes do código.

- [x] 1. Regras: testes e `approvalsWidgetData` e `notificationFor`, sem CNS nem dado clínico.
- [x] 2. Ícones PNG da marca (192 e 512 px) e manifest com nome, cores, `start_url` e os dois widgets.
- [ ] 3. Modelos dos widgets em Adaptive Cards ("Aprovações", com o estado "sem sessão", e "Enviar documento"), com textos para o Narrador.
- [ ] 4. Rota `/api/widgets/aprovacoes`: testes e dados a partir da camada de dados.
- [ ] 5. Service worker: widgets (instalar, abrir painel, atualizar e clicar) e registro no layout.
- [ ] 6. Web Push: chaves VAPID no `.env.example`, pedido de permissão com explicação e `POST /api/push/subscription`.
- [ ] 7. Service worker: mostrar o aviso com os botões e abrir a tela certa no clique.
- [ ] 8. Modo mock: envio com `web-push` depois de aprovar e rota `/api/push/demo` para "Nova proposta" e "Paciente respondeu".
- [ ] 9. Contrato: `POST /me/web-push-subscription` e formato do evento de push; regenerar os tipos.
- [ ] 10. Prova no Windows 11 com Edge e README: instalar o PWA, adicionar os widgets e testar os avisos.
