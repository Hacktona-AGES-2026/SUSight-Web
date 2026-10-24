# Spec: Enviar documento do paciente

Issue: a criar
Status: rascunho

## Contexto

Exames e laudos nem sempre chegam pelo app do paciente. O médico pode receber um documento, por exemplo um laudo trazido na consulta, e precisa anexá-lo ao paciente certo para a IA reavaliar a posição. O envio não muda a fila: a IA só propõe e o médico decide (constituição, item 1).

## Comportamento esperado

No menu, o usuário abre "Enviar documento". O envio tem três passos.

### Passo 1: identificar o paciente

- A tela mostra "Passo 1 de 3 · Identifique o paciente" e o campo "CNS ou nome do paciente".
- Os resultados mostram nome, CNS mascarado, procedimento e posição na fila (ex.: "Marina Albuquerque · CNS •••• 4821 · Artroplastia total de joelho · 31ª").
- O usuário escolhe um paciente e clica em "Continuar".

### Passo 2: confirmar e anexar

- A tela mostra "Passo 2 de 3 · Confirme e anexe" e o paciente identificado, com nome, CNS mascarado e procedimento.
- O usuário escolhe o tipo do documento: "Exame", "Laudo", "Relatório" ou "Outro".
- O usuário arrasta o arquivo ou escolhe no computador. São aceitos PDF, JPG ou PNG de até 20 MB.
- O campo "Observação (opcional)" permite descrever o documento.
- Os botões são "Voltar" e "Enviar documento".

### Passo 3: pronto

- A tela mostra "Documento enviado" e "Passo 3 de 3 · Pronto".
- O texto explica: "A IA já está analisando o <tipo>. Se a posição puder mudar, você recebe uma proposta para revisar."
- Um resumo mostra o documento (título, data e hora do envio e quem enviou) e o paciente (nome e CNS mascarado).
- Os botões são "Enviar outro documento" e "Ver revisões".
- O envio fica registrado com nome, data e hora. Se gerar uma proposta, o documento aparece nas evidências citadas (spec 003).

## Critérios de aceite

- [ ] A busca por nome ou CNS só mostra o CNS mascarado.
- [ ] Não é possível continuar sem escolher um paciente.
- [ ] Só são aceitos PDF, JPG ou PNG de até 20 MB. Outros arquivos mostram uma mensagem em português explicando o limite.
- [ ] Não é possível enviar sem tipo e sem arquivo.
- [ ] "Voltar" no passo 2 mantém o paciente escolhido.
- [ ] O envio não muda a fila.
- [ ] O documento fica identificado como enviado por um profissional, separado dos relatos do paciente.
- [ ] Enquanto o envio acontece, o botão fica desabilitado, sem envio duplo.
- [ ] Falha no envio mantém o que foi preenchido e permite tentar de novo.

## Fora do escopo

- Ver, editar ou apagar o arquivo depois de enviado.
- A leitura do documento pela IA (responsabilidade do backend).
- Envio de documentos pelo paciente (app SUSight Paciente).
- O atalho "Enviar documento" no widget do Windows, que aparece no Figma.

## Questões em aberto

- O contrato da API não tem rota de envio de arquivo, e os tipos de documento hoje são só exame, laudo e relato do paciente. "Relatório" e "Outro" precisam entrar no contrato.
- A busca encontra todos os pacientes da fila ou só os da unidade do médico?
- O médico pode enviar vários arquivos de uma vez?
- Onde o arquivo fica guardado e por quanto tempo (LGPD)?
