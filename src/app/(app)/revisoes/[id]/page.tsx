import type { Metadata } from "next";
import { ProposalReview } from "./proposal-review";

export const metadata: Metadata = {
  title: "Revisão da proposta · SUSight Clínica",
};

export default async function Page(props: PageProps<"/revisoes/[id]">) {
  const { id } = await props.params;
  return <ProposalReview id={id} />;
}
