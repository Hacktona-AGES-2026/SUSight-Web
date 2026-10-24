"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronRight, File, Upload, User } from "lucide-react";
import { useDoctor } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { ErrorNotice, Notice } from "@/components/notice";
import { PageHeader } from "@/components/page-header";
import { Segmented } from "@/components/segmented";
import { TextArea, TextField } from "@/components/field";
import type { QueueEntry } from "@/lib/api/types";
import { dataSource } from "@/lib/data";
import { formatDay, formatTime, maskCns, ordinal } from "@/lib/format";
import { useData } from "@/lib/use-data";

const MAX_BYTES = 20 * 1024 * 1024;
const kinds = ["Exame", "Laudo", "Relatório", "Outro"] as const;

/**
 * ponytail: ainda não há endpoint para receber o arquivo (spec 003/004 não
 * preveem envio pelo médico). A tela valida e confirma, mas não envia nada.
 */
export function SendDocument() {
  const doctor = useDoctor();
  const { data, error, retry } = useData("queue", () => dataSource.getQueue());
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [query, setQuery] = useState("");
  const [patient, setPatient] = useState<QueueEntry>();
  const [kind, setKind] = useState<(typeof kinds)[number]>("Laudo");
  const [file, setFile] = useState<File>();
  const [fileError, setFileError] = useState<string>();
  const [note, setNote] = useState("");
  const [sentAt, setSentAt] = useState("");

  if (error) return <ErrorNotice message={error} onRetry={retry} />;

  const q = query.trim().toLowerCase();
  const results = q
    ? (data?.items ?? [])
        .filter(
          (e) =>
            e.patient.name.toLowerCase().includes(q) ||
            e.patient.cnsMasked.includes(q),
        )
        .slice(0, 5)
    : [];

  function pick(f: File | undefined) {
    setFileError(undefined);
    if (!f) return;
    if (!/\.(pdf|jpe?g|png)$/i.test(f.name)) {
      setFileError("Envie um arquivo PDF, JPG ou PNG.");
      setFile(undefined);
    } else if (f.size > MAX_BYTES) {
      setFileError("O arquivo passa de 20 MB.");
      setFile(undefined);
    } else {
      setFile(f);
    }
  }

  function reset() {
    setStep(1);
    setQuery("");
    setPatient(undefined);
    setFile(undefined);
    setNote("");
  }

  if (step === 3 && patient && file) {
    return (
      <>
        <PageHeader
          title="Documento enviado"
          subtitle="Passo 3 de 3 · Pronto"
        />
        <span className="bg-muted text-brand flex size-[72px] items-center justify-center rounded-full">
          <Check className="size-9" />
        </span>
        <p className="text-body text-subtle-foreground">
          A IA já está analisando o documento. Se a posição puder mudar, você
          recebe uma proposta para revisar.
        </p>
        <ul className="bg-card border-border rounded-[10px] border">
          <Row icon={File} title={`${kind} · ${file.name}`}>
            Enviado em {formatDay(sentAt)} às {formatTime(sentAt)} por{" "}
            {doctor.name}
          </Row>
          <Row icon={User} title={patient.patient.name}>
            CNS {maskCns(patient.patient.cnsMasked)}
          </Row>
        </ul>
        <div className="flex justify-end gap-3">
          <Button variant="outline" size="desktop" onClick={reset}>
            Enviar outro documento
          </Button>
          <Button asChild size="desktop">
            <Link href="/revisoes">Ver revisões</Link>
          </Button>
        </div>
      </>
    );
  }

  if (step === 2 && patient) {
    return (
      <>
        <PageHeader
          title="Enviar documento"
          subtitle="Passo 2 de 3 · Confirme e anexe"
        />
        <Notice title="Paciente identificado" tone="success" icon={Check}>
          {patient.patient.name} · CNS {maskCns(patient.patient.cnsMasked)} ·{" "}
          {patient.patient.procedure}
        </Notice>
        <Segmented
          label="Tipo de documento"
          value={kind}
          onChange={setKind}
          options={kinds.map((k) => ({ value: k, label: k }))}
        />
        <label className="bg-brand-soft focus-within:ring-ring/50 flex h-[200px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[10px] px-4 text-center focus-within:ring-3">
          <Upload className="text-brand size-8" />
          <span className="text-body text-brand font-semibold">
            {file
              ? file.name
              : "Arraste o arquivo aqui ou escolha no computador"}
          </span>
          <span className="text-note text-ink-secondary">
            PDF, JPG ou PNG até 20 MB
          </span>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="sr-only"
            onChange={(e) => pick(e.target.files?.[0])}
          />
        </label>
        {fileError && (
          <p role="alert" className="text-destructive text-subtitle">
            {fileError}
          </p>
        )}
        <TextArea
          label="Observação (opcional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <div className="flex justify-end gap-3">
          <Button variant="outline" size="desktop" onClick={() => setStep(1)}>
            Voltar
          </Button>
          <Button
            size="desktop"
            disabled={!file}
            onClick={() => {
              setSentAt(new Date().toISOString());
              setStep(3);
            }}
          >
            Enviar documento
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Enviar documento"
        subtitle="Passo 1 de 3 · Identifique o paciente"
      />
      <TextField
        label="CNS ou nome do paciente"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPatient(undefined);
        }}
      />
      {q && results.length === 0 && (
        <p className="text-ink-secondary text-subtitle">
          Nenhum paciente encontrado.
        </p>
      )}
      {results.length > 0 && (
        <ul className="bg-card border-border rounded-[10px] border">
          {results.map((e) => (
            <li key={e.patient.id}>
              <button
                type="button"
                aria-pressed={patient?.patient.id === e.patient.id}
                onClick={() => setPatient(e)}
                className="aria-pressed:bg-brand-soft flex w-full items-center gap-3 rounded-[10px] py-3 pr-4 pl-3 text-left"
              >
                <span className="bg-brand-soft text-brand flex size-10 shrink-0 items-center justify-center rounded-xl">
                  <User className="size-5" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-subtitle font-semibold">
                    {e.patient.name}
                  </span>
                  <span className="text-note text-ink-secondary">
                    CNS {maskCns(e.patient.cnsMasked)} · {e.patient.procedure} ·{" "}
                    {ordinal(e.position)}
                  </span>
                </span>
                <ChevronRight className="text-line-strong size-[18px]" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex justify-end">
        <Button size="desktop" disabled={!patient} onClick={() => setStep(2)}>
          Continuar
        </Button>
      </div>
    </>
  );
}

function Row({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof File;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-3 py-3 pr-4 pl-3">
      <span className="bg-brand-soft text-brand flex size-10 shrink-0 items-center justify-center rounded-xl">
        <Icon className="size-5" />
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-subtitle font-semibold">{title}</span>
        <span className="text-note text-ink-secondary">{children}</span>
      </span>
    </li>
  );
}
