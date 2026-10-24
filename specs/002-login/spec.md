# Spec: Login do médico

Issue: Hacktona-AGES-2026/SUSight#15
Status: rascunho

## Contexto

O SUSight Clínica mostra dados de saúde de pacientes e registra decisões em nome de um profissional. Só médicos autenticados podem entrar, e toda decisão precisa saber quem a tomou (constituição, itens 2 e 6).

## Comportamento esperado

- O usuário que abre o SUSight Clínica sem sessão vê a tela de login.
- O usuário informa suas credenciais e entra.
- Com credenciais válidas, o sistema leva o usuário para as revisões pendentes.
- Com credenciais inválidas, o sistema mostra uma mensagem em português, sem dizer qual campo está errado, e mantém o identificador preenchido.
- O sistema mostra o nome do médico logado no topo de todas as telas.
- O usuário pode sair a qualquer momento. Ao sair, volta para a tela de login e não consegue voltar às telas internas pelo botão "voltar" do navegador.
- Quando a sessão expira, o sistema leva o usuário para o login com o aviso "Sua sessão expirou. Entre novamente." e, depois de entrar, o devolve para a tela onde estava.
- Toda tela interna exige sessão. Acessar uma URL interna sem sessão leva ao login.
- Em modo mock, existe pelo menos um médico de demonstração documentado no README, e enquanto não há backend a tela aceita qualquer identificador e senha preenchidos.
- A tela não tem login com gov.br por enquanto.
- O botão "Entrar" fica rosa escuro quando os campos obrigatórios (CRM e senha) estão preenchidos.

## Critérios de aceite

- [ ] Sem sessão, qualquer URL interna redireciona para o login.
- [ ] Login válido leva às revisões pendentes e mostra o nome do médico.
- [ ] Login inválido mostra mensagem genérica em português.
- [ ] Botão de envio fica desabilitado enquanto o login está em andamento, sem envio duplo.
- [ ] Sair encerra a sessão e bloqueia o retorno às telas internas.
- [ ] Sessão expirada leva ao login com aviso e retorna à tela anterior após entrar.
- [ ] Falha de rede mostra "Não foi possível conectar. Tente novamente." sem perder o que foi digitado.

## Fora do escopo

- Cadastro de médicos, recuperação de senha e troca de senha.
- Perfis além de médico (regulação, administrador).
- Login do paciente (app Pulse).

## Questões em aberto

- Identificador de login: e-mail, CRM ou CPF?
- Duração da sessão e se existe "lembrar de mim".
- Autenticação final: própria do backend ou provedor externo (gov.br, SSO do hospital)?
- Bloqueio após várias tentativas erradas fica no web, no backend ou fora da hackathon?
