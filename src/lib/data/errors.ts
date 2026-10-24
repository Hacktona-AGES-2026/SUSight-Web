import type { Error as ApiErrorBody } from "@/lib/api/types";

/** Erro de qualquer fonte de dados, com o status HTTP e o corpo do contrato. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly body: ApiErrorBody,
  ) {
    super(body.message);
    this.name = "ApiError";
  }
}
