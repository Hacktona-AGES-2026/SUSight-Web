# Tarefas: Widgets e notificações do SUSight Clínica (Windows 11)

Plano: ./plan.md

Cada tarefa é pequena, verificável e vira um commit atômico.

- [ ] 1. Prova de conceito: manifest, service worker e widget com dados fixos, instalado pelo Edge num Windows 11 real.
- [ ] 2. Ícones PNG da marca (192 e 512 px) e manifest completo, com nome, cores e `start_url`.
- [ ] 3. Modelo do widget em Adaptive Cards com as três linhas e o estado "sem sessão", seguindo o Figma.
- [ ] 4. Contrato: `QueueList` com `lastApprovedAt` e `lastApprovedBy`; regenerar tipos; fixtures do mock.
- [ ] 5. Rota `/api/widgets/clinica` com os dados da sessão, sem dados de paciente.
- [ ] 6. Service worker: atualizar o widget ao instalar, ao abrir o painel e periodicamente; abrir a tela certa ao clicar.
- [ ] 7. Notificações: explicação e pedido de permissão na primeira aprovação; "Nova fila aprovada" depois de aprovar; clique abre a fila.
- [ ] 8. Testes: dados do widget (com e sem sessão, sem dados de paciente), textos das linhas e fluxo de permissão.
- [ ] 9. README: como instalar o PWA e adicionar o widget no Windows 11.
