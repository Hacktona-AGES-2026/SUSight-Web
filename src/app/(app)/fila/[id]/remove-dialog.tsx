"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Choice } from "@/components/choice";
import { TextArea } from "@/components/field";
import { Notice } from "@/components/notice";

const reasons = [
  "Cirurgia realizada",
  "Desistência do paciente",
  "Transferência para outra fila",
  "Óbito",
  "Outro",
];

export function RemoveDialog({
  open,
  onOpenChange,
  summary,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  summary: string;
  onConfirm: (reason: string, note: string) => void;
}) {
  const [reason, setReason] = useState(reasons[0]);
  const [note, setNote] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Remover da fila</DialogTitle>
        <DialogDescription>{summary}</DialogDescription>
        <div
          className="flex flex-col gap-2"
          role="radiogroup"
          aria-label="Motivo"
        >
          {reasons.map((r) => (
            <Choice
              key={r}
              type="radio"
              name="motivo-saida"
              checked={reason === r}
              onChange={() => setReason(r)}
            >
              {r}
            </Choice>
          ))}
        </div>
        <TextArea
          label="Observação (opcional)"
          placeholder="Ex.: cirurgia feita em 24/10 no Hospital Antônio Pedro"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <Notice title="As posições seguintes sobem">
          A saída fica registrada no histórico.
        </Notice>
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
            className="bg-destructive-dot hover:bg-destructive-dot/90 text-white"
            onClick={() => onConfirm(reason, note.trim())}
          >
            Remover da fila
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
