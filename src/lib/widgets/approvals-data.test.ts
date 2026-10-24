import { describe, expect, it } from "vitest";
import { createDataSource } from "@/lib/data";
import { demoCredentials } from "@/lib/data/mock/fixtures";
import { loadApprovalsWidgetData } from "./approvals-data";

describe("dados do widget Aprovações", () => {
  it("mostra o mesmo total da lista de revisões pendentes", async () => {
    const source = createDataSource("mock");
    await source.login(demoCredentials);
    const { total } = await source.listProposals();

    const data = await loadApprovalsWidgetData(source);

    expect(data).toMatchObject({ signedIn: true, count: String(total) });
  });

  it("sem sessão, não mostra dados", async () => {
    const data = await loadApprovalsWidgetData(createDataSource("mock"));
    expect(data).toMatchObject({ signedIn: false, url: "/login" });
  });

  it("não traz nome, CNS nem procedimento de paciente", async () => {
    const source = createDataSource("mock");
    await source.login(demoCredentials);
    const text = JSON.stringify(await loadApprovalsWidgetData(source));
    expect(text).not.toMatch(/Marina|\*\*\*|Artroplastia/);
  });
});
