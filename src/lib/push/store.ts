import type { PushSubscriptionJSON } from "./subscription";

// Assinaturas guardadas em memória, só no modo mock. No modo API, quem guarda é o backend.

export type StoredSubscription = {
  doctorId: string;
  subscription: PushSubscriptionJSON;
};

export function createSubscriptionStore() {
  const byEndpoint = new Map<string, StoredSubscription>();
  return {
    add(doctorId: string, subscription: PushSubscriptionJSON) {
      byEndpoint.set(subscription.endpoint, { doctorId, subscription });
    },
    remove(endpoint: string) {
      byEndpoint.delete(endpoint);
    },
    all(): StoredSubscription[] {
      return [...byEndpoint.values()];
    },
  };
}

// Uma instância por servidor, mantida entre recarregamentos em desenvolvimento.
const globalStore = globalThis as typeof globalThis & {
  __susightPushStore?: ReturnType<typeof createSubscriptionStore>;
};
export const subscriptionStore = (globalStore.__susightPushStore ??=
  createSubscriptionStore());
