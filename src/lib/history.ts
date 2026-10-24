import type { HistoryEvent } from "@/lib/api/types";
import { ordinal } from "@/lib/format";

const titles: Record<HistoryEvent["type"], string> = {
  approve: "Fila aprovada",
  reject: "Proposta rejeitada",
  request_info: "Informações solicitadas",
  patient_reply: "Paciente respondeu",
  contest: "Contestação registrada",
  contest_result: "Resultado da contestação",
  position_change: "Posição alterada",
};

/** Rótulo curto da etiqueta de cada evento. */
export const eventTags: Record<HistoryEvent["type"], string> = {
  approve: "Decisão",
  reject: "Decisão",
  request_info: "Pedido",
  patient_reply: "Documento",
  contest: "Contestação",
  contest_result: "Contestação",
  position_change: "Posição",
};

export function eventTitle(e: HistoryEvent) {
  const range =
    e.fromPosition && e.toPosition
      ? ` (${ordinal(e.fromPosition)} → ${ordinal(e.toPosition)})`
      : "";
  return titles[e.type] + range;
}

export function eventDetail(e: HistoryEvent) {
  const by = e.by?.name ?? "Um profissional";
  switch (e.type) {
    case "approve":
      return `${by} aprovou a proposta da IA.`;
    case "reject":
      return `Motivo: ${e.text ?? "não informado"}. Devolvida à IA para reavaliação.`;
    case "request_info":
      return `${by} pediu ao paciente: ${e.text ?? ""}`;
    case "contest":
      return `${by} contestou a posição: ${e.text ?? ""}`;
    default:
      return e.text ?? "";
  }
}
