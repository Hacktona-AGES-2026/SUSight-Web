import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Home from "./page";

test("mostra o nome SUSight Clínica em português", () => {
  render(<Home />);

  expect(
    screen.getByRole("heading", { level: 1, name: "SUSight Clínica" }),
  ).toBeInTheDocument();
  expect(
    screen.getByText("Revisão segura e explicável da fila do SUS"),
  ).toBeInTheDocument();
});
