"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AlreadyDecidedError, DecisionType } from "@/lib/api/types";
import { ApiError, dataSource } from "@/lib/data";
import { formatDay, formatTime } from "@/lib/format";
import { errorMessage, useSessionRedirect } from "@/lib/use-data";

const flash: Record<DecisionType, string> = {
  approve: "aprovada",
  reject: "rejeitada",
  request_info: "pedido",
};

/** Envia a decisão uma vez só; em caso de erro mantém tudo para tentar de novo. */
export function useDecide(proposalId: string) {
  const router = useRouter();
  const redirect = useSessionRedirect();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string>();

  async function decide(type: DecisionType, text?: string, exams?: string[]) {
    if (sending) return;
    setSending(true);
    setError(undefined);
    try {
      await dataSource.decide(proposalId, { type, text, exams });
      router.push(`/revisoes?aviso=${flash[type]}`);
    } catch (e) {
      setSending(false);
      if (redirect(e)) return;
      if (e instanceof ApiError && e.status === 409) {
        const { decidedBy, decidedAt } = e.body as Partial<AlreadyDecidedError>;
        setError(
          decidedBy && decidedAt
            ? `Esta proposta já foi decidida por ${decidedBy.name} em ${formatDay(decidedAt)} às ${formatTime(decidedAt)}.`
            : e.body.message,
        );
      } else {
        setError(errorMessage(e));
      }
    }
  }

  return { decide, sending, error };
}
