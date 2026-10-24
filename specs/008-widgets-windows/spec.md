# Spec: Widgets e avisos do Windows

Issue: Hacktona-AGES-2026/SUSight#35
Status: rascunho

## Contexto

O médico precisa saber que há propostas esperando revisão sem ficar com o Pulse Clinical aberto. No Windows, um widget e avisos no painel do sistema mostram o que espera aprovação e levam direto à revisão. A decisão continua acontecendo só dentro do Pulse Clinical (constituição, itens 1 e 2). O mesmo recurso existe para o paciente no iPhone, descrito na spec 004 do repositório SUSight (Hacktona-AGES-2026/SUSight#14).

## Telas (Figma Hackathona-2026)

Seção "Médico Windows" (nó 98-96). Tela "Windows 11 · Painel de widgets e notificações" (nó 98-97). Link base: `https://www.figma.com/design/iy1iFYNgXDrqylPa0JdGrr/Hackathona-2026?node-id=<nó>&m=dev`. O design foi lido só pela estrutura, sem captura de tela, e alguns textos aparecem truncados.

## Comportamento esperado

### Widget "Aprovações"

- O widget mostra quantas propostas aguardam revisão, por exemplo "3 propostas para revisar".
- O botão do widget abre o Pulse Clinical na lista de revisões pendentes (spec 003).
- O número se atualiza quando chega ou sai uma proposta, sem o médico abrir o Pulse Clinical.
- Sem propostas pendentes, o widget mostra "Nenhuma revisão pendente."
- Sem conexão, mostra o último número conhecido com a hora da última atualização.

### Avisos no painel do Windows

Os avisos aparecem como "SUSight Clínica" e têm um botão que abre o item correspondente.

- **Nova proposta para revisão:** quando chega uma proposta. Identifica o paciente e a proposta com o mínimo necessário. O botão abre a revisão (spec 003).
- **Paciente respondeu ao pedido:** quando o paciente envia o exame que o médico pediu (spec 004). O botão abre a proposta que estava aguardando o paciente.
- **Fila aprovada e atualizada:** depois que uma aprovação é aplicada, informa quantos pacientes foram avisados. Não tem botão de ação.

### Regras

- Widget e avisos só informam e abrem o Pulse Clinical. Nenhum deles aprova, rejeita ou pede informação.
- O médico só vê widget e avisos depois de entrar com a conta dele (spec 002). Sem sessão ativa, o widget não mostra contagem nem nomes e pede para abrir o Pulse Clinical.
- Os avisos mostram o mínimo de dados pessoais para identificar a proposta e nunca o CNS completo (constituição, item 6).
- Os textos são em português do Brasil, em linguagem simples e sem alarme.

## Critérios de aceite

- [ ] O widget "Aprovações" mostra a quantidade de propostas pendentes e atualiza sem abrir o Pulse Clinical.
- [ ] O botão do widget abre a lista de revisões pendentes.
- [ ] O médico recebe aviso de nova proposta, de resposta do paciente a um pedido de exame e de fila aprovada aplicada.
- [ ] O botão de cada aviso abre o item correspondente.
- [ ] Nenhum widget ou aviso aprova, rejeita ou pede informação.
- [ ] Sem sessão ativa, widget e avisos não expõem dados de pacientes.
- [ ] Nenhum aviso mostra o CNS completo.
- [ ] Sem conexão, o widget mostra o último número conhecido com a hora.
- [ ] Textos em português do Brasil, em linguagem simples.

## Testes (TDD)

Os testes vêm antes do código. Cada critério de aceite acima vira pelo menos um teste automatizado que falha primeiro (red), e a implementação só termina quando todos passam (green). Critério que não puder ser testado automaticamente leva uma justificativa escrita. Testes de unidade e de ponta a ponta no navegador (spec 007).

## Fora do escopo

- Aprovar ou rejeitar direto do widget ou do aviso.
- Widgets e avisos do paciente (spec 004 do repositório SUSight).
- Versões para macOS, Linux, iPhone ou Android.
- Alterar a lista de revisões pendentes ou a tela de revisão (specs 003 e 004).

## Questões em aberto

- O Figma mostra o widget "Envio rápido" ("Enviar documento") no painel do médico. O médico envia documentos? Nenhuma spec prevê isso hoje.
- Os avisos mostram o nome completo do paciente? O Figma mostra "Marina Albuquerque" e "Rita de Cássia Lima". Alternativa: iniciais ou número do pedido.
- Windows 11 é o único alvo no MVP? Widgets e avisos no painel do Windows normalmente pedem um aplicativo instalado. Como isso funciona se o Pulse Clinical é web?
- O widget respeita as mesmas exigências de acesso do login do médico (gov.br, CRM, senha e código de 6 dígitos)?
- O médico vê avisos de todas as propostas ou só das suas especialidades e unidades? (Mesma dúvida da spec 003.)
