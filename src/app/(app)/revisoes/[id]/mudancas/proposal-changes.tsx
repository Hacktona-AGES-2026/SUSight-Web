"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ErrorNotice } from "@/components/notice";
import { PageHeader } from "@/components/page-header";
import { dataSource } from "@/lib/data";
import { useData } from "@/lib/use-data";
import { ApproveDialog } from "../decision-dialogs";

export function ProposalChanges({ id }: { id: string }) {
  const {
    data: p,
    error,
    retry,
  } = useData(`proposal:${id}`, () => dataSource.getProposal(id));
  const [approving, setApproving] = useState(false);

  if (error) return <ErrorNotice message={error} onRetry={retry} />;
  if (!p)
    return <p className="text-ink-secondary text-subtitle">Carregando…</p>;

  return (
    <>
      <PageHeader
        title="O que mudou"
        subtitle="Compare os dados de antes com os dados considerados agora, com a fonte de cada um."
      />
      {p.criteria.length === 0 ? (
        <p className="text-ink-secondary text-subtitle">
          Nenhum critério mudou desde a última avaliação.
        </p>
      ) : (
        <ul className="bg-card border-border flex flex-col rounded-[10px] border p-px">
          {p.criteria.map((c) => (
            <li key={c.key} className="flex flex-wrap items-start gap-3 p-px">
              <div className="flex w-full flex-col gap-0.5 px-3 py-2.5 sm:w-[170px]">
                <p className="text-subtitle font-semibold">{c.label}</p>
              </div>
              <div className="bg-destructive-soft text-subtitle flex min-w-0 flex-1 gap-2 rounded-2xl px-3.5 py-3">
                <span className="text-destructive font-semibold">−</span>
                <span>{c.previousValue ?? "Sem avaliação anterior"}</span>
              </div>
              <div className="text-subtitle flex min-w-0 flex-1 gap-2 rounded-2xl bg-white px-3.5 py-3">
                <span className="text-brand font-semibold">+</span>
                <span>{c.value}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="flex justify-end gap-3">
        <Button asChild variant="outline" size="desktop">
          <Link href={`/revisoes/${p.id}`}>Voltar à proposta</Link>
        </Button>
        {p.status === "pending" && !p.decidedBy && (
          <Button size="desktop" onClick={() => setApproving(true)}>
            Aprovar nova fila
          </Button>
        )}
      </div>
      <ApproveDialog
        proposal={p}
        open={approving}
        onOpenChange={setApproving}
      />
    </>
  );
}
