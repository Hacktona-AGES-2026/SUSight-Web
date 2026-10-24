# Plano: Login do médico

Spec: ./spec.md
Status: em revisão

## Abordagem

Tela `/login` e a splash em `/`. Toda tela interna fica sob o grupo de rotas `(app)`, cujo `AppShell` (componente cliente) pede `me()` à fonte de dados; sem sessão (401), `useData` leva ao login com `?expirou=1&next=<caminho>`. Depois de entrar, o `next` interno devolve o médico à tela onde estava. Sair chama `logout()` e usa `router.replace`, então o botão "voltar" não reabre telas internas (elas pedem sessão de novo).

## Dados e interfaces

- `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` pelo `DataSource` (`src/lib/data/source.ts`).
- `src/app/login/login-form.tsx`: campos CRM e UF, senha e código de verificação (só no layout; o contrato não o recebe). Mensagem do `ApiError` ou "Não foi possível conectar. Tente novamente." sem limpar o que foi digitado. Botão desabilitado durante o envio e rosa escuro quando CRM e senha estão preenchidos.
- `src/components/app-shell.tsx`: barra do topo com nome do app, médico e "Sair", e menu lateral.
- Modo mock: o login aceita qualquer identificador e senha preenchidos e a sessão sobrevive a recarregar a página (`sessionStorage`). Os testes usam a regra estrita (`demoCredentials`).

## Decisões

| Decisão | Alternativas consideradas | Motivo |
|---|---|---|
| Guarda de sessão no cliente (`AppShell`) | Middleware/proxy com cookie | A sessão do mock vive no navegador e a autenticação final está em aberto (spec, questões) |
| `next` só aceita caminho interno | Aceitar qualquer URL | Evita redirecionar para outro site |
| Sem botão "Entrar com gov.br" | Botão desabilitado, botão simulado | Integração não existe; a equipe preferiu tirar da tela |
| Mock aceita qualquer login | Exigir `CRM/RJ 52871` / `demo1234` | Sem backend, o acesso às telas não deve depender de credenciais |

## Riscos

- Mock aceitando qualquer login não pode vazar para `api`: a opção só vale para a instância usada pelas telas em modo mock.
- Código de verificação e gov.br dependem de decisão de autenticação (questões em aberto da spec).
