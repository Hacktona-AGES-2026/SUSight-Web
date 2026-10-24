# Spec: Widgets e avisos do médico (Windows 11)

Issue: Hacktona-AGES-2026/SUSight#14
Status: rascunho

## Contexto

O médico não fica com o SUSight Clínica aberto o tempo todo. Ele precisa saber, sem abrir o sistema, quantas propostas esperam revisão, ser avisado quando algo pede a sua atenção e ter um atalho para enviar um documento.

Esta spec implementa a parte do médico da spec de widgets do repositório SUSight (`specs/004-widgets`, seção "Médico (Windows)"). Aquela spec é a referência do comportamento.

Design: Figma Hackathona-2026, nó 98-97 ("Painel de widgets e notificações do Windows 11").

## Comportamento esperado

### Instalação

- O SUSight Clínica pode ser instalado pelo navegador como aplicativo, com o nome "SUSight Clínica" e o ícone da marca. Instalado, ele abre em janela própria.
- Em navegadores ou sistemas sem suporte a widgets, o sistema funciona normalmente, só sem os widgets.

### Widgets no painel do Windows 11

- Com o aplicativo instalado pelo Microsoft Edge no Windows 11, o médico pode adicionar dois widgets ao painel:
  - **"Aprovações":** o número de propostas esperando revisão (ex.: "3") com "propostas para revisar" e o botão "Revisar", que abre as revisões pendentes (spec 003). Sem pendências, mostra "0" e "nenhuma proposta para revisar".
  - **"Enviar documento":** atalho que abre o envio de documento (spec 008).
- Sem sessão, o widget "Aprovações" mostra "Entre no SUSight Clínica para ver suas revisões" e o botão abre o login.
- Os widgets se atualizam sozinhos de tempos em tempos e sempre que o painel é aberto.
- Os widgets nunca aprovam nem rejeitam nada (constituição, itens 1 e 2).

### Avisos (notificações do sistema)

- O médico recebe avisos do SUSight Clínica mesmo com o sistema fechado:
  - **"Nova proposta":** o nome do paciente e o botão "Revisar", que abre a revisão daquela proposta;
  - **"Fila atualizada":** quantos pacientes foram avisados (ex.: "3 pacientes avisados");
  - **"Paciente respondeu":** quem respondeu a um pedido de informações e o que enviou (ex.: "Rita enviou o raio-X") e o botão "Abrir", que abre a proposta.
- Clicar no aviso ou no botão abre a tela correspondente. O aviso nunca toma uma decisão.
- Na primeira vez, o sistema explica para que servem os avisos e pede permissão. O médico pode recusar sem perder nenhuma função.
- Os avisos mostram o mínimo de dados pessoais necessários para identificar a proposta (LGPD). Nunca mostram CNS nem dado clínico.

## Critérios de aceite

- [ ] O navegador oferece instalar o SUSight Clínica, com nome e ícone da marca.
- [ ] No Windows 11 com Edge, os widgets "Aprovações" e "Enviar documento" aparecem no painel.
- [ ] O widget "Aprovações" mostra o mesmo número da lista de revisões pendentes, e "Revisar" abre a lista.
- [ ] "Enviar documento" abre o envio de documento.
- [ ] Sem sessão, o widget não mostra dados e leva ao login.
- [ ] O médico recebe "Nova proposta", "Fila atualizada" e "Paciente respondeu" com o sistema fechado, quando deu permissão.
- [ ] Clicar no aviso ou no botão abre a tela correspondente, e nenhum aviso aprova ou rejeita.
- [ ] Nenhum widget ou aviso mostra CNS ou dado clínico.
- [ ] Recusar a permissão não quebra nada, e navegadores sem suporte a widgets funcionam normalmente.
- [ ] Os widgets e os avisos são lidos corretamente por leitores de tela (Narrador do Windows).

## Fora do escopo

- Widgets no macOS e no Linux.
- Aplicativo desktop nativo (Electron, Tauri).
- Aprovar ou rejeitar direto do widget ou do aviso.
- Arrastar arquivos para o widget.

## Questões em aberto

- Os avisos mostram o nome completo do paciente, como no Figma ("Marina Albuquerque"), ou só o primeiro nome ou iniciais? A spec 004 do SUSight deixa isso em aberto.
- O backend envia os avisos (ele sabe quando há nova proposta ou resposta do paciente) ou o web envia?
- De quanto em quanto tempo os widgets devem se atualizar?
