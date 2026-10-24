"use client";

import { useState } from "react";
import Link from "next/link";
import { useDoctor } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Chip, priorityTone } from "@/components/chip";
import { ErrorNotice, Notice } from "@/components/notice";
import type { HistoryEvent } from "@/lib/api/types";
import { dataSource } from "@/lib/data";
import {
  daysSince,
  formatDate,
  formatDay,
  formatTime,
  patientRef,
  ordinal,
} from "@/lib/format";
import { eventDetail, eventTags, eventTitle } from "@/lib/history";
import { useData } from "@/lib/use-data";
import { RemoveDialog } from "./remove-dialog";

type TimelineItem = {
  key: string;
  at: string;
  time: boolean;
  title: string;
  detail: string;
  tag: string;
  tagTone?: "gray" | "brand" | "danger";
};

// ponytail: remover/restaurar ainda não existem no contrato da API (docs/api/openapi.yaml);
// o estado vale só nesta tela até o endpoint existir.
type Removal = { reason: string; note: string; at: string; by: string };

function timeline(
  history: HistoryEvent[],
  enteredAt: string,
  removal?: Removal,
): TimelineItem[] {
  const items: TimelineItem[] = [
    ...history.map((e) => ({
      key: e.id,
      at: e.at,
      time: true,
      title: eventTitle(e),
      detail: eventDetail(e),
      tag: eventTags[e.type],
      tagTone: "gray" as const,
    })),
    {
      key: "entrada",
      at: enteredAt,
      time: false,
      title: "Entrou na fila",
      detail: "Entrada na fila de cirurgias.",
      tag: "Entrada",
      tagTone: "brand" as const,
    },
  ].sort((a, b) => b.at.localeCompare(a.at));
  if (removal) {
    items.unshift({
      key: "saida",
      at: removal.at,
      time: true,
      title: "Saiu da fila",
      detail: `${removal.reason} · removida por ${removal.by}`,
      tag: "Saída",
      tagTone: "danger",
    });
  }
  return items;
}

export function QueueEntryView({ id }: { id: string }) {
  const doctor = useDoctor();
  const {
    data: entry,
    error,
    retry,
  } = useData(`entry:${id}`, () => dataSource.getQueueEntry(id));
  const { data: pending } = useData("proposals:pending-list", () =>
    dataSource.listProposals(),
  );
  const proposalSummary = pending?.items.find((p) => p.patient.id === id);
  const { data: proposal } = useData(
    `proposal:${proposalSummary?.id ?? "-"}`,
    async () =>
      proposalSummary ? dataSource.getProposal(proposalSummary.id) : null,
  );
  const [removal, setRemoval] = useState<Removal>();
  const [removing, setRemoving] = useState(false);

  if (error) return <ErrorNotice message={error} onRetry={retry} />;
  if (!entry)
    return <p className="text-ink-secondary text-subtitle">Carregando…</p>;

  const { patient } = entry;
  const items = timeline(entry.history, patient.waitingSince, removal);

  return (
    <>
      <Link href="/fila" className="text-brand text-sm font-semibold">
        ← Fila do SUS
      </Link>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-title-page font-bold">{patient.name}</h1>
          <p className="text-subtitle text-ink-secondary">
            {patientRef(patient.cnsMasked)} · {patient.procedure}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {removal ? (
            <Chip tone="danger">Fora da fila</Chip>
          ) : (
            <>
              <Chip tone="brand" className="bg-brand-highlight font-semibold">
                {ordinal(entry.position)} na fila
              </Chip>
              <Chip tone={priorityTone[patient.priority]}>
                {patient.priority}
              </Chip>
              {entry.status === "pending_proposal" && (
                <Chip tone="brand">Proposta</Chip>
              )}
              {entry.status === "under_review" && (
                <Chip tone="warning">Em reavaliação</Chip>
              )}
            </>
          )}
        </div>
      </header>

      {removal && (
        <Notice title="Fora da fila" tone="danger">
          Removida da fila em {formatDay(removal.at)}, {formatTime(removal.at)}{" "}
          · {removal.reason} · por {removal.by}
          {removal.note && ` · ${removal.note}`}
        </Notice>
      )}

      <div className="grid items-start gap-5 lg:grid-cols-[1fr_250px]">
        <div className="flex min-w-0 flex-col gap-5">
          <Card title="Resumo">
            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Datum
                label="Posição"
                value={removal ? "—" : ordinal(entry.position)}
              />
              <Datum
                label="Espera"
                value={`${daysSince(patient.waitingSince)} dias`}
              />
              <Datum label="Prioridade" value={patient.priority} />
              <Datum label="Entrada" value={formatDate(patient.waitingSince)} />
            </dl>
          </Card>

          <Card title="Por que está nesta posição">
            <p className="text-subtitle text-subtle-foreground">
              {entry.justification}
            </p>
            {entry.criteria.length > 0 && (
              <ul className="text-note text-subtle-foreground flex flex-col gap-1">
                {entry.criteria.map((c) => (
                  <li key={c.key}>
                    <span className="font-semibold">{c.label}:</span> {c.value}
                    {c.previousValue && ` (antes: ${c.previousValue})`}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Histórico de movimentação">
            <ol>
              {items.map((i) => (
                <li
                  key={i.key}
                  className="border-border flex gap-4 border-b py-3 last:border-b-0"
                >
                  <div className="w-[88px] shrink-0">
                    <p className="text-sm font-semibold">{formatDay(i.at)}</p>
                    {i.time && (
                      <p className="text-note text-ink-secondary">
                        {formatTime(i.at)}
                      </p>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{i.title}</p>
                    <p className="text-note text-ink-secondary">{i.detail}</p>
                  </div>
                  <Chip tone={i.tagTone}>{i.tag}</Chip>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card title="Ações">
            {removal ? (
              <>
                <p className="text-ink-secondary text-sm">
                  A ficha está fora da fila. O histórico continua disponível.
                </p>
                <Button variant="outline" onClick={() => setRemoval(undefined)}>
                  Restaurar na fila
                </Button>
              </>
            ) : (
              <>
                {proposalSummary && (
                  <>
                    <Button asChild>
                      <Link href={`/revisoes/${proposalSummary.id}`}>
                        Revisar proposta
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link
                        href={`/revisoes/${proposalSummary.id}/pedir-informacoes`}
                      >
                        Pedir informações
                      </Link>
                    </Button>
                  </>
                )}
                {entry.status !== "under_review" && (
                  <Button asChild variant="outline">
                    <Link href={`/fila/contestar?paciente=${patient.id}`}>
                      Contestar posição
                    </Link>
                  </Button>
                )}
                <hr className="border-border" />
                <Button
                  variant="outline"
                  className="border-destructive-dot text-destructive"
                  onClick={() => setRemoving(true)}
                >
                  Remover da fila
                </Button>
              </>
            )}
          </Card>

          <Card title="Documentos">
            {proposal && proposal.documents.length > 0 ? (
              <ul className="flex flex-col gap-3">
                {proposal.documents.map((d) => (
                  <li key={d.id}>
                    <p className="text-sm font-semibold">{d.title}</p>
                    <p className="text-note text-ink-secondary">
                      {formatDay(d.receivedAt)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-note text-ink-secondary">Nenhum documento.</p>
            )}
          </Card>
        </div>
      </div>

      <RemoveDialog
        open={removing}
        onOpenChange={setRemoving}
        summary={`${patient.name} · ${ordinal(entry.position)} · ${patient.procedure}`}
        onConfirm={(reason, note) => {
          setRemoval({
            reason,
            note,
            at: new Date().toISOString(),
            by: doctor.name,
          });
          setRemoving(false);
        }}
      />
    </>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-background border-border flex flex-col gap-3.5 rounded-[10px] border px-5 py-[18px]">
      <h2 className="text-base font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Datum({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-note text-ink-secondary">{label}</dt>
      <dd className="text-base font-semibold">{value}</dd>
    </div>
  );
}
