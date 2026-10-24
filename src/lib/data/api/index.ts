import type { Doctor, HistoryEvent } from "@/lib/api/types";
import { ApiError } from "../errors";
import type { DataSource } from "../source";
import {
  type BackendEvent,
  type BackendProposalDetail,
  type BackendProposalSummary,
  type BackendQueueRow,
  detailFrom,
  entryDetailFrom,
  entryFrom,
  statusToBackend,
  summaryFrom,
} from "./map";

type ApiSourceOptions = { baseUrl: string };

const SESSION_KEY = "susight-session";
const IDLE_MS = 30 * 60 * 1000;

type Stored = { token: string; doctor: Doctor };

function readSession(): Stored | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Stored) : null;
  } catch {
    return null;
  }
}

const expired = () =>
  new ApiError(401, { message: "Sua sessão expirou. Entre novamente." });

/** Mensagem legível a partir do corpo de erro do FastAPI (`detail`). */
function messageOf(body: unknown, fallback: string) {
  const detail = (body as { detail?: unknown } | null)?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && typeof detail[0]?.msg === "string") {
    return detail[0].msg as string;
  }
  return fallback;
}

/**
 * Fonte que chama o SUSight-Backend pelas rotas dele (docs/backend-api.md) e as
 * traduz para o contrato do web. O backend não traz nome, CNS nem procedimento:
 * ver `./map.ts`.
 */
export function createApiSource({ baseUrl }: ApiSourceOptions): DataSource {
  async function raw(
    method: string,
    path: string,
    body?: unknown,
    auth = true,
  ) {
    const headers: Record<string, string> = { Accept: "application/json" };
    if (auth) {
      const session = readSession();
      if (!session) throw expired();
      headers.Authorization = `Bearer ${session.token}`;
    }
    if (body !== undefined) headers["Content-Type"] = "application/json";

    let response: Response;
    try {
      response = await fetch(`${baseUrl}${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch {
      throw new ApiError(0, {
        message: "Não foi possível conectar. Tente novamente.",
      });
    }
    if (response.status === 401 && auth) {
      sessionStorage.removeItem(SESSION_KEY);
      throw expired();
    }
    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      throw new ApiError(response.status, {
        message: messageOf(errorBody, "Algo deu errado. Tente novamente."),
      });
    }
    return response;
  }

  const json = async <T>(method: string, path: string, body?: unknown) =>
    (await raw(method, path, body)).json() as Promise<T>;

  const queue = async () =>
    (await json<{ pacientes: BackendQueueRow[] }>("GET", "/fila")).pacientes;

  const ready = async () =>
    (
      await json<{ propostas: BackendProposalSummary[] }>(
        "GET",
        `/propostas?situacao=${statusToBackend.pending}`,
      )
    ).propostas;

  const doctor = () => {
    const session = readSession();
    if (!session) throw expired();
    return session.doctor;
  };

  return {
    async login({ identifier, password }) {
      let response: Response;
      try {
        response = await fetch(`${baseUrl}/sessoes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identificador: identifier.trim(),
            senha: password,
          }),
        });
      } catch {
        throw new ApiError(0, {
          message: "Não foi possível conectar. Tente novamente.",
        });
      }
      if (!response.ok) {
        throw new ApiError(response.status, {
          message:
            response.status === 429
              ? "Muitas tentativas. Tente novamente mais tarde."
              : "Não foi possível entrar. Confira os dados e tente de novo.",
        });
      }
      const { token } = (await response.json()) as { token: string };
      const who: Doctor = { id: identifier.trim(), name: identifier.trim() };
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ token, doctor: who }),
      );
      return {
        token,
        expiresAt: new Date(Date.now() + IDLE_MS).toISOString(),
        doctor: who,
      };
    },

    async logout() {
      try {
        await raw("DELETE", "/sessoes");
      } finally {
        sessionStorage.removeItem(SESSION_KEY);
      }
    },

    async me() {
      return doctor();
    },

    async listProposals(status = "pending") {
      const [rows, found] = await Promise.all([
        queue(),
        json<{ propostas: BackendProposalSummary[] }>(
          "GET",
          `/propostas?situacao=${statusToBackend[status]}`,
        ),
      ]);
      const bySid = new Map(rows.map((r) => [r.solicitacao_id, r]));
      const items = found.propostas.map((p) =>
        summaryFrom(p, bySid.get(p.solicitacao_id)),
      );
      return { total: items.length, items };
    },

    async getProposal(proposalId) {
      const p = await json<BackendProposalDetail>(
        "GET",
        `/propostas/${encodeURIComponent(proposalId)}`,
      );
      const row = (await queue()).find(
        (r) => r.solicitacao_id === p.solicitacao_id,
      );
      return detailFrom(p, row);
    },

    async decide(proposalId, { type, text, exams }) {
      const me = doctor();
      const acao = {
        approve: "aprovar",
        reject: "rejeitar",
        request_info: "pedir_informacoes",
      }[type];
      const body: Record<string, unknown> = {
        medico: me.name,
        acao,
        motivo: text ?? "",
      };
      if (type === "request_info") {
        body.exames = (exams?.length ? exams : [text ?? ""]).map((exame) => ({
          exame,
          explicacao: (text ?? "").slice(0, 500),
        }));
      }
      await json(
        "POST",
        `/propostas/${encodeURIComponent(proposalId)}/decisao`,
        body,
      );
      return {
        id: `${proposalId}-${type}`,
        proposalId,
        type,
        text,
        by: me,
        at: new Date().toISOString(),
      };
    },

    async getQueue() {
      const [rows, proposals] = await Promise.all([queue(), ready()]);
      const withProposal = new Set(proposals.map((p) => p.solicitacao_id));
      const items = rows.map((r) =>
        entryFrom(r, withProposal.has(r.solicitacao_id)),
      );
      return { total: items.length, items };
    },

    async getQueueEntry(patientId) {
      const [rows, proposals] = await Promise.all([queue(), ready()]);
      const row = rows.find((r) => r.solicitacao_id === patientId);
      if (!row)
        throw new ApiError(404, {
          message: "Paciente não encontrado na fila.",
        });
      const { eventos } = await json<{ eventos: BackendEvent[] }>(
        "GET",
        `/solicitacoes/${encodeURIComponent(patientId)}/historico`,
      ).catch((e: unknown) => {
        if (e instanceof ApiError && e.status === 404) return { eventos: [] };
        throw e;
      });
      return entryDetailFrom(
        row,
        proposals.some((p) => p.solicitacao_id === patientId),
        eventos,
      );
    },

    async contest(patientId, { justification }) {
      await json(
        "POST",
        `/solicitacoes/${encodeURIComponent(patientId)}/contestacao`,
        {
          motivo: justification,
        },
      );
      const event: HistoryEvent = {
        id: `contest-${patientId}`,
        type: "contest",
        text: justification,
        by: doctor(),
        at: new Date().toISOString(),
      };
      return event;
    },

    async registerExport({ scope, rowCount }) {
      // O backend registra o export quando o CSV oficial é pedido.
      await raw("GET", "/fila/exportacao.csv");
      return {
        id: `exp-${Date.now()}`,
        by: doctor(),
        at: new Date().toISOString(),
        scope,
        rowCount,
      };
    },
  };
}
