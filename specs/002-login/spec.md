# Spec: Login do médico e navegação

Issue: Hacktona-AGES-2026/SUSight#15
Status: rascunho

## Contexto

O SUSight Clínica mostra dados de saúde de pacientes e registra decisões em nome de um profissional. Só médicos autenticados podem entrar, e toda decisão precisa saber quem a tomou (constituição, itens 2 e 6).

## Comportamento esperado

- O usuário que abre o SUSight Clínica sem sessão vê a tela de login.
- O usuário informa suas credenciais e entra.
- A tela tem o título "Entrar no SUSight Clínica" e o texto "Use sua conta gov.br ou seu registro profissional."
- Existem duas formas de entrar:
  - o botão "Entrar com gov.br";
  - "ou entre com seu CRM": campos "CRM e UF", "Senha" e "Código de verificação" (segundo fator), e o botão "Entrar".
- Ao lado do formulário, um painel reforça a regra do produto: "Decisões justas começam com a revisão de quem cuida. A IA propõe, você decide. Toda decisão fica registrada com seu nome, data e hora."
- Com credenciais válidas, o sistema leva o usuário para as revisões pendentes.
- Com credenciais inválidas, o sistema mostra uma mensagem em português, sem dizer qual campo está errado, e mantém o CRM e a UF preenchidos.
- Quando a sessão expira, o sistema leva o usuário para o login com o aviso "Sua sessão expirou. Entre novamente." e, depois de entrar, o devolve para a tela onde estava.
- Toda tela interna exige sessão. Acessar uma URL interna sem sessão leva ao login.
- Em modo mock, existe pelo menos um médico de demonstração documentado no README.

### Navegação

- Todas as telas internas têm um menu lateral com: "Revisões" (com o número de propostas pendentes), "Fila do SUS", "Enviar documento", "Decisões registradas" e "Exportar fila". O item da tela atual fica destacado.
- O rodapé do menu mostra o médico logado: nome, especialidade, CRM com o número mascarado e unidade de regulação (ex.: "Dra. Helena Duarte · Ortopedia · CRM-RJ •••• · Regulação Niterói").
- O usuário pode sair a qualquer momento. Ao sair, volta para a tela de login e não consegue voltar às telas internas pelo botão "voltar" do navegador.

## Critérios de aceite

- [ ] Sem sessão, qualquer URL interna redireciona para o login.
- [ ] Login com CRM, UF, senha e código válidos leva às revisões pendentes.
- [ ] O botão "Entrar com gov.br" inicia o login pelo gov.br.
- [ ] Login inválido mostra mensagem genérica em português e mantém CRM e UF.
- [ ] Botão de envio fica desabilitado enquanto o login está em andamento, sem envio duplo.
- [ ] O menu lateral aparece em todas as telas internas, com o item atual destacado e o número de revisões pendentes.
- [ ] O rodapé do menu mostra nome, especialidade, CRM mascarado e unidade do médico logado.
- [ ] Sair encerra a sessão e bloqueia o retorno às telas internas.
- [ ] Sessão expirada leva ao login com aviso e retorna à tela anterior após entrar.
- [ ] Falha de rede mostra "Não foi possível conectar. Tente novamente." sem perder o que foi digitado.

## Fora do escopo

- Cadastro de médicos, recuperação de senha e troca de senha.
- Perfis além de médico (regulação, administrador).
- Login do paciente (app SUSight Paciente).
- Widget e notificações do sistema operacional (Windows 11), que aparecem no Figma. Podem virar uma spec própria.

## Questões em aberto

- O login gov.br é real na hackathon ou simulado no modo mock?
- Como chega o código de verificação: aplicativo autenticador, SMS ou e-mail?
- Onde fica o botão "Sair"? Ele não aparece no Figma.
- No Figma, o menu mostra 7 revisões e a lista mostra 3 propostas. O número do menu deve ser o total de pendentes?
- Duração da sessão e se existe "lembrar de mim".
- Bloqueio após várias tentativas erradas fica no web, no backend ou fora da hackathon?
