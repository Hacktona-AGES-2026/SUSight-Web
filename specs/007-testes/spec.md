# Spec: Testes do SUSight Clínica (médico desktop)

Issue: Hacktona-AGES-2026/SUSight#27
Status: rascunho

## Contexto

As telas do médico mudam a fila do SUS de pacientes reais. Um erro em aprovar, ordenar ou exportar prejudica quem espera cirurgia. Os critérios de aceite das specs 002 a 006, 008 e 009 precisam ser verificados automaticamente, sem depender de alguém testar à mão antes de cada PR.

## Comportamento esperado

- A pessoa desenvolvedora roda todos os testes com um comando, sem backend, usando os dados de demonstração.
- Cada critério de aceite das specs 002 a 006, 008 e 009 tem pelo menos um teste automatizado que o verifica, ou uma justificativa escrita de por que é verificado de outra forma.
- Existem testes de ponta a ponta para os fluxos principais, no navegador:
  1. entrar com CRM, ver revisões pendentes, abrir uma proposta, conferir "O que mudou" e aprovar;
  2. rejeitar escolhendo um motivo;
  3. pedir informações e ver a proposta sair das revisões pendentes;
  4. abrir a fila, contestar uma posição e ver o paciente "Em revisão";
  5. exportar a fila em CSV e conferir ordem e conteúdo do arquivo;
  6. enviar um documento para um paciente nos três passos;
  7. ver as decisões dos fluxos anteriores em "Decisões registradas".
- Regras com mais risco têm testes de unidade: mascaramento do CNS, validação de campos obrigatórios (motivos, mensagens e justificativas), limites de arquivo no envio de documento, geração do CSV (ordem, colunas, acentos, campos com vírgula e aspas) e bloqueio de decisão duplicada.
- Os testes rodam no mesmo ambiente que a aplicação usa em modo mock, seguindo o contrato da API (spec 001).
- O README explica como rodar cada tipo de teste.

## Critérios de aceite

- [ ] Um comando roda todos os testes sem backend e termina sem falhas.
- [ ] Os sete fluxos de ponta a ponta acima estão cobertos e passam.
- [ ] Mascaramento de CNS, campos obrigatórios, limites de arquivo, geração do CSV e decisão duplicada têm testes de unidade.
- [ ] Existe uma tabela ligando cada critério de aceite das specs 002 a 006, 008 e 009 ao teste que o cobre.
- [ ] Um teste de ponta a ponta verifica que nenhuma tela mostra o CNS completo.

## Fora do escopo

- Testes do backend, da IA e do tribunal.
- Testes de carga e desempenho.
- Testes contra a API real (podem entrar quando o backend estiver pronto).
- Meta de porcentagem de cobertura.

## Questões em aberto

- Os testes rodam em CI a cada PR? Depende de existir pipeline (fora da spec 001).
- Testes de acessibilidade básica (teclado, contraste) entram aqui ou em outra issue?
