import type { ProposalDetail, TribunalOpinion } from "@/lib/api/types";

/** A contestação existe ou alguma regra de equidade falhou. */
export function hasReservations(p: ProposalDetail) {
  return (
    p.tribunal.some((o) => o.agent === "contestacao") ||
    p.equityChecks.some((c) => !c.passed)
  );
}

/** O contrato não traz veredito por agente; ele é derivado do parecer. */
export function agentVerdict(
  opinion: TribunalOpinion,
  p: ProposalDetail,
): { label: string; tone: "gray" | "warning" | "brand" | "danger" } {
  if (opinion.agent === "evidencias")
    return { label: "Favorável", tone: "gray" };
  if (opinion.agent === "contestacao")
    return { label: "Com ressalvas", tone: "warning" };
  return p.equityChecks.some((c) => !c.passed)
    ? { label: "Incompatível", tone: "danger" }
    : { label: "Compatível", tone: "brand" };
}
