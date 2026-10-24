"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { Notice } from "@/components/notice";

const messages: Record<string, string> = {
  aprovada: "Proposta aprovada. Fila atualizada.",
  rejeitada: "Proposta rejeitada e devolvida à IA para reavaliar.",
  pedido: "Pedido enviado. A proposta aguarda o paciente.",
  contestacao: "Contestação registrada. A IA vai reavaliar.",
};

function Flash() {
  const message = messages[useSearchParams().get("aviso") ?? ""];
  return message ? (
    <Notice title={message} tone="success" icon={Check} />
  ) : null;
}

/** Mensagem de sucesso vinda de `?aviso=...` depois de uma decisão. */
export function FlashNotice() {
  return (
    <Suspense>
      <Flash />
    </Suspense>
  );
}
