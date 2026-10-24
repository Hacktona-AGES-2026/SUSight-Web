import type {
  Criterion,
  CriterionKey,
  HistoryEvent,
  HistoryEventType,
  PatientSummary,
  Priority,
  ProposalDetail,
  ProposalStatus,
  ProposalSummary,
  QueueEntry,
  QueueEntryDetail,
  SourceDocument,
  TribunalAgent,
} from "@/lib/api/types";

// Formatos do SUSight-Backend (docs/backend-api.md). Só os campos que usamos.
export type BackendQueueRow = {
  solicitacao_id: string;
  paciente_id?: string | null;
  cid: string;
  dias_em_fila: number;
  posicao: number;
  justificativa?: string;
  criterios?: Record<string, number> | null;
  prioridade_regulacao?: string | null;
  nome?: string | null;
  procedimento?: string | null;
  municipio?: string | null;
  em_reavaliacao?: boolean;
};

export type BackendProposalSummary = {
  proposta_id: string;
  solicitacao_id: string;
  situacao: string;
  posicao_atual: number | null;
  posicao_proposta: number;
  recomendacao: string | null;
  ordenacao_incerta: boolean;
  evidencias_conflitantes: boolean;
  criada_em: string;
};

export type BackendEvidence = {
  evidencia_id: string;
  tipo: string;
  resultado: string;
  data: string;
  trecho: string;
};

export type BackendProposalDetail = BackendProposalSummary & {
  criterios: Record<string, number> | null;
  evidencias: BackendEvidence[];
  parecer: {
    recomendacao: string;
    posicao: number;
    travas: string[];
    manifestacoes: {
      agente: TribunalAgent;
      veredito: "a_favor" | "contra" | "ajustar";
      justificativa: string;
    }[];
  } | null;
  historico: BackendEvent[];
  decisao: {
    acao: string;
    motivo: string | null;
    responsavel: string;
    data_hora: string;
  } | null;
};

export type BackendEvent = {
  tipo: string;
  texto: string;
  responsavel: string;
  motivo: string | null;
  data_hora: string;
};

/** Situação do contrato do web ↔ situação do backend. */
export const statusToBackend: Record<ProposalStatus, string> = {
  pending: "pronta_para_medico",
  awaiting_patient: "pedir_informacoes",
  approved: "aprovar",
  rejected: "rejeitar",
};

export function statusFromBackend(situacao: string): ProposalStatus {
  const found = Object.entries(statusToBackend).find(([, v]) => v === situacao);
  return (found?.[0] as ProposalStatus | undefined) ?? "pending";
}

const procedures: Record<string, string> = {
  K40: "Hérnia inguinal",
  K80: "Colecistectomia",
  H25: "Catarata",
  M17: "Artroplastia de joelho",
};

const priorities: Record<string, Priority> = {
  Alta: "Alta",
  Moderada: "Moderada",
  Média: "Moderada",
  Baixa: "Baixa",
};

/** Nome e procedimento vêm da fila quando foram importados; sem eles, o caso é a solicitação. */
export function patientFromRow(
  row: BackendQueueRow,
  now = new Date(),
): PatientSummary {
  const waiting = new Date(now.getTime() - row.dias_em_fila * 86_400_000);
  return {
    id: row.solicitacao_id,
    name: row.nome ?? `Paciente ${row.paciente_id ?? row.solicitacao_id}`,
    cnsMasked: `Solicitação ${row.solicitacao_id}`,
    procedure:
      row.procedimento ?? procedures[row.cid.slice(0, 3)] ?? `CID ${row.cid}`,
    priority: priorities[row.prioridade_regulacao ?? ""] ?? "Moderada",
    waitingSince: waiting.toISOString().slice(0, 10),
  };
}

const criterionMeta: Record<
  string,
  { key: CriterionKey; label: string; format: (v: number) => string }
> = {
  limitacao: {
    key: "limitacao_funcional",
    label: "Limitação funcional",
    format: (v) => `nível ${v}`,
  },
  asa: { key: "asa", label: "ASA", format: (v) => `ASA ${v}` },
  dor: { key: "dor", label: "Dor", format: (v) => `${v}/10` },
  comorbidades: {
    key: "comorbidades",
    label: "Comorbidades",
    format: (v) => `${v}`,
  },
  deterioracao: {
    key: "deterioracao",
    label: "Deterioração",
    format: (v) => `nível ${v}`,
  },
  distancia: {
    key: "socioeconomico",
    label: "Distância do hospital",
    format: (v) => `${v} km`,
  },
};

export function criteriaFrom(
  criterios?: Record<string, number> | null,
): Criterion[] {
  return Object.entries(criterios ?? {}).flatMap(([name, value]) => {
    const meta = criterionMeta[name];
    return meta
      ? [
          {
            key: meta.key,
            label: meta.label,
            value: meta.format(value),
            previousValue: null,
          },
        ]
      : [];
  });
}

const eventTypes: Record<string, HistoryEventType> = {
  entrada_na_fila: "queue_entry",
  documento_recebido: "document_received",
  posicao_alterada: "position_change",
  proposta_rejeitada: "reject",
  informacao_solicitada: "request_info",
  contestacao: "contest",
  reavaliacao_concluida: "contest_result",
};

export function eventFrom(e: BackendEvent): HistoryEvent {
  return {
    id: `${e.tipo}-${e.data_hora}`,
    type: eventTypes[e.tipo] ?? "other",
    text: e.motivo ? `${e.texto} Motivo: ${e.motivo}` : e.texto,
    by: { id: e.responsavel, name: e.responsavel },
    at: e.data_hora,
  };
}

const recommendation: Record<string, string> = {
  aprovar: "O tribunal recomenda aprovar a mudança.",
  negar: "O tribunal recomenda manter a posição.",
  ajustar: "O tribunal sugere ajustar a posição.",
};

export function summaryFrom(
  p: BackendProposalSummary,
  row: BackendQueueRow | undefined,
  now = new Date(),
): ProposalSummary {
  return {
    id: p.proposta_id,
    status: statusFromBackend(p.situacao),
    patient: patientFromRow(
      row ?? {
        solicitacao_id: p.solicitacao_id,
        cid: "",
        dias_em_fila: 0,
        posicao: 0,
      },
      now,
    ),
    currentPosition: p.posicao_atual ?? row?.posicao ?? 1,
    proposedPosition: p.posicao_proposta,
    reasonSummary:
      (p.recomendacao && recommendation[p.recomendacao]) ??
      "Proposta aguardando análise do tribunal.",
    createdAt: p.criada_em,
  };
}

const evidenceKinds: Record<string, SourceDocument["kind"]> = {
  relato: "patient_statement",
  biopsia: "exam",
  exame_imagem: "exam",
};

const labels: Record<TribunalAgent, string> = {
  evidencias: "A favor de subir",
  contestacao: "A favor de descer",
  equidade: "Imparcial",
  juiz: "Juiz",
};

function pretty(text: string) {
  return text.replaceAll("_", " ").replace(/^./, (c) => c.toUpperCase());
}

export function detailFrom(
  p: BackendProposalDetail,
  row: BackendQueueRow | undefined,
  now = new Date(),
): ProposalDetail {
  const decided = p.decisao && p.decisao.acao !== "cancelar" ? p.decisao : null;
  return {
    ...summaryFrom(p, row, now),
    proposedPosition: p.parecer?.posicao ?? p.posicao_proposta,
    criteria: criteriaFrom(p.criterios ?? row?.criterios),
    documents: p.evidencias.map((e) => ({
      id: e.evidencia_id,
      kind: evidenceKinds[e.tipo] ?? "report",
      title: `${pretty(e.tipo)} · ${e.resultado}`,
      receivedAt: `${e.data}T00:00:00`,
      summary: e.trecho,
    })),
    tribunal: (p.parecer?.manifestacoes ?? []).map((m) => ({
      agent: m.agente,
      label: labels[m.agente],
      opinion: m.justificativa,
      verdict: m.veredito,
    })),
    equityChecks: (p.parecer?.travas ?? []).map((t) => ({
      rule: t.startsWith("limite_elevacao")
        ? "max_elevation"
        : "no_overtake_higher_priority",
      label: "Trava aplicada",
      passed: false,
      detail: pretty(t),
    })),
    history: p.historico.map(eventFrom),
    ...(decided && {
      decidedBy: { id: decided.responsavel, name: decided.responsavel },
      decidedAt: decided.data_hora,
    }),
  };
}

export function entryFrom(
  row: BackendQueueRow,
  hasProposal: boolean,
  now = new Date(),
): QueueEntry {
  return {
    position: row.posicao,
    patient: patientFromRow(row, now),
    justification: row.justificativa || undefined,
    lastPositionChangeAt: null,
    status: row.em_reavaliacao
      ? "under_review"
      : hasProposal
        ? "pending_proposal"
        : "none",
  };
}

export function entryDetailFrom(
  row: BackendQueueRow,
  hasProposal: boolean,
  events: BackendEvent[],
  now = new Date(),
): QueueEntryDetail {
  const changed = events.find((e) => e.tipo === "posicao_alterada");
  return {
    ...entryFrom(row, hasProposal, now),
    lastPositionChangeAt: changed?.data_hora ?? null,
    criteria: criteriaFrom(row.criterios),
    justification:
      row.justificativa || "Posição definida pela pontuação clínica.",
    history: events.map(eventFrom),
  };
}
