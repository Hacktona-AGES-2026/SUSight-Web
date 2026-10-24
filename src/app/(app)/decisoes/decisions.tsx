"use client";

import { ErrorNotice } from "@/components/notice";
import { PageHeader } from "@/components/page-header";
import type { HistoryEvent, ProposalStatus } from "@/lib/api/types";
import { dataSource } from "@/lib/data";
import { formatDay, formatTime } from "@/lib/format";
import { eventDetail, eventTitle } from "@/lib/history";
import { useData } from "@/lib/use-data";
import { cn } from "@/lib/utils";

type Entry = HistoryEvent & { patient: string };

const markers: Partial<Record<HistoryEvent["type"], string>> = {
  approve: "bg-brand",
  reject: "bg-line-strong",
  request_info: "bg-primary",
  contest: "bg-brand",
};

const statuses: ProposalStatus[] = [
  "pending",
  "awaiting_patient",
  "approved",
  "rejected",
];

/**
 * ponytail: não há endpoint de decisões; junta o histórico das propostas e das
 * contestações em andamento (N+1). Trocar por GET /decisions quando existir.
 */
async function loadDecisions(): Promise<Entry[]> {
  const [lists, queue] = await Promise.all([
    Promise.all(statuses.map((s) => dataSource.listProposals(s))),
    dataSource.getQueue(),
  ]);
  const proposals = await Promise.all(
    lists.flatMap((l) => l.items).map((p) => dataSource.getProposal(p.id)),
  );
  const contested = await Promise.all(
    queue.items
      .filter((e) => e.status === "under_review")
      .map((e) => dataSource.getQueueEntry(e.patient.id)),
  );
  return [
    ...proposals.map((p) => ({ patient: p.patient.name, history: p.history })),
    ...contested.map((e) => ({ patient: e.patient.name, history: e.history })),
  ]
    .flatMap(({ patient, history }) => history.map((h) => ({ ...h, patient })))
    .sort((a, b) => b.at.localeCompare(a.at));
}

export function Decisions() {
  const { data, error, loading, retry } = useData("decisions", loadDecisions);

  return (
    <>
      <PageHeader
        title="Decisões registradas"
        subtitle="Histórico auditável: quem decidiu, quando e por quê."
      />
      {error && <ErrorNotice message={error} onRetry={retry} />}
      {loading && !error && (
        <p className="text-ink-secondary text-subtitle">Carregando…</p>
      )}
      {data && data.length === 0 && (
        <p className="text-ink-secondary text-subtitle">
          Nenhuma decisão registrada ainda.
        </p>
      )}
      {data && data.length > 0 && (
        <ul className="bg-card border-border flex flex-col rounded-[10px] border py-1">
          {data.map((e) => (
            <li key={e.id} className="flex items-start gap-3.5 px-4 py-3">
              <span
                aria-hidden
                className={cn(
                  "mt-[5px] size-3 shrink-0 rounded-full",
                  markers[e.type] ?? "bg-brand-medium",
                )}
              />
              <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                <p className="text-subtitle font-semibold">
                  {eventTitle(e)} · {e.patient}
                </p>
                <p className="text-note text-ink-secondary">{eventDetail(e)}</p>
              </div>
              <time
                dateTime={e.at}
                className="text-note text-ink-secondary whitespace-nowrap"
              >
                {formatDay(e.at)} · {formatTime(e.at)}
              </time>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
