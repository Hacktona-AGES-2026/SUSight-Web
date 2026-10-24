# Plano: Exportar fila ordenada em CSV

Spec: ./spec.md
Status: em revisão

## Abordagem

`/exportar` monta o CSV no navegador a partir de `getQueue()`, mostra a prévia das primeiras linhas, baixa o arquivo e registra o export com `registerExport({ scope, rowCount })`.

## Dados e interfaces

- `src/lib/csv.ts`: `buildQueueCsv`, `queueCsvRows`, `csvFileName`. Separador `;`, BOM UTF-8 e quebras `\r\n` para abrir com acentos no Excel e no LibreOffice em português. Campos com `;`, aspas ou quebra de linha vão entre aspas.
- Colunas: `posicao`, `paciente_id`, `procedimento`, `prioridade`, `espera_dias`, `data_entrada`, `ultima_alteracao` (sem CNS; sem pontuação, que o contrato não traz).
- Nome do arquivo `fila-sus-AAAA-MM-DD-HHmm.csv`.
- `export-queue.tsx`: formato CSV (PDF aparece desativado), aviso "Só a fila aprovada", fila vazia gera só o cabeçalho com aviso.
- Testes em `src/lib/csv.test.ts`.

## Decisões

| Decisão | Alternativas consideradas | Motivo |
|---|---|---|
| Ponto e vírgula + BOM | Vírgula | Excel em português abre melhor |
| Identificador do paciente em vez do CNS | CNS mascarado | LGPD; decisão da organização do hackathon ainda em aberto |
| Gerar no web | Gerar no backend | Mock sem backend; se o arquivo oficial vier do backend, o web só baixa |

## Riscos

- Colunas e formato exigidos pela organização podem diferir; ajustar `CSV_HEADER`.
- Sem filtros nesta tela, o export é sempre completo; a pergunta "completa ou recorte" fica para quando a fila repassar filtros.
