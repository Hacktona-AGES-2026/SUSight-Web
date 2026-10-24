"use client";

import { useState } from "react";
import Link from "next/link";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Choice } from "@/components/choice";
import { TextArea } from "@/components/field";
import { ErrorNotice, Notice } from "@/components/notice";
import { PageHeader, SectionTitle } from "@/components/page-header";
import { dataSource } from "@/lib/data";
import { patientRef } from "@/lib/format";
import { useData } from "@/lib/use-data";
import { useDecide } from "../use-decide";

// O paciente não relata sintomas: só se pedem exames e laudos (constituição, item 4).
const items = [
  "Laudo recente do exame",
  "Foto legível do exame mais recente",
  "Encaminhamento da UBS atualizado",
  "Outro documento",
];

export function RequestInfo({ id }: { id: string }) {
  const {
    data: p,
    error,
    retry,
  } = useData(`proposal:${id}`, () => dataSource.getProposal(id));
  const { decide, sending, error: sendError } = useDecide(id);
  const [selected, setSelected] = useState<string[]>([items[0]]);
  const [edited, setEdited] = useState<string>();

  if (error) return <ErrorNotice message={error} onRetry={retry} />;
  if (!p)
    return <p className="text-ink-secondary text-subtitle">Carregando…</p>;

  const firstName = p.patient.name.split(" ")[0];
  const suggestion = `Olá, ${firstName}. Para continuar a avaliação, precisamos de: ${selected
    .map((i) => i.toLowerCase())
    .join("; ")}. Você pode enviar uma foto pelo aplicativo.`;
  const message = edited ?? suggestion;

  const toggle = (item: string) =>
    setSelected((s) =>
      s.includes(item) ? s.filter((i) => i !== item) : [...s, item],
    );

  return (
    <>
      <PageHeader
        title="Pedir informações ao paciente"
        subtitle={`${p.patient.name} · ${patientRef(p.patient.cnsMasked)}. O paciente recebe o pedido no aplicativo.`}
      />
      <SectionTitle>O que você precisa</SectionTitle>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <Choice
            key={item}
            type="checkbox"
            checked={selected.includes(item)}
            onChange={() => toggle(item)}
          >
            {item}
          </Choice>
        ))}
      </div>
      <TextArea
        label="Mensagem para o paciente"
        value={message}
        onChange={(e) => setEdited(e.target.value)}
      />
      <Notice title="A proposta fica em espera" icon={Info}>
        Nenhuma mudança entra na fila até o paciente responder e você decidir.
      </Notice>
      {sendError && (
        <p role="alert" className="text-destructive text-subtitle">
          {sendError}
        </p>
      )}
      <div className="flex justify-end gap-3">
        <Button asChild variant="outline" size="desktop">
          <Link href={`/revisoes/${id}`}>Cancelar</Link>
        </Button>
        <Button
          size="desktop"
          disabled={sending || message.trim() === "" || selected.length === 0}
          onClick={() => decide("request_info", message.trim(), selected)}
        >
          Enviar pedido
        </Button>
      </div>
    </>
  );
}
