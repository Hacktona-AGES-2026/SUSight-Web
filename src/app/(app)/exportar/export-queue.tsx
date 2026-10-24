"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Info, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Choice } from "@/components/choice";
import { ErrorNotice, Notice } from "@/components/notice";
import { PageHeader, SectionTitle } from "@/components/page-header";
import { buildQueueCsv, csvFileName, queueCsvRows } from "@/lib/csv";
import { dataSource } from "@/lib/data";
import { errorMessage, useData, useSessionRedirect } from "@/lib/use-data";

export function ExportQueue() {
  const redirect = useSessionRedirect();
  const { data, error, retry } = useData("queue", () => dataSource.getQueue());
  const [now] = useState(() => new Date());
  const [downloadError, setDownloadError] = useState<string>();
  const [done, setDone] = useState(false);

  if (error) return <ErrorNotice message={error} onRetry={retry} />;
  if (!data)
    return <p className="text-ink-secondary text-subtitle">Carregando…</p>;

  const fileName = csvFileName(now);
  const preview = queueCsvRows(data.items.slice(0, 4), now);

  async function download() {
    if (!data) return;
    setDownloadError(undefined);
    try {
      // O web não aplica filtros nesta tela: o export é sempre a fila completa.
      await dataSource.registerExport({
        scope: "full",
        rowCount: data.items.length,
      });
      const url = URL.createObjectURL(
        new Blob([buildQueueCsv(data.items, now)], {
          type: "text/csv;charset=utf-8",
        }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
      setDone(true);
    } catch (e) {
      if (!redirect(e)) setDownloadError(errorMessage(e));
    }
  }

  return (
    <>
      <PageHeader
        title="Exportar fila atualizada"
        subtitle="Gere o arquivo com a lista ordenada vigente, pronta para entrega."
      />
      <div className="bg-brand-soft flex items-center gap-3 rounded-[10px] p-3">
        <span className="bg-background text-brand flex size-10 shrink-0 items-center justify-center rounded-full">
          <Table className="size-5" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="text-body font-semibold">{fileName}</p>
          <p className="text-note text-subtle-foreground">
            CSV · {data.total} {data.total === 1 ? "paciente" : "pacientes"} ·
            fila aprovada
          </p>
        </div>
        <span className="bg-background text-brand flex size-10 shrink-0 items-center justify-center rounded-full">
          <ArrowRight className="size-[18px]" />
        </span>
      </div>

      <SectionTitle>Formato</SectionTitle>
      <div className="flex flex-col gap-2">
        <Choice type="radio" name="formato" checked onChange={() => {}}>
          CSV (recomendado)
        </Choice>
        {/* Outros formatos estão fora do escopo da spec 006. */}
        <div aria-disabled className="opacity-50">
          <Choice
            type="radio"
            name="formato"
            checked={false}
            onChange={() => {}}
          >
            PDF para impressão (em breve)
          </Choice>
        </div>
      </div>

      <SectionTitle>Prévia das primeiras linhas</SectionTitle>
      <pre className="bg-card border-border text-note text-subtle-foreground overflow-x-auto rounded-[10px] border px-5 py-[18px] font-sans leading-[26px]">
        {preview.join("\n")}
      </pre>

      {data.total === 0 && (
        <Notice title="A fila está vazia" tone="warning">
          O arquivo terá só o cabeçalho.
        </Notice>
      )}
      <Notice title="Só a fila aprovada" icon={Info}>
        O arquivo traz a última fila aprovada por um profissional. Propostas
        pendentes e contestações em andamento não entram.
      </Notice>
      {done && (
        <Notice
          title={`${fileName} baixado. Export registrado.`}
          tone="success"
        />
      )}
      {downloadError && (
        <p role="alert" className="text-destructive text-subtitle">
          {downloadError}
        </p>
      )}
      <div className="flex justify-end gap-3">
        <Button asChild variant="outline" size="desktop">
          <Link href="/fila">Cancelar</Link>
        </Button>
        <Button size="desktop" onClick={download}>
          Baixar CSV
        </Button>
      </div>
    </>
  );
}
