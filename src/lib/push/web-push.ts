import "server-only";
import webpush from "web-push";
import { sendDoctorNotification } from "./send";
import { subscriptionStore } from "./store";
import type { DoctorPushEvent } from "@/lib/widgets/notifications";

/** Chaves VAPID do .env. `null` quando os avisos não estão configurados. */
function vapid() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;
  return publicKey && privateKey && subject
    ? { publicKey, privateKey, subject }
    : null;
}

export function pushConfigured() {
  return vapid() !== null;
}

/** Envia um aviso do médico pelo servidor do web (modo mock). */
export async function pushToDoctors(event: DoctorPushEvent) {
  const keys = vapid();
  if (!keys) return 0;
  webpush.setVapidDetails(keys.subject, keys.publicKey, keys.privateKey);
  return sendDoctorNotification(event, {
    store: subscriptionStore,
    send: (subscription, payload) =>
      webpush.sendNotification(subscription, payload, { TTL: 3600 }),
  });
}

/** Aviso "Fila atualizada", para o fluxo de aprovação da spec 004 chamar depois de aprovar. */
export function notifyQueueApproved(notifiedCount: number) {
  return pushToDoctors({ type: "queue_updated", notifiedCount });
}
