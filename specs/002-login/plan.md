# Plano: Login do médico e navegação

Spec: ./spec.md
Status: em revisão

## Abordagem

O login roda no servidor. Um Server Action valida o formulário, chama `login` da camada de dados (spec 001) e guarda a sessão num cookie criptografado e `httpOnly` (iron-session). O token do backend nunca chega ao JavaScript do navegador. Um `proxy.ts` faz a checagem rápida: sem cookie de sessão, qualquer rota interna vai para `/login?next=<rota>`. A checagem completa fica numa camada de acesso (`getCurrentDoctor`), que as telas chamam atrás de um `<Suspense>`, como pede o modo Cache Components do Next 16. As telas internas ficam num grupo de rotas com um layout próprio, que tem o menu lateral e o rodapé do médico.

## Dados e interfaces

- **Contrato (`docs/api/openapi.yaml`):**
  - `LoginRequest` passa de `identifier` + `password` para `crm`, `uf`, `password` e `verificationCode` (6 dígitos).
  - `Doctor` ganha `specialty` (ex.: "Ortopedia") e `regulationUnit` (ex.: "Regulação Niterói").
  - Nova rota `POST /auth/govbr/session` com `{ code, redirectUri }`, que devolve `Session`. O início do fluxo é um redirecionamento do navegador para `GET /auth/govbr/authorize?redirect_uri=...` no backend.
  - Os tipos são regenerados com `pnpm api:types`.
- **Camada de dados (`src/lib/data/`):**
  - `DataSource` ganha `loginWithGovBr(code, redirectUri)`.
  - A fonte mock deixa de guardar "logado" no processo. Ela passa a receber `getToken`, como a fonte da API, e valida o token a cada chamada.
- **Sessão (`src/lib/auth/`):**
  - `session.ts`: lê, grava e apaga o cookie `susight_session`, com `{ token, expiresAt, doctor }`. A senha do cookie vem de `SESSION_PASSWORD`.
  - `dal.ts`: `getCurrentDoctor()`, que redireciona para o login quando não há sessão, e `getDataSource()`, que entrega a fonte já com o token da sessão.
  - `actions.ts`: Server Actions `login`, `logout` e `startGovBrLogin`.
- **Rotas (`src/app/`):**
  - `proxy.ts`: protege as rotas internas e define `Cache-Control: no-store` nelas.
  - `login/page.tsx`: painel da marca e formulário. O `?next=` volta para a tela anterior e o `?expired=1` mostra o aviso de sessão expirada.
  - `login/govbr/route.ts`: retorno do gov.br; troca o `code` pela sessão.
  - `(app)/layout.tsx`: menu lateral, contador de revisões e rodapé do médico.
  - `(app)/revisoes`, `(app)/fila`, `(app)/enviar-documento`, `(app)/decisoes`, `(app)/exportar`: páginas com só o título, que as specs 003 a 006, 008 e 009 vão preencher.
  - `page.tsx` (`/`): redireciona para `/revisoes`. A tela de abertura da spec 001 vira o `loading.tsx` da raiz.
- **Componentes:** `LoginForm` (cliente, com `useActionState`), `AppSidebar` e `DoctorFooter`, usando os componentes do shadcn/ui (`button`, `input`, `label`).
- **Validação:** zod, com as mesmas regras no Server Action e nos testes.

## Decisões

| Decisão | Alternativas consideradas | Motivo |
|---|---|---|
| Sessão em cookie criptografado e `httpOnly` (iron-session) | Token no `localStorage`; NextAuth | O token não fica exposto a scripts (LGPD). É o exemplo oficial do Next 16 com Cache Components e é mais simples que NextAuth para um provedor só. |
| Login por Server Action | Chamar a API direto do navegador | O token e o backend ficam só no servidor, e a mesma regra vale para mock e API. |
| Proxy só checa se o cookie existe; a validação real fica em `getCurrentDoctor` | Validar tudo no proxy | É o padrão recomendado pelo Next. O proxy é rápido e a checagem completa fica junto dos dados. |
| gov.br: no modo API, o backend faz o OAuth e o web só troca o `code`; no mock, o botão entra direto com o médico de demonstração | Integrar o gov.br no web | O segredo do gov.br fica no backend. Na hackathon, o fluxo fica demonstrável sem credenciais reais. |
| Código de verificação: campo de 6 dígitos validado pelo backend; no mock, o código é fixo | SMS ou e-mail enviados pelo sistema | O envio do código fica fora do web. A tela e o contrato ficam prontos para qualquer forma de entrega. |
| Botão "Sair" no rodapé do menu, junto aos dados do médico | Menu no topo; item no menu lateral | O Figma não mostra o botão. O rodapé já é o lugar do médico logado e não muda a navegação principal. |
| Contador do menu = total de propostas pendentes (`listProposals().total`) | Número fixo do Figma | Resolve a diferença entre o menu (7) e a lista (3) no Figma. |
| CRM mascarado no web (`CRM-RJ ••••`) | Mascarar no backend | O CRM não é dado sensível do paciente; a máscara é só de exibição, como no Figma. |
| Barra de título com botões de janela não é reproduzida | Reproduzir como no Figma | É da janela do sistema operacional, não da página. |
| `/` redireciona e a tela de abertura vira o carregamento | Manter a abertura como página | A spec pede abrir no login ou nas revisões. A marca continua aparecendo enquanto carrega. |

## Riscos

- **O backend precisa aceitar as mudanças de contrato** (login com CRM, UF e código, dados do médico e gov.br). Mitigação: o contrato muda na primeira tarefa e o PR marca a equipe do backend.
- **A fonte mock guarda dados em memória no servidor**, compartilhados entre todos que usam a mesma instância. É aceitável para demonstração. O README avisa.
- **Voltar pelo navegador depois de sair pode mostrar uma página guardada.** Mitigação: `Cache-Control: no-store` nas rotas internas e checagem da sessão em toda tela.
- **Falta de `SESSION_PASSWORD` derruba o login.** Mitigação: a variável vai para o `.env.example` e a aplicação mostra um erro claro ao iniciar sem ela.
- **A tela de abertura deixa de ser a página `/`.** O teste da spec 001 passa a testar o componente de abertura, que continua igual.
