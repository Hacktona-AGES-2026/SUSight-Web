import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { approvalsWidgetData } from "./approvals";

const widgetsDir = path.join(process.cwd(), "public/widgets");
const read = (file: string) =>
  readFileSync(path.join(widgetsDir, file), "utf8");

/** Campos `${campo}` usados num modelo Adaptive Cards. */
function fields(template: string) {
  return [...template.matchAll(/\$\{!?(\w+)\}/g)].map((m) => m[1]);
}

describe("modelos dos widgets do Windows", () => {
  it("são JSON válido de Adaptive Cards", () => {
    for (const file of ["aprovacoes.json", "enviar-documento.json"]) {
      const card = JSON.parse(read(file));
      expect(card.type).toBe("AdaptiveCard");
    }
  });

  it("Aprovações só usa campos produzidos pelas regras, com e sem sessão", () => {
    const keys = new Set([
      ...Object.keys(approvalsWidgetData({ signedIn: true, pendingTotal: 3 })),
      ...Object.keys(approvalsWidgetData({ signedIn: false })),
    ]);
    for (const field of fields(read("aprovacoes.json"))) {
      expect(keys).toContain(field);
    }
  });

  it("Enviar documento tem os dados que o modelo usa", () => {
    const data = JSON.parse(read("enviar-documento-data.json"));
    for (const field of fields(read("enviar-documento.json"))) {
      expect(data).toHaveProperty(field);
    }
    expect(data.url).toBe("/enviar-documento");
  });

  it("os dois têm texto para o Narrador e botões que só abrem telas", () => {
    for (const file of ["aprovacoes.json", "enviar-documento.json"]) {
      const template = read(file);
      expect(JSON.parse(template).speak).toBe("${altText}");
      expect(
        [...template.matchAll(/"verb": "(\w+)"/g)].map((m) => m[1]),
      ).toEqual(["open"]);
    }
  });
});
