import { connection } from "next/server";
import { createDataSource, dataSourceKind } from "@/lib/data";
import { demoCredentials } from "@/lib/data/mock/fixtures";
import { loadApprovalsWidgetData } from "@/lib/widgets/approvals-data";

// Dados do widget "Aprovações" no painel do Windows 11 (spec 010).
export async function GET() {
  // A contagem muda a cada decisão: sempre calculada no pedido, nunca no build.
  await connection();

  const source = createDataSource();
  // Até a sessão da spec 002 existir, o modo mock usa o médico de demonstração.
  if (dataSourceKind() === "mock") await source.login(demoCredentials);

  try {
    return Response.json(await loadApprovalsWidgetData(source), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json(
      { message: "Não foi possível carregar as revisões. Tente novamente." },
      { status: 503 },
    );
  }
}
