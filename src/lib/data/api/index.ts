import type { Error as ApiErrorBody } from "@/lib/api/types";
import { ApiError } from "../errors";
import type { DataSource } from "../source";

type ApiSourceOptions = {
  baseUrl: string;
  /** Token da sessão atual, enviado como `Authorization: Bearer`. */
  getToken?: () => string | null | undefined;
};

/** Fonte que chama o SUSight-Backend seguindo docs/api/openapi.yaml. */
export function createApiSource({
  baseUrl,
  getToken,
}: ApiSourceOptions): DataSource {
  async function request<T>(
    method: "GET" | "POST",
    path: string,
    body?: unknown,
  ): Promise<T> {
    const headers: Record<string, string> = { Accept: "application/json" };
    const token = getToken?.();
    if (token) headers.Authorization = `Bearer ${token}`;
    if (body !== undefined) headers["Content-Type"] = "application/json";

    let response: Response;
    try {
      response = await fetch(new URL(path, baseUrl), {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch {
      throw new ApiError(0, {
        message: "Não foi possível conectar. Tente novamente.",
      });
    }

    if (!response.ok) {
      const errorBody = (await response
        .json()
        .catch(() => null)) as ApiErrorBody | null;
      throw new ApiError(response.status, {
        message: "Algo deu errado. Tente novamente.",
        ...errorBody,
      });
    }

    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
  }

  return {
    login: (body) => request("POST", "/auth/login", body),
    logout: () => request("POST", "/auth/logout"),
    me: () => request("GET", "/auth/me"),
    listProposals: (status = "pending") =>
      request("GET", `/proposals?status=${encodeURIComponent(status)}`),
    getProposal: (proposalId) =>
      request("GET", `/proposals/${encodeURIComponent(proposalId)}`),
    decide: (proposalId, body) =>
      request(
        "POST",
        `/proposals/${encodeURIComponent(proposalId)}/decision`,
        body,
      ),
    getQueue: () => request("GET", "/queue"),
    getQueueEntry: (patientId) =>
      request("GET", `/queue/${encodeURIComponent(patientId)}`),
    contest: (patientId, body) =>
      request("POST", `/queue/${encodeURIComponent(patientId)}/contest`, body),
    registerExport: (body) => request("POST", "/exports", body),
  };
}
