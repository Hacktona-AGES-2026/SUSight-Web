"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Chip, priorityTone, type ChipTone } from "@/components/chip";
import { ErrorNotice } from "@/components/notice";
import { FlashNotice } from "@/components/flash-notice";
import { PageHeader } from "@/components/page-header";
import { Segmented } from "@/components/segmented";
import { SelectField, TextField } from "@/components/field";
import type { QueueStatus } from "@/lib/api/types";
import { dataSource } from "@/lib/data";
import {
  daysSince,
  formatDay,
  formatTime,
  maskCns,
  ordinal,
} from "@/lib/format";
import { useData } from "@/lib/use-data";

type Tab = "all" | "pending_proposal" | "under_review";

const statusChip: Record<QueueStatus, { label: string; tone: ChipTone }> = {
  none: { label: "Em dia", tone: "neutral" },
  pending_proposal: { label: "Proposta", tone: "brand" },
  under_review: { label: "Em reavaliação", tone: "warning" },
};

export function QueueTable() {
  const { data, error, loading, retry } = useData("queue", () =>
    dataSource.getQueue(),
  );
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("");
  const [procedure, setProcedure] = useState("");

  const procedures = useMemo(
    () => [...new Set(data?.items.map((e) => e.patient.procedure))].sort(),
    [data],
  );
  // Filtrar não muda a posição: ela vem de `entry.position`, não do índice.
  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data?.items ?? []).filter(
      (e) =>
        (tab === "all" || e.status === tab) &&
        (!q ||
          e.patient.name.toLowerCase().includes(q) ||
          e.patient.cnsMasked.includes(q)) &&
        (!priority || e.patient.priority === priority) &&
        (!procedure || e.patient.procedure === procedure),
    );
  }, [data, tab, search, priority, procedure]);

  const lastChange = data?.items
    .map((e) => e.lastPositionChangeAt)
    .filter((d): d is string => !!d)
    .sort()
    .at(-1);

  return (
    <>
      <PageHeader
        title="Fila do SUS"
        subtitle={`Ordem vigente da fila de cirurgias eletivas${lastChange ? `, atualizada em ${formatDay(lastChange)} às ${formatTime(lastChange)}` : ""}.`}
        action={
          <Button asChild variant="outline" size="desktop">
            <Link href="/exportar">Exportar CSV</Link>
          </Button>
        }
      />
      <FlashNotice />
      <Segmented
        label="Situação"
        className="w-full max-w-[360px]"
        value={tab}
        onChange={setTab}
        options={[
          { value: "all", label: "Todos" },
          { value: "pending_proposal", label: "Com proposta" },
          { value: "under_review", label: "Contestadas" },
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
      {data && rows.length === 0 && (
        <p className="text-ink-secondary text-subtitle">
          {data.items.length === 0
            ? "A fila está vazia."
            : "Nenhum paciente encontrado com esses filtros."}
        </p>
      )}
      {rows.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead className="text-caption text-ink-secondary font-medium">
              <tr>
                {[
                  "Pos.",
                  "Paciente",
                  "Procedimento",
                  "Prioridade",
                  "Espera",
                  "Situação",
                ].map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 font-medium">
                    {h}
                  </th>
                ))}
                <th scope="col" className="px-4 py-3">
                  <span className="sr-only">Ação</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => {
                const status = statusChip[e.status];
                return (
                  <tr
                    key={e.patient.id}
                    className={
                      e.status === "pending_proposal"
                        ? "bg-brand-soft"
                        : undefined
                    }
                  >
                    <td className="text-body px-4 py-3.5 font-semibold">
                      {ordinal(e.position)}
                    </td>
                    <td className="px-4 py-3.5">
                      <Link
                        href={`/fila/${e.patient.id}`}
                        className="text-subtitle block font-semibold underline-offset-2 hover:underline"
                      >
                        {e.patient.name}
                      </Link>
                      <span className="text-note text-ink-secondary">
                        CNS {maskCns(e.patient.cnsMasked)}
                      </span>
                    </td>
                    <td className="text-subtitle px-4 py-3.5">
                      {e.patient.procedure}
                    </td>
                    <td className="px-4 py-3.5">
                      <Chip tone={priorityTone[e.patient.priority]}>
                        {e.patient.priority}
                      </Chip>
                    </td>
                    <td className="text-subtitle text-subtle-foreground px-4 py-3.5">
                      {daysSince(e.patient.waitingSince)} dias
                    </td>
                    <td className="px-4 py-3.5">
                      <Chip tone={status.tone}>{status.label}</Chip>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {e.status !== "under_review" && (
                        <Link
                          href={`/fila/contestar?paciente=${e.patient.id}`}
                          className="text-brand text-subtitle font-semibold"
                        >
                          Contestar
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
