import { describe, expect, it, vi } from "vitest";
import { sendDoctorNotification } from "./send";
import { createSubscriptionStore } from "./store";

const sub = (id: string) => ({
  endpoint: `https://push.example/${id}`,
  keys: { p256dh: "p", auth: "a" },
});

describe("envio dos avisos do médico", () => {
  it("manda o aviso pronto para todas as assinaturas", async () => {
    const store = createSubscriptionStore();
    store.add("med-1", sub("a"));
    store.add("med-2", sub("b"));
    const send = vi.fn(async () => {});

    const sent = await sendDoctorNotification(
      { type: "queue_updated", notifiedCount: 3 },
      { store, send },
    );

    expect(sent).toBe(2);
    expect(send).toHaveBeenCalledTimes(2);
    const [, payload] = send.mock.calls[0] as unknown as [unknown, string];
    expect(JSON.parse(payload)).toMatchObject({
      title: "Fila atualizada",
      body: "3 pacientes avisados",
      url: "/fila",
    });
  });

  it("remove assinaturas expiradas e continua as outras", async () => {
    const store = createSubscriptionStore();
    store.add("med-1", sub("expirada"));
    store.add("med-1", sub("ok"));
    const send = vi.fn(async (subscription: { endpoint: string }) => {
      if (subscription.endpoint.endsWith("expirada")) {
        throw Object.assign(new Error("Gone"), { statusCode: 410 });
      }
    });

    const sent = await sendDoctorNotification(
      {
        type: "new_proposal",
        proposalId: "prop-1",
        patientName: "Marina Albuquerque",
      },
      { store, send },
    );

    expect(sent).toBe(1);
    expect(store.all().map((s) => s.subscription.endpoint)).toEqual([
      "https://push.example/ok",
    ]);
  });

  it("sem assinaturas, não manda nada", async () => {
    const send = vi.fn();
    await expect(
      sendDoctorNotification(
        { type: "queue_updated", notifiedCount: 1 },
        { store: createSubscriptionStore(), send },
      ),
    ).resolves.toBe(0);
    expect(send).not.toHaveBeenCalled();
  });
});
