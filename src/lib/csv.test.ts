import { expect, test } from "vitest";
import type { QueueEntry } from "@/lib/api/types";
import { buildQueueCsv, csvFileName } from "./csv";

const entry = (position: number, procedure: string): QueueEntry => ({
  position,
  justification: `Justificativa ${position}, com vírgula.`,
  lastPositionChangeAt: null,
  status: "none",
  patient: {
    id: `SOL-${position}`,
    name: "Fulana de Tal",
    cnsMasked: "***.****.****.1234",
    procedure,
    priority: "Alta",
    waitingSince: "2026-10-14",
  },
});

test("CSV tem BOM, cabeçalho, uma linha por paciente e a ordem recebida", () => {
  const csv = buildQueueCsv(
    [entry(1, "Catarata"), entry(2, "Hérnia")],
    new Date("2026-10-24T12:00:00"),
  );
  const lines = csv.replace("﻿", "").trim().split("\r\n");

  expect(csv.startsWith("﻿")).toBe(true);
  expect(lines).toHaveLength(3);
  expect(lines[0]).toBe(
    "solicitacao_id,posicao,justificativa,nome_paciente,procedimento,prioridade,espera_dias,data_entrada,ultima_alteracao",
  );
  expect(lines[1]).toBe(
    'SOL-1,1,"Justificativa 1, com vírgula.",Fulana de Tal,Catarata,Alta,10,2026-10-14,',
  );
  expect(lines[2].startsWith("SOL-2,2,")).toBe(true);
});

test("campos com separador, aspas ou quebra de linha não quebram as colunas", () => {
  const csv = buildQueueCsv([entry(1, 'Corte, "teste"\nlinha')]);

  expect(csv).toContain('"Corte, ""teste""\nlinha"');
});

test("tem as três colunas que o desafio exige, nas primeiras posições", () => {
  const header = buildQueueCsv([]).replace("﻿", "").split("\r\n")[0].split(",");
  expect(header.slice(0, 3)).toEqual(["solicitacao_id", "posicao", "justificativa"]);
});

test("fila vazia gera só o cabeçalho", () => {
  expect(buildQueueCsv([]).trim().split("\r\n")).toHaveLength(1);
});

test("nome do arquivo segue fila-sus-AAAA-MM-DD-HHmm.csv", () => {
  expect(csvFileName(new Date(2026, 9, 24, 9, 5))).toBe(
    "fila-sus-2026-10-24-0905.csv",
  );
});
