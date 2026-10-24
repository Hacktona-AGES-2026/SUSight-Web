"use client";

import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Choice } from "@/components/choice";
import { Notice } from "@/components/notice";
import { TextArea } from "@/components/field";
import type { ProposalDetail } from "@/lib/api/types";
import { ordinal } from "@/lib/format";
import { useDecide } from "./use-decide";

type DialogProps = {
  proposal: ProposalDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ApproveDialog({ proposal, open, onOpenChange }: DialogProps) {
  const { decide, sending, error } = useDecide(proposal.id);
  const caveat = proposal.tribunal.find((o) => o.agent === "contestacao");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Aprovar nova fila?</DialogTitle>
        <DialogDescription>
          A fila do SUS será atualizada ({ordinal(proposal.currentPosition)} →{" "}
          {ordinal(proposal.proposedPosition)}) e {proposal.patient.name} será
          avisado da nova posição. A decisão fica registrada com seu nome, data
          e hora.
        </DialogDescription>
        {caveat && (
          <Notice title="Antes de aprovar" tone="warning" icon={TriangleAlert}>
            {caveat.opinion} Você pode pedir informações ao paciente em vez de
            aprovar agora.
          </Notice>
        )}
        {error && (
          <p role="alert" className="text-destructive text-subtitle">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2.5">
          <Button
            variant="outline"
            size="desktop"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            size="desktop"
            disabled={sending}
            onClick={() => decide("approve")}
          >
            Aprovar e atualizar fila
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const reasons = [
  "Dados insuficientes ou desatualizados",
  "Piora não comprovada por exame",
  "Contraria a regra de equidade",
  "Outro motivo",
];

export function RejectDialog({ proposal, open, onOpenChange }: DialogProps) {
  const { decide, sending, error } = useDecide(proposal.id);
  const [reason, setReason] = useState(reasons[0]);
  const [details, setDetails] = useState("");
  const other = reason === reasons[reasons.length - 1];
  const valid = other ? details.trim() !== "" : true;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Rejeitar a proposta</DialogTitle>
        <DialogDescription>
          Diga por que a proposta não deve valer. A IA vai reavaliar a fila
          considerando o seu motivo.
        </DialogDescription>
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
        <TextArea
          label={
            other ? "Detalhes para a IA (obrigatório)" : "Detalhes para a IA"
          }
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
        {error && (
          <p role="alert" className="text-destructive text-subtitle">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2.5">
          <Button
            variant="outline"
            size="desktop"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="outline"
            size="desktop"
            className="text-destructive"
            disabled={sending || !valid}
            onClick={() =>
              decide(
                "reject",
                details.trim() ? `${reason}. ${details.trim()}` : reason,
              )
            }
          >
            Rejeitar e devolver à IA
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
