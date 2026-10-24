import type { Metadata } from "next";
import { ProposalChanges } from "./proposal-changes";

export const metadata: Metadata = { title: "O que mudou · SUSight Clínica" };

export default async function Page(
  props: PageProps<"/revisoes/[id]/mudancas">,
) {
  const { id } = await props.params;
  return <ProposalChanges id={id} />;
}
