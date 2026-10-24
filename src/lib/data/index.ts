import { createApiSource } from "./api";
import { createMockSource } from "./mock";
import type { DataSource } from "./source";

export type { DataSource } from "./source";
export { ApiError } from "./errors";

export type DataSourceKind = "mock" | "api";

/** Lê `NEXT_PUBLIC_DATA_SOURCE`; qualquer valor diferente de "api" usa o mock. */
export function dataSourceKind(
  value = process.env.NEXT_PUBLIC_DATA_SOURCE,
): DataSourceKind {
  return value === "api" ? "api" : "mock";
}

export function createDataSource(
  kind: DataSourceKind = dataSourceKind(),
  { persistSession = false }: { persistSession?: boolean } = {},
): DataSource {
  if (kind === "api") {
    return createApiSource({
      baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
    });
  }
  return createMockSource({ persistSession });
}

/** Fonte usada pelas telas. */
export const dataSource = createDataSource(undefined, {
  persistSession: true,
});
