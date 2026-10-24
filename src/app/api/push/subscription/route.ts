import { dataSourceKind } from "@/lib/data";
import { demoDoctor } from "@/lib/data/mock/fixtures";
import { subscriptionStore } from "@/lib/push/store";
import { parseSubscription } from "@/lib/push/subscription";

// Guarda a assinatura de Web Push do médico (spec 010).
export async function POST(request: Request) {
  const subscription = parseSubscription(
    await request.json().catch(() => null),
  );
  if (!subscription) {
    return Response.json(
      { message: "Assinatura de avisos inválida." },
      { status: 400 },
    );
  }

  if (dataSourceKind() === "api") {
    // O backend guarda a assinatura (POST /me/web-push-subscription) com o token da sessão,
    // que só existe a partir da spec 002.
    return Response.json(
      { message: "Avisos ainda não disponíveis com o backend." },
      { status: 501 },
    );
  }

  // Modo mock: até a sessão da spec 002 existir, a assinatura fica com o médico de demonstração.
  subscriptionStore.add(demoDoctor.id, subscription);
  return new Response(null, { status: 204 });
}
