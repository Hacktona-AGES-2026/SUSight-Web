import {
  notificationFor,
  type DoctorPushEvent,
} from "@/lib/widgets/notifications";
import type { createSubscriptionStore } from "./store";
import type { PushSubscriptionJSON } from "./subscription";

type Deps = {
  store: ReturnType<typeof createSubscriptionStore>;
  /** Envia o payload para uma assinatura (web-push no servidor). */
  send(subscription: PushSubscriptionJSON, payload: string): Promise<unknown>;
};

/** Monta o aviso e manda para todas as assinaturas. Devolve quantos foram enviados. */
export async function sendDoctorNotification(
  event: DoctorPushEvent,
  { store, send }: Deps,
) {
  const payload = JSON.stringify(notificationFor(event));
  let sent = 0;
  for (const { subscription } of store.all()) {
    try {
      await send(subscription, payload);
      sent++;
    } catch (error) {
      // 404 e 410: o navegador cancelou a assinatura; não adianta tentar de novo.
      const status = (error as { statusCode?: number }).statusCode;
      if (status === 404 || status === 410) store.remove(subscription.endpoint);
      else console.warn("Não foi possível enviar um aviso.", error);
    }
  }
  return sent;
}
