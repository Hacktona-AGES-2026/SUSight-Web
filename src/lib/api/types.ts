// Aliases dos schemas do contrato (docs/api/openapi.yaml).
// schema.ts é gerado por `pnpm api:types`; não edite à mão.
import type { components } from "./schema";

type Schemas = components["schemas"];

export type Error = Schemas["Error"];
export type AlreadyDecidedError = Schemas["AlreadyDecidedError"];
export type LoginRequest = Schemas["LoginRequest"];
export type Session = Schemas["Session"];
export type Doctor = Schemas["Doctor"];
export type Priority = Schemas["Priority"];
export type PatientSummary = Schemas["PatientSummary"];
export type ProposalStatus = Schemas["ProposalStatus"];
export type CriterionKey = Schemas["CriterionKey"];
export type Criterion = Schemas["Criterion"];
export type DocumentKind = Schemas["DocumentKind"];
export type SourceDocument = Schemas["SourceDocument"];
export type TribunalAgent = Schemas["TribunalAgent"];
export type TribunalOpinion = Schemas["TribunalOpinion"];
export type EquityCheck = Schemas["EquityCheck"];
export type HistoryEventType = Schemas["HistoryEventType"];
export type HistoryEvent = Schemas["HistoryEvent"];
export type ProposalSummary = Schemas["ProposalSummary"];
export type ProposalList = Schemas["ProposalList"];
export type ProposalDetail = Schemas["ProposalDetail"];
export type DecisionType = Schemas["DecisionType"];
export type DecisionRequest = Schemas["DecisionRequest"];
export type Decision = Schemas["Decision"];
export type QueueStatus = Schemas["QueueStatus"];
export type QueueEntry = Schemas["QueueEntry"];
export type QueueList = Schemas["QueueList"];
export type QueueEntryDetail = Schemas["QueueEntryDetail"];
export type ContestRequest = Schemas["ContestRequest"];
export type ExportRequest = Schemas["ExportRequest"];
export type ExportRecord = Schemas["ExportRecord"];
