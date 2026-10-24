"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/chip";
import { ErrorNotice } from "@/components/notice";
import { PageHeader } from "@/components/page-header";
import { Segmented } from "@/components/segmented";
import { SelectField, TextField } from "@/components/field";
import { FlashNotice } from "@/components/flash-notice";
import type { ProposalDetail, ProposalStatus } from "@/lib/api/types";
import { dataSource } from "@/lib/data";
import { patientRef, ordinal, relativeDays } from "@/lib/format";
import { hasReservations } from "@/lib/review";
import { useData } from "@/lib/use-data";

/**
 * ponytail: o resumo da lista não traz o veredito; busca o detalhe de cada
 * proposta (N+1). Trocar por um campo no ProposalSummary se a lista crescer.
 */
async function loadProposals(status: ProposalStatus) {
  const { items } = await dataSource.listProposals(status);
  return Promise.all(items.map((p) => dataSource.getProposal(p.id)));
}

export function PendingReviews() {
  const [tab, setTab] = useState<"pending" | "awaiting_patient">("pending");
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("");
  const [procedure, setProcedure] = useState("");
  const { data, error, loading, retry } = useData(`proposals:${tab}`, () =>
    loadProposals(tab),
  );

  const procedures = useMemo(
    () => [...new Set(data?.map((p) => p.patient.procedure))].sort(),
    [data],
  );
  const items = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data ?? []).filter(
      (p) =>
        (!q ||
          p.patient.name.toLowerCase().includes(q) ||
          p.patient.cnsMasked.includes(q)) &&
        (!priority || p.patient.priority === priority) &&
        (!procedure || p.patient.procedure === procedure),
    );
  }, [data, search, priority, procedure]);

  const subtitle =
    tab === "pending"
      ? `${data?.length ?? 0} ${data?.length === 1 ? "proposta da IA aguarda" : "propostas da IA aguardam"} sua decisão. Nada muda na fila até você aprovar.`
      : "Propostas pausadas até o paciente responder ao pedido.";

  return (
    <>
      <PageHeader title="Revisões pendentes" subtitle={subtitle} />
      <FlashNotice />
      <Segmented
        label="Lista"
        className="w-full max-w-[360px]"
        value={tab}
        onChange={setTab}
        options={[
          { value: "pending", label: "Pendentes" },
          { value: "awaiting_patient", label: "Aguardando paciente" },
        ]}
      />
      <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr]">
        <TextField
          label="Buscar por nome ou CNS"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <SelectField
          label="Prioridade"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="">Todas</option>
          <option>Alta</option>
          <option>Moderada</option>
          <option>Baixa</option>
        </SelectField>
        <SelectField
          label="Procedimento"
          value={procedure}
          onChange={(e) => setProcedure(e.target.value)}
        >
          <option value="">Todos</option>
          {procedures.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </SelectField>
      </div>

      {error && <ErrorNotice message={error} onRetry={retry} />}
      {loading && !error && (
        <p className="text-ink-secondary text-subtitle">Carregando…</p>
      )}
      {data && items.length === 0 && (
        <p className="text-ink-secondary text-subtitle">
          {data.length === 0
            ? tab === "pending"
              ? "Nenhuma revisão pendente."
              : "Nenhuma proposta aguardando o paciente."
            : "Nenhuma proposta encontrada com esses filtros."}
        </p>
      )}
      {items.map((p) => (
        <ReviewCard
          key={p.id}
          proposal={p}
          waiting={tab === "awaiting_patient"}
        />
      ))}
    </>
  );
}

function ReviewCard({
  proposal: p,
  waiting,
}: {
  proposal: ProposalDetail;
  waiting: boolean;
}) {
  const since =
    waiting && p.infoRequest ? p.infoRequest.requestedAt : p.createdAt;
  return (
    <article className="bg-card border-border flex items-center gap-4 rounded-[10px] border px-5 py-[18px]">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h2 className="text-body font-semibold">{p.patient.name}</h2>
        <p className="text-note text-ink-secondary">
          {patientRef(p.patient.cnsMasked)} · {p.patient.procedure}
        </p>
        <p className="text-subtitle text-subtle-foreground">
          {p.patient.priority} · {ordinal(p.currentPosition)} →{" "}
          {ordinal(p.proposedPosition)} · {waiting ? "pedido" : "aguardando"}{" "}
          {relativeDays(since)}
        </p>
        {waiting && p.infoRequest && (
          <p className="text-note text-ink-secondary">
            Pedido: {p.infoRequest.message}
          </p>
        )}
        <p className="text-note text-ink-secondary">{p.reasonSummary}</p>
      </div>
      {!waiting && (
        <Chip tone={hasReservations(p) ? "warning" : "neutral"}>
          {hasReservations(p) ? "Com ressalvas" : "Compatível"}
        </Chip>
      )}
      <Button asChild variant="outline" size="desktop">
        <Link href={`/revisoes/${p.id}`}>Revisar</Link>
      </Button>
    </article>
  );
}
