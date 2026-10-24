import type { WebPushSubscription } from "@/lib/api/types";

// Assinatura de Web Push do navegador do médico (spec 010), no formato do contrato.
export type PushSubscriptionJSON = WebPushSubscription;

/** Valida a assinatura enviada pelo navegador. `null` se for inválida. */
export function parseSubscription(raw: unknown): PushSubscriptionJSON | null {
  if (typeof raw !== "object" || raw === null) return null;
  const { endpoint, keys } = raw as Record<string, unknown>;
  if (typeof endpoint !== "string" || !endpoint.startsWith("https://"))
    return null;
  if (typeof keys !== "object" || keys === null) return null;
  const { p256dh, auth } = keys as Record<string, unknown>;
  if (typeof p256dh !== "string" || typeof auth !== "string") return null;
  return { endpoint, keys: { p256dh, auth } };
}

/** Chave pública VAPID (base64url) no formato que `pushManager.subscribe` espera. */
export function urlBase64ToUint8Array(
  base64Url: string,
): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64Url.length % 4)) % 4);
  const base64 = (base64Url + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const bytes = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}
