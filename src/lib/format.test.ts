import { expect, test } from "vitest";
import { maskCns, ordinal, relativeDays } from "./format";

test("formata posição e CNS mascarado", () => {
  expect(ordinal(31)).toBe("31ª");
  expect(maskCns("***.****.****.4821")).toBe("•••• 4821");
});

test("tempo relativo em dias", () => {
  const now = new Date("2026-10-24T12:00:00");
  expect(relativeDays("2026-10-24T08:00:00", now)).toBe("hoje");
  expect(relativeDays("2026-10-23T08:00:00", now)).toBe("há 1 dia");
  expect(relativeDays("2026-10-20T08:00:00", now)).toBe("há 4 dias");
});
