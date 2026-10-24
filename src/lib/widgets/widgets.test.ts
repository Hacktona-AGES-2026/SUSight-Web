import { describe, expect, it } from "vitest";
import { approvalsWidgetData } from "./approvals";
import { notificationFor } from "./notifications";

describe("widget Aprovações", () => {
  it("mostra quantas propostas esperam revisão e leva às revisões", () => {
    expect(approvalsWidgetData({ signedIn: true, pendingTotal: 3 })).toEqual({
      signedIn: true,
      count: "3",
      label: "propostas para revisar",
      buttonText: "Revisar",
      url: "/revisoes",
      altText: "3 propostas para revisar. Abre as revisões pendentes.",
    });
  });

  it("usa singular e o caso sem pendências", () => {
    expect(approvalsWidgetData({ signedIn: true, pendingTotal: 1 }).label).toBe(
      "proposta para revisar",
    );
    expect(
      approvalsWidgetData({ signedIn: true, pendingTotal: 0 }),
    ).toMatchObject({
      count: "0",
      label: "nenhuma proposta para revisar",
    });
  });

  it("sem sessão, não mostra dados e leva ao login", () => {
    expect(approvalsWidgetData({ signedIn: false })).toEqual({
      signedIn: false,
      message: "Entre no SUSight Clínica para ver suas revisões",
      buttonText: "Entrar",
      url: "/login",
      altText: "Entre no SUSight Clínica para ver suas revisões.",
    });
  });
});

describe("avisos do médico", () => {
  it("nova proposta: nome do paciente e botão Revisar para a proposta", () => {
    expect(
      notificationFor({
        type: "new_proposal",
        proposalId: "prop-1",
        patientName: "Marina Albuquerque",
      }),
    ).toEqual({
      title: "Nova proposta",
      body: "Marina Albuquerque",
      tag: "new_proposal-prop-1",
      url: "/revisoes/prop-1",
      actions: [{ action: "open", title: "Revisar" }],
    });
  });

  it("fila atualizada: quantos pacientes foram avisados", () => {
    expect(
      notificationFor({ type: "queue_updated", notifiedCount: 3 }),
    ).toMatchObject({
      title: "Fila atualizada",
      body: "3 pacientes avisados",
      url: "/fila",
      actions: [],
    });
    expect(
      notificationFor({ type: "queue_updated", notifiedCount: 1 }).body,
    ).toBe("1 paciente avisado");
  });

  it("paciente respondeu: quem enviou o quê, com o botão Abrir", () => {
    expect(
      notificationFor({
        type: "patient_replied",
        proposalId: "prop-3",
        patientName: "Rita de Cássia Lima",
        documentLabel: "o raio-X",
      }),
    ).toMatchObject({
      title: "Paciente respondeu",
      body: "Rita enviou o raio-X",
      url: "/revisoes/prop-3",
      actions: [{ action: "open", title: "Abrir" }],
    });
  });

  it("nunca leva CNS nem dado clínico para o aviso", () => {
    const event = {
      type: "new_proposal",
      proposalId: "prop-1",
      patientName: "Marina Albuquerque",
      cnsMasked: "***.****.****.4821",
      procedure: "Artroplastia total de joelho",
    } as Parameters<typeof notificationFor>[0];
    const text = JSON.stringify(notificationFor(event));
    expect(text).not.toContain("4821");
    expect(text).not.toContain("Artroplastia");
  });

  it("nenhum aviso aprova ou rejeita: os botões só abrem telas", () => {
    for (const event of [
      { type: "new_proposal", proposalId: "p", patientName: "A" },
      { type: "queue_updated", notifiedCount: 2 },
      {
        type: "patient_replied",
        proposalId: "p",
        patientName: "A",
        documentLabel: "o laudo",
      },
    ] as const) {
      for (const action of notificationFor(event).actions) {
        expect(action.action).toBe("open");
      }
    }
  });
});
