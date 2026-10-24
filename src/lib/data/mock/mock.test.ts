import { beforeEach, describe, expect, test } from "vitest";
import { ApiError, createDataSource, dataSourceKind } from "@/lib/data";
import type { DataSource } from "@/lib/data";
import { demoCredentials } from "./fixtures";

// Mesmo padrão de `cnsMasked` em docs/api/openapi.yaml.
const CNS_MASKED = /^\*{3}\.\*{4}\.\*{4}\.\d{4}$/;

describe("fonte mock", () => {
  let source: DataSource;

  beforeEach(async () => {
    source = createDataSource("mock");
    await source.login(demoCredentials);
  });

  test("é a fonte padrão quando a variável não está definida", () => {
    expect(dataSourceKind(undefined)).toBe("mock");
    expect(dataSourceKind("api")).toBe("api");
  });

  test("lista as propostas pendentes da mais antiga para a mais nova", async () => {
    const { total, items } = await source.listProposals();

    expect(total).toBe(items.length);
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((p) => p.status === "pending")).toBe(true);
    const dates = items.map((p) => p.createdAt);
    expect(dates).toEqual([...dates].sort());
  });

  test("só expõe o CNS mascarado", async () => {
    const { items: proposals } = await source.listProposals();
    const { items: queue } = await source.getQueue();
    const patients = [...proposals, ...queue].map((item) => item.patient);

    for (const patient of patients) {
      expect(patient.cnsMasked).toMatch(CNS_MASKED);
      expect(patient).not.toHaveProperty("cns");
    }
  });

  test("exige sessão, como a API", async () => {
    await source.logout();

    await expect(source.getQueue()).rejects.toMatchObject({ status: 401 });
  });

  test("recusa credenciais inválidas com mensagem genérica", async () => {
    const error = await createDataSource("mock")
      .login({ identifier: demoCredentials.identifier, password: "errada" })
      .catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(401);
    expect((error as ApiError).message).not.toMatch(/senha|identificador/i);
  });
});
