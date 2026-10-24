"use client";

import { useState } from "react";
import Link from "next/link";
import { Scale, ShieldCheck, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/chip";
import { ErrorNotice, Notice } from "@/components/notice";
import { PageHeader, SectionTitle } from "@/components/page-header";
import type { TribunalAgent } from "@/lib/api/types";
import { dataSource } from "@/lib/data";
import {
  daysSince,
  formatDay,
  formatTime,
  patientRef,
  ordinal,
} from "@/lib/format";
import { agentVerdict } from "@/lib/review";
import { useData } from "@/lib/use-data";
import { ApproveDialog, RejectDialog } from "./decision-dialogs";

const agentIcons: Record<TribunalAgent, typeof Scale> = {
  evidencias: Scale,
  contestacao: TriangleAlert,
  equidade: ShieldCheck,
};

const historyLabels: Record<string, string> = {
  approve: "Aprovou",
  reject: "Rejeitou",
  request_info: "Pediu informações",
  patient_reply: "Paciente respondeu",
  contest: "Contestou",
  contest_result: "Resultado da contestação",
  position_change: "Mudou a posição",
  queue_entry: "Entrou na fila",
  document_received: "Documento recebido",
  other: "Outro evento",
};

export function ProposalReview({ id }: { id: string }) {
  const {
    data: p,
    error,
    retry,
  } = useData(`proposal:${id}`, () => dataSource.getProposal(id));
  const [dialog, setDialog] = useState<"approve" | "reject">();

  if (error) return <ErrorNotice message={error} onRetry={retry} />;
  if (!p)
    return <p className="text-ink-secondary text-subtitle">Carregando…</p>;

  const decided = p.decidedBy && p.decidedAt;
  const elevation = p.equityChecks.find((c) => c.rule === "max_elevation");

  return (
    <>
      <PageHeader
        title="Revisão da proposta"
        subtitle={`${p.patient.name} · ${patientRef(p.patient.cnsMasked)} · ${p.patient.procedure}`}
      />

      <div className="grid items-start gap-3 sm:grid-cols-3">
        <Link href={`/revisoes/${p.id}/mudancas`}>
          <Indicator label="Prioridade" value={p.patient.priority}>
            Validada pela regulação. Ver o que mudou
          </Indicator>
        </Link>
        <Indicator
          label="Posição na fila"
          value={`${ordinal(p.currentPosition)} → ${ordinal(p.proposedPosition)}`}
        >
          {elevation?.detail ??
            `Diferença de ${Math.abs(p.currentPosition - p.proposedPosition)} posições`}
        </Indicator>
        <Indicator
          label="Tempo de espera"
          value={`${daysSince(p.patient.waitingSince)} dias`}
        >
          Desde {formatDay(p.patient.waitingSince)}
        </Indicator>
      </div>

      <section className="bg-brand-soft flex flex-col gap-1.5 rounded-[10px] px-5 py-[18px]">
        <h2 className="text-body text-brand font-semibold">
          Por que a IA propõe esta mudança
        </h2>
        <p className="text-subtitle text-subtle-foreground">
          {p.reasonSummary}
        </p>
      </section>

      <SectionTitle>Tribunal de IAs</SectionTitle>
      {p.tribunal.length === 0 && (
        <p className="text-ink-secondary text-subtitle pl-5">
          Nenhum parecer registrado para esta proposta.
        </p>
      )}
      {p.tribunal.map((o) => {
        const Icon = agentIcons[o.agent];
        const verdict = agentVerdict(o, p);
        return (
          <article
            key={o.agent}
            className="bg-card border-border flex flex-col gap-2.5 rounded-[10px] border p-4"
          >
            <div className="flex items-center gap-2.5">
              <Icon className="text-brand size-4" />
              <h3 className="text-body flex-1 font-semibold">{o.label}</h3>
              <Chip tone={verdict.tone}>{verdict.label}</Chip>
            </div>
            <p className="text-subtitle text-subtle-foreground">{o.opinion}</p>
          </article>
        );
      })}

      {p.equityChecks.length > 0 && (
        <>
          <SectionTitle>Regras de equidade</SectionTitle>
          <ul className="flex flex-col gap-2.5">
            {p.equityChecks.map((c) => (
              <li key={c.rule} className="text-note flex items-start gap-2.5">
                <Chip tone={c.passed ? "neutral" : "danger"}>
                  {c.passed ? "Cumpre" : "Não cumpre"}
                </Chip>
                <span className="text-subtle-foreground pt-1">
                  {c.label}. {c.detail}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}

      <SectionTitle>Evidências citadas</SectionTitle>
      {p.documents.length === 0 && (
        <p className="text-ink-secondary text-subtitle pl-5">
          Nenhum documento anexado.
        </p>
      )}
      <ul className="flex flex-col gap-4">
        {p.documents.map((d, i) => (
          <li key={d.id} className="flex items-start gap-2.5">
            <Chip tone="gray">E{i + 1}</Chip>
            <span className="text-note text-subtle-foreground pt-1">
              {d.title} · {formatDay(d.receivedAt)}
              {d.kind === "patient_statement" &&
                " (relato, não substitui exame)"}
              {d.summary && ` · ${d.summary}`}
            </span>
          </li>
        ))}
      </ul>

      {p.history.length > 0 && (
        <>
          <SectionTitle>Decisões anteriores deste paciente</SectionTitle>
          <ul className="flex flex-col gap-2">
            {p.history.map((h) => (
              <li key={h.id} className="text-note text-subtle-foreground">
                {formatDay(h.at)} · {formatTime(h.at)} ·{" "}
                {historyLabels[h.type] ?? h.type}
                {h.by && ` · ${h.by.name}`}
                {h.text && ` · ${h.text}`}
              </li>
            ))}
          </ul>
        </>
      )}

      {decided ? (
        <Notice title="Proposta já decidida" tone="warning">
          Esta proposta já foi decidida por {p.decidedBy!.name} em{" "}
          {formatDay(p.decidedAt!)} às {formatTime(p.decidedAt!)}.
        </Notice>
      ) : (
        p.status === "pending" && (
          <div className="flex flex-wrap justify-end gap-3">
            <Button
              variant="outline"
              size="desktop"
              className="text-destructive"
              onClick={() => setDialog("reject")}
            >
              Rejeitar
            </Button>
            <Button asChild variant="outline" size="desktop">
              <Link href={`/revisoes/${p.id}/pedir-informacoes`}>
                Pedir informações
              </Link>
            </Button>
            <Button size="desktop" onClick={() => setDialog("approve")}>
              Aprovar nova fila
            </Button>
          </div>
        )
      )}

      <ApproveDialog
        proposal={p}
        open={dialog === "approve"}
        onOpenChange={(open) => !open && setDialog(undefined)}
      />
      <RejectDialog
        proposal={p}
        open={dialog === "reject"}
        onOpenChange={(open) => !open && setDialog(undefined)}
      />
    </>
  );
}

function Indicator({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border-border flex flex-col gap-1 rounded-[10px] border px-[18px] py-4">
      <p className="text-note text-ink-secondary">{label}</p>
      <p className="text-title-3 font-semibold">{value}</p>
      <p className="text-note text-subtle-foreground">{children}</p>
    </div>
  );
}
