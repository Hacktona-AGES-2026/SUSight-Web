"use client";

import { useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { urlBase64ToUint8Array } from "@/lib/push/subscription";

const DISMISSED_KEY = "susight-push-opt-in-dismissed";

type State = "idle" | "working" | "error" | "done";

/** O navegador aceita avisos e o médico ainda não respondeu nem dispensou o convite. */
function canAsk(publicKey: string | undefined) {
  if (!publicKey) return false;
  if (!(
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  )) {
    return false;
  }
  try {
    if (localStorage.getItem(DISMISSED_KEY) === "1") return false;
  } catch {
    // Sem acesso ao armazenamento: pergunta de novo, sem problema.
  }
  return Notification.permission === "default";
}

const noSubscription = () => () => {};

/**
 * Explica os avisos antes do pedido do navegador (spec 010).
 * Some quando não há suporte, quando o médico já respondeu ou quando escolheu "Agora não".
 */
export function PushOptIn() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const askable = useSyncExternalStore(
    noSubscription,
    () => canAsk(publicKey),
    () => false,
  );
  const [state, setState] = useState<State>("idle");

  if (!askable || state === "done" || !publicKey) return null;

  async function enable() {
    setState("working");
    try {
      if ((await Notification.requestPermission()) !== "granted") {
        setState("done");
        return;
      }
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey!),
      });
      const response = await fetch("/api/push/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });
      setState(response.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  function dismiss() {
    try {
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // Ignora: só volta a perguntar na próxima visita.
    }
    setState("done");
  }

  return (
    <section
      aria-labelledby="push-opt-in-title"
      className="bg-background max-w-sm rounded-lg border p-4 text-left"
    >
      <h2 id="push-opt-in-title" className="text-subtitle font-semibold">
        Receber avisos
      </h2>
      <p className="text-note text-subtle-foreground mt-1">
        Avisamos quando chegar uma nova proposta, quando um paciente responder e
        quando a fila for atualizada. Nenhum aviso aprova ou rejeita nada.
      </p>
      {state === "error" && (
        <p role="alert" className="text-note text-destructive mt-2">
          Não foi possível ativar os avisos. Tente novamente.
        </p>
      )}
      <div className="mt-3 flex gap-2">
        <Button onClick={enable} disabled={state === "working"}>
          Ativar avisos
        </Button>
        <Button
          variant="ghost"
          onClick={dismiss}
          disabled={state === "working"}
        >
          Agora não
        </Button>
      </div>
    </section>
  );
}
