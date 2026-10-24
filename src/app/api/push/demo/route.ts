import { dataSourceKind } from "@/lib/data";
import { pushConfigured, pushToDoctors } from "@/lib/push/web-push";
import type { DoctorPushEvent } from "@/lib/widgets/notifications";

// Só no modo mock: dispara um aviso de demonstração para testar sem o backend (spec 010).
const DEMO_EVENTS: Record<DoctorPushEvent["type"], DoctorPushEvent> = {
  new_proposal: {
    type: "new_proposal",
    proposalId: "prop-1",
    patientName: "Marina Albuquerque",
  },
  queue_updated: { type: "queue_updated", notifiedCount: 3 },
  patient_replied: {
    type: "patient_replied",
    proposalId: "prop-3",
    patientName: "Rita de Cássia Lima",
    documentLabel: "o raio-X",
  },
};

export async function POST(request: Request) {
  if (dataSourceKind() !== "mock") {
    return Response.json(
      { message: "Disponível só no modo de demonstração." },
      { status: 404 },
    );
  }
  if (!pushConfigured()) {
    return Response.json(
      {
        message: "Configure as chaves VAPID no .env.local para enviar avisos.",
      },
      { status: 503 },
    );
  }
  const { type } = (await request.json().catch(() => ({}))) as {
    type?: string;
  };
  const event = DEMO_EVENTS[type as DoctorPushEvent["type"]];
  if (!event) {
    return Response.json(
      {
        message: `Tipo inválido. Use: ${Object.keys(DEMO_EVENTS).join(", ")}.`,
      },
      { status: 400 },
    );
  }
  return Response.json({ sent: await pushToDoctors(event) });
}
