import type { QueueEntry } from "@/lib/api/types";
import { daysSince } from "./format";

// Ponto e vírgula e BOM: abre com acentos no Excel e no LibreOffice em português.
const SEPARATOR = ";";
const BOM = "﻿";

export const CSV_HEADER = [
  "posicao",
  "paciente_id",
  "procedimento",
  "prioridade",
  "espera_dias",
  "data_entrada",
  "ultima_alteracao",
];

function escapeField(value: string | number) {
  const text = String(value);
  return /[;"\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

/** Linhas do CSV (cabeçalho + uma por paciente), na ordem recebida. */
export function queueCsvRows(entries: QueueEntry[], now = new Date()) {
  return [
    CSV_HEADER,
    ...entries.map((e) => [
      e.position,
      e.patient.id,
      e.patient.procedure,
      e.patient.priority,
      daysSince(e.patient.waitingSince, now),
      e.patient.waitingSince,
      e.lastPositionChangeAt?.slice(0, 10) ?? "",
    ]),
  ].map((row) => row.map(escapeField).join(SEPARATOR));
}

export function buildQueueCsv(entries: QueueEntry[], now = new Date()) {
  return BOM + queueCsvRows(entries, now).join("\r\n") + "\r\n";
}

/** fila-sus-AAAA-MM-DD-HHmm.csv */
export function csvFileName(now = new Date()) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `fila-sus-${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}-${p(now.getHours())}${p(now.getMinutes())}.csv`;
}
