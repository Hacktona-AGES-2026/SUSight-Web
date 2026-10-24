import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeAll, expect, test, vi } from "vitest";
import { dataSource } from "@/lib/data";
import { demoCredentials } from "@/lib/data/mock/fixtures";
import { PendingReviews } from "./pending-reviews";
import { ProposalReview } from "./[id]/proposal-review";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace: vi.fn() }),
  usePathname: () => "/revisoes",
  useSearchParams: () => new URLSearchParams(),
}));

beforeAll(async () => {
  await dataSource.login(demoCredentials);
});

test("lista as revisões pendentes com CNS mascarado e sem CNS completo", async () => {
  render(<PendingReviews />);

  expect(await screen.findByText("Marina Albuquerque")).toBeInTheDocument();
  expect(screen.getByText(/CNS •••• 4821/)).toBeInTheDocument();
  expect(screen.queryByText(/\*\*\*\./)).not.toBeInTheDocument();
  expect(screen.getAllByRole("link", { name: "Revisar" })).toHaveLength(3);
});

test("aprovar pede confirmação e volta para a lista com aviso", async () => {
  render(<ProposalReview id="prop-1" />);

  fireEvent.click(
    await screen.findByRole("button", { name: "Aprovar nova fila" }),
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Aprovar e atualizar fila" }),
  );

  await waitFor(() =>
    expect(push).toHaveBeenCalledWith("/revisoes?aviso=aprovada"),
  );
});
