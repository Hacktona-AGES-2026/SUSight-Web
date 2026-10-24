import type {
  ContestRequest,
  Decision,
  DecisionRequest,
  Doctor,
  ExportRecord,
  ExportRequest,
  HistoryEvent,
  LoginRequest,
  ProposalDetail,
  ProposalList,
  ProposalStatus,
  QueueEntryDetail,
  QueueList,
  Session,
} from "@/lib/api/types";

/**
 * Acesso único aos dados do SUSight Clínica. As telas só conhecem esta
 * interface; a fonte (mock ou API) é escolhida em `./index.ts`.
 * Cada método corresponde a uma rota de docs/api/openapi.yaml.
 */
export interface DataSource {
  /** POST /auth/login */
  login(body: LoginRequest): Promise<Session>;
  /** POST /auth/logout */
  logout(): Promise<void>;
  /** GET /auth/me */
  me(): Promise<Doctor>;
  /** GET /proposals (padrão: `pending`) */
  listProposals(status?: ProposalStatus): Promise<ProposalList>;
  /** GET /proposals/{proposalId} */
  getProposal(proposalId: string): Promise<ProposalDetail>;
  /** POST /proposals/{proposalId}/decision */
  decide(proposalId: string, body: DecisionRequest): Promise<Decision>;
  /** GET /queue */
  getQueue(): Promise<QueueList>;
  /** GET /queue/{patientId} */
  getQueueEntry(patientId: string): Promise<QueueEntryDetail>;
  /** POST /queue/{patientId}/contest */
  contest(patientId: string, body: ContestRequest): Promise<HistoryEvent>;
  /** POST /exports */
  registerExport(body: ExportRequest): Promise<ExportRecord>;
}
