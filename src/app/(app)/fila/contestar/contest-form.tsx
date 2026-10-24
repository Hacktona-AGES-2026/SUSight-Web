"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Choice } from "@/components/choice";
import { SelectField, TextArea } from "@/components/field";
import { ErrorNotice, Notice } from "@/components/notice";
import { PageHeader } from "@/components/page-header";
import { ApiError, dataSource } from "@/lib/data";
import { ordinal } from "@/lib/format";
import { errorMessage, useData, useSessionRedirect } from "@/lib/use-data";

const reasons = [
  "Paciente com piora clínica não refletida",
  "Prioridade desatualizada",
  "Espera acumulada maior que a de quem está à frente",
  "Outro motivo",
];

export function ContestForm() {
  const router = useRouter();
  const redirect = useSessionRedirect();
  const initial = useSearchParams().get("paciente") ?? "";
  const { data, error, retry } = useData("queue", () => dataSource.getQueue());
  const [patientId, setPatientId] = useState(initial);
  const [reason, setReason] = useState(reasons[0]);
  const [direction, setDirection] = useState<"" | "up" | "down">("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string>();

  if (error) return <ErrorNotice message={error} onRetry={retry} />;
  if (!data)
    return <p className="text-ink-secondary text-subtitle">Carregando…</p>;

  const entry = data.items.find((e) => e.patient.id === patientId);
  const blocked = entry?.status === "under_review";
  const valid = !!entry && !blocked && text.trim() !== "";

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!valid || sending) return;
    setSending(true);
    setSendError(undefined);
    try {
      await dataSource.contest(patientId, {
        justification: `${reason}. ${text.trim()}`,
        ...(direction && { direction }),
      });
      router.push("/fila?aviso=contestacao");
    } catch (e) {
      setSending(false);
      if (redirect(e)) return;
      setSendError(
        e instanceof ApiError && e.status === 409
          ? e.body.message
          : errorMessage(e),
      );
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <PageHeader
        title="Contestar a fila atual"
        subtitle="Registre por que a ordem atual parece injusta. A IA reavalia a fila com o seu motivo."
      />
      <SelectField
        label="Paciente ou posição"
        value={patientId}
        onChange={(e) => setPatientId(e.target.value)}
        required
      >
        <option value="">Escolha um paciente</option>
        {data.items.map((e) => (
          <option key={e.patient.id} value={e.patient.id}>
            {e.patient.name} · {ordinal(e.position)}
          </option>
        ))}
      </SelectField>
      {blocked && (
        <Notice title="Em reavaliação" tone="warning">
          Já existe uma contestação em andamento para este paciente.
        </Notice>
      )}
      <div
        className="flex flex-col gap-2"
        role="radiogroup"
        aria-label="Motivo"
      >
        {reasons.map((r) => (
          <Choice
            key={r}
            type="radio"
            name="motivo"
            checked={reason === r}
            onChange={() => setReason(r)}
          >
            {r}
          </Choice>
        ))}
      </div>
      <SelectField
        label="Você acha que o paciente deveria (opcional)"
        value={direction}
        onChange={(e) => setDirection(e.target.value as "" | "up" | "down")}
      >
        <option value="">Não sei dizer</option>
        <option value="up">Subir na fila</option>
        <option value="down">Descer na fila</option>
      </SelectField>
      <TextArea
        label="Descreva o que está injusto"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />
      {sendError && (
        <p role="alert" className="text-destructive text-subtitle">
          {sendError}
        </p>
      )}
      <div className="flex justify-end gap-3">
        <Button asChild variant="outline" size="desktop">
          <Link href="/fila">Cancelar</Link>
        </Button>
        <Button type="submit" size="desktop" disabled={!valid || sending}>
          Enviar contestação à IA
        </Button>
      </div>
    </form>
  );
}
