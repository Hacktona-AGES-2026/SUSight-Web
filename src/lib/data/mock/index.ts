import type {
  AlreadyDecidedError,
  HistoryEvent,
  ProposalDetail,
  ProposalStatus,
  ProposalSummary,
  QueueEntry,
  QueueEntryDetail,
} from "@/lib/api/types";
import { ApiError } from "../errors";
import type { DataSource } from "../source";
import {
  demoCredentials,
  demoDoctor,
  proposals as proposalFixtures,
  queue as queueFixtures,
} from "./fixtures";

function toProposalSummary(p: ProposalDetail): ProposalSummary {
  return {
    id: p.id,
    status: p.status,
    patient: p.patient,
    currentPosition: p.currentPosition,
    proposedPosition: p.proposedPosition,
    reasonSummary: p.reasonSummary,
    createdAt: p.createdAt,
    infoRequest: p.infoRequest,
  };
}

function toQueueEntry(e: QueueEntryDetail): QueueEntry {
  return {
    position: e.position,
    patient: e.patient,
    lastPositionChangeAt: e.lastPositionChangeAt,
    status: e.status,
  };
}

/**
 * Fonte de demonstração em memória. Segue as mesmas regras do contrato
 * (erros, status e mensagens), sem depender do backend. Cada instância
 * começa com uma cópia nova das fixtures.
 */
export function createMockSource({
  persistSession = false,
}: { persistSession?: boolean } = {}): DataSource {
  const proposals = structuredClone(proposalFixtures);
  const queue = structuredClone(queueFixtures);
  // Com `persistSession`, recarregar a página não derruba o login de demonstração.
  const store =
    persistSession && typeof sessionStorage !== "undefined"
      ? sessionStorage
      : null;
  let signedIn = store?.getItem("mock-session") === "1";
  const setSignedIn = (value: boolean) => {
    signedIn = value;
    if (value) store?.setItem("mock-session", "1");
    else store?.removeItem("mock-session");
  };
  let nextId = 1;

  const newId = (prefix: string) => `${prefix}-${nextId++}`;
  const now = () => new Date().toISOString();

  function requireSession() {
    if (!signedIn) {
      throw new ApiError(401, {
        message: "Sua sessão expirou. Entre novamente.",
      });
    }
  }

  function findProposal(proposalId: string) {
    const proposal = proposals.find((p) => p.id === proposalId);
    if (!proposal) {
      throw new ApiError(404, { message: "Proposta não encontrada." });
    }
    return proposal;
  }

  function findQueueEntry(patientId: string) {
    const entry = queue.find((e) => e.patient.id === patientId);
    if (!entry) {
      throw new ApiError(404, { message: "Paciente não encontrado na fila." });
    }
    return entry;
  }

  return {
    async login({ identifier, password }) {
      if (
        identifier !== demoCredentials.identifier ||
        password !== demoCredentials.password
      ) {
        throw new ApiError(401, {
          message: "Não foi possível entrar. Confira os dados e tente de novo.",
        });
      }
      setSignedIn(true);
      return {
        token: "mock-token",
        expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
        doctor: demoDoctor,
      };
    },

    async logout() {
      setSignedIn(false);
    },

    async me() {
      requireSession();
      return demoDoctor;
    },

    async listProposals(status: ProposalStatus = "pending") {
      requireSession();
      const items = proposals
        .filter((p) => p.status === status)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
        .map(toProposalSummary);
      return { total: items.length, items };
    },

    async getProposal(proposalId) {
      requireSession();
      return findProposal(proposalId);
    },

    async decide(proposalId, { type, text }) {
      requireSession();
      const proposal = findProposal(proposalId);
      if (proposal.decidedBy && proposal.decidedAt) {
        const conflict: AlreadyDecidedError = {
          message: "Esta proposta já foi decidida.",
          decidedBy: proposal.decidedBy,
          decidedAt: proposal.decidedAt,
        };
        throw new ApiError(409, conflict);
      }
      if (type !== "approve" && !text?.trim()) {
        throw new ApiError(400, {
          message:
            type === "reject"
              ? "Informe o motivo da rejeição."
              : "Escreva a mensagem para o paciente.",
        });
      }

      const at = now();
      proposal.status =
        type === "approve"
          ? "approved"
          : type === "reject"
            ? "rejected"
            : "awaiting_patient";
      if (type === "request_info") {
        proposal.infoRequest = { message: text!, requestedAt: at };
      } else {
        proposal.decidedBy = demoDoctor;
        proposal.decidedAt = at;
      }
      proposal.history.push({
        id: newId("evt"),
        type,
        text,
        by: demoDoctor,
        at,
      });

      if (type === "approve") {
        const entry = findQueueEntry(proposal.patient.id);
        queue.splice(queue.indexOf(entry), 1);
        queue.splice(proposal.proposedPosition - 1, 0, entry);
        queue.forEach((e, index) => (e.position = index + 1));
        entry.lastPositionChangeAt = at;
        entry.status = "none";
      }

      return {
        id: newId("dec"),
        proposalId,
        type,
        text,
        by: demoDoctor,
        at,
      };
    },

    async getQueue() {
      requireSession();
      const items = queue.map(toQueueEntry);
      return { total: items.length, items };
    },

    async getQueueEntry(patientId) {
      requireSession();
      return findQueueEntry(patientId);
    },

    async contest(patientId, { justification }) {
      requireSession();
      const entry = findQueueEntry(patientId);
      if (!justification.trim()) {
        throw new ApiError(400, { message: "Escreva a justificativa." });
      }
      if (entry.status === "under_review") {
        throw new ApiError(409, {
          message: "Já existe uma contestação em andamento para este paciente.",
        });
      }
      entry.status = "under_review";
      const event: HistoryEvent = {
        id: newId("evt"),
        type: "contest",
        text: justification,
        by: demoDoctor,
        at: now(),
      };
      entry.history.push(event);
      return event;
    },

    async registerExport({ scope, rowCount }) {
      requireSession();
      return { id: newId("exp"), by: demoDoctor, at: now(), scope, rowCount };
    },
  };
}
