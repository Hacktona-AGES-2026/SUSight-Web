# Spec: Ficha na fila, envio de documento, decisões registradas e barra do topo

Issue: a criar
Status: rascunho

## Contexto

O Figma (página "Telas · Estilo Apple", seção Clínica) tem telas que as specs 002 a 006 não cobrem: remover e restaurar um paciente da fila, enviar um documento pelo médico, a lista de decisões registradas e a barra do topo do app. Estas telas já foram desenhadas e implementadas só no front; esta spec as descreve para que código e spec voltem a concordar.

## Comportamento esperado

### Ficha na fila (complementa a spec 005)

- O usuário abre um paciente da fila e vê resumo, justificativa, histórico de movimentação e documentos.
- "Remover da fila" abre uma janela com o motivo (cirurgia realizada, desistência do paciente, transferência para outra fila, óbito, outro) e uma observação opcional.
- Ao confirmar, a ficha mostra "Fora da fila", o aviso "Removida da fila em <data>, <hora> · <motivo> · por <nome>" e um evento "Saiu da fila" no histórico. A posição aparece como "—".
- "Restaurar na fila" volta a ficha ao estado anterior.

### Enviar documento

- Passo 1: o usuário busca o paciente por nome ou CNS mascarado e escolhe um resultado.
- Passo 2: confirma o paciente, escolhe o tipo (exame, laudo, relatório, outro), anexa um arquivo PDF, JPG ou PNG de até 20 MB e pode escrever uma observação.
- Passo 3: vê a confirmação com o arquivo, a data, a hora e o nome do médico, e pode enviar outro documento ou ir às revisões.
- A IA analisa o documento; se a posição puder mudar, o médico recebe uma proposta para revisar (fluxo da spec 003).

### Decisões registradas

- O usuário vê o histórico de decisões e contestações, da mais recente para a mais antiga, com tipo, paciente, quem decidiu, texto, data e hora.
- Sem decisões, a tela mostra "Nenhuma decisão registrada ainda."

### Barra do topo

- Toda tela interna mostra o nome do app, o lema, o nome e o CRM do médico logado e o botão "Sair".

## Critérios de aceite

- [ ] Remover exige motivo, registra nome, data e hora e marca a ficha como fora da fila.
- [ ] Restaurar desfaz a remoção e mantém o histórico.
- [ ] O envio de documento recusa tipos fora de PDF, JPG e PNG e arquivos acima de 20 MB, com mensagem em português.
- [ ] O envio não acontece sem paciente e sem arquivo.
- [ ] Nenhuma tela mostra o CNS completo.
- [ ] Decisões registradas lista aprovações, rejeições, pedidos de informação e contestações com nome, data e hora.
- [ ] Toda tela interna mostra a barra do topo com o nome do médico e "Sair".

## Fora do escopo

- Reordenar a fila manualmente (spec 005).
- Visualizar o arquivo dentro do app.
- Envio de documento pelo paciente (app Pulse).

## Questões em aberto

- O médico pode enviar documentos? Nenhuma spec anterior previa isso (spec 008 já levanta a dúvida).
- Remover e restaurar precisam de aprovação de outro profissional, como as decisões da IA?
- Quem recebe aviso quando um paciente sai da fila?
- Decisões registradas mostra tudo ou só as do médico logado?
- Contrato: faltam endpoints para remover e restaurar, receber o arquivo e listar decisões.
