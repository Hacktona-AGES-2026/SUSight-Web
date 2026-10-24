import { describe, expect, it } from "vitest";
import { createSubscriptionStore } from "./store";
import { parseSubscription, urlBase64ToUint8Array } from "./subscription";

const valid = {
  endpoint: "https://wns2-bl2p.notify.windows.com/w/?token=abc",
  keys: {
    p256dh:
      "BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QTpQtUbVlUls0VJXg7A8u-Ts1XbjhazAkj7I99e8QcYP7DkM",
    auth: "tBHItJI5svbpez7KI4CCXg",
  },
};

describe("assinatura de Web Push", () => {
  it("aceita uma assinatura válida do navegador", () => {
    expect(parseSubscription(valid)).toEqual(valid);
  });

  it("recusa endereço sem https ou sem chaves", () => {
    expect(
      parseSubscription({ ...valid, endpoint: "http://exemplo.com" }),
    ).toBeNull();
    expect(parseSubscription({ endpoint: valid.endpoint })).toBeNull();
    expect(parseSubscription(null)).toBeNull();
    expect(parseSubscription("texto")).toBeNull();
  });

  it("converte a chave pública VAPID para o formato do navegador", () => {
    const bytes = urlBase64ToUint8Array("AQID_-8");
    expect(Array.from(bytes)).toEqual([1, 2, 3, 255, 239]);
  });
});

describe("armazenamento das assinaturas (modo mock)", () => {
  it("guarda uma por endereço, sem repetir", () => {
    const store = createSubscriptionStore();
    store.add("med-1", valid);
    store.add("med-1", valid);
    expect(store.all()).toHaveLength(1);
  });

  it("remove assinaturas que o serviço de push recusou", () => {
    const store = createSubscriptionStore();
    store.add("med-1", valid);
    store.remove(valid.endpoint);
    expect(store.all()).toHaveLength(0);
  });
});
