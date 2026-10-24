// Avisos do médico enviados por Web Push (spec 010).
// Só usam os campos abaixo: CNS e dados clínicos nunca chegam ao aviso (LGPD).

export type DoctorPushEvent =
  | { type: "new_proposal"; proposalId: string; patientName: string }
  | { type: "queue_updated"; notifiedCount: number }
  | {
      type: "patient_replied";
      proposalId: string;
      patientName: string;
      documentLabel: string;
    };

export type DoctorNotification = {
  title: string;
  body: string;
  /** Agrupa avisos do mesmo assunto, sem repetir. */
  tag: string;
  /** Tela aberta no clique. */
  url: string;
  /** Botões só abrem telas: nenhum aviso aprova ou rejeita (constituição, itens 1 e 2). */
  actions: { action: "open"; title: string }[];
};

export function notificationFor(event: DoctorPushEvent): DoctorNotification {
  switch (event.type) {
    case "new_proposal":
      return {
        title: "Nova proposta",
        body: event.patientName,
        tag: `new_proposal-${event.proposalId}`,
        url: `/revisoes/${encodeURIComponent(event.proposalId)}`,
        actions: [{ action: "open", title: "Revisar" }],
      };
    case "queue_updated":
      return {
        title: "Fila atualizada",
        body:
          event.notifiedCount === 1
            ? "1 paciente avisado"
            : `${event.notifiedCount} pacientes avisados`,
        tag: "queue_updated",
        url: "/fila",
        actions: [],
      };
    case "patient_replied":
      return {
        title: "Paciente respondeu",
        body: `${firstName(event.patientName)} enviou ${event.documentLabel}`,
        tag: `patient_replied-${event.proposalId}`,
        url: `/revisoes/${encodeURIComponent(event.proposalId)}`,
        actions: [{ action: "open", title: "Abrir" }],
      };
  }
}

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? name;
}
