import { ApiError, type DataSource } from "@/lib/data";
import { approvalsWidgetData, type ApprovalsWidgetData } from "./approvals";

/** Dados do widget "Aprovações" a partir da camada de dados. Sessão expirada vira "sem sessão". */
export async function loadApprovalsWidgetData(
  source: DataSource,
): Promise<ApprovalsWidgetData> {
  try {
    const { total } = await source.listProposals("pending");
    return approvalsWidgetData({ signedIn: true, pendingTotal: total });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return approvalsWidgetData({ signedIn: false });
    }
    throw error;
  }
}
