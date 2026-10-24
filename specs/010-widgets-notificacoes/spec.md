# Spec: Widgets e notificações do SUSight Clínica (Windows 11)

Issue: a criar
Status: rascunho

## Contexto

O médico não fica com o SUSight Clínica aberto o tempo todo. Ele precisa saber, sem abrir o sistema, se há revisões esperando e quando a fila mudou, e ter um atalho para enviar um documento. O Figma mostra isso no painel de widgets do Windows 11 e numa notificação do sistema ("Widget e notificação · Windows 11").

## Comportamento esperado

### Instalação

- O SUSight Clínica pode ser instalado pelo navegador como aplicativo, com o nome "SUSight Clínica" e o ícone da marca.
- Instalado, ele abre em janela própria, sem a barra do navegador.
- Em navegadores ou sistemas sem suporte a widgets, o sistema funciona normalmente, só sem os widgets.

### Widget no painel do Windows 11

- Com o aplicativo instalado pelo Microsoft Edge no Windows 11, o médico pode adicionar o widget "SUSight Clínica" ao painel de widgets.
- O widget mostra três linhas, cada uma com ícone, título, texto de apoio e uma seta:
  - "Enviar documento" · "Arraste um exame ou laudo aqui". Abre o envio de documento (spec 008).
  - "<N> revisões pendentes" · "A mais antiga espera há <X> dias". Abre as revisões pendentes (spec 003). Sem pendências, mostra "Nenhuma revisão pendente".
  - "Fila atualizada hoje" · "Aprovada às <hora> por <você ou nome do médico>". Abre a fila do SUS (spec 005). Se a última aprovação não foi hoje, mostra "Fila atualizada em <data>".
- O widget não mostra nome, CNS nem dado clínico de pacientes, porque o painel pode ficar visível para outras pessoas. Mostra só números, datas e nomes de médicos.
- Sem sessão, o widget mostra "Entre no SUSight Clínica para ver suas revisões" e abre o login.
- O widget se atualiza sozinho de tempos em tempos e sempre que o painel é aberto.

### Notificações do sistema

- Na primeira vez que o médico aprova uma fila, o sistema explica para que servem as notificações e pede permissão. O médico pode recusar sem perder nenhuma função.
- Depois de aprovar uma nova fila (spec 004), o sistema mostra a notificação "Nova fila aprovada · A fila do SUS foi atualizada e os pacientes serão avisados."
- Clicar na notificação abre a fila do SUS.
- As notificações não mostram nome, CNS nem dado clínico de pacientes.

## Critérios de aceite

- [ ] O navegador oferece instalar o SUSight Clínica, com nome e ícone da marca.
- [ ] No Windows 11 com Edge, o widget aparece no painel e mostra as três linhas com dados reais da sessão.
- [ ] Cada linha do widget abre a tela certa do sistema.
- [ ] O número de revisões e o tempo da mais antiga batem com a lista de revisões pendentes.
- [ ] Sem sessão, o widget mostra o convite para entrar e não mostra dados.
- [ ] Nenhum widget ou notificação mostra nome, CNS ou dado clínico de paciente.
- [ ] Aprovar uma fila mostra a notificação "Nova fila aprovada" quando há permissão, e nada quebra quando não há.
- [ ] Clicar na notificação abre a fila do SUS.
- [ ] Em navegadores sem suporte a widgets, o sistema funciona normalmente.

## Fora do escopo

- Widgets no macOS, no Linux ou em outros painéis.
- Aplicativo desktop nativo (Electron, Tauri).
- Notificações com o sistema fechado, enviadas pelo backend (ex.: quando outro médico aprova a fila). Dependem de envio de push no SUSight-Backend e podem virar uma spec própria.
- Arrastar arquivos direto para o widget. A linha "Enviar documento" abre o envio no sistema.

## Questões em aberto

- O texto "Arraste um exame ou laudo aqui" promete arrastar para o widget, o que o painel do Windows não permite. Trocar por "Envie um exame ou laudo"?
- O médico deve ser avisado também quando chega uma nova revisão pendente?
- O widget mostra os dados da unidade do médico ou de todas as unidades?
- De quanto em quanto tempo o widget deve se atualizar?
