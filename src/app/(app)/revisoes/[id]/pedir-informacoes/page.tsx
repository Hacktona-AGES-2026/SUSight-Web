import type { Metadata } from "next";
import { RequestInfo } from "./request-info";

export const metadata: Metadata = {
  title: "Pedir informações · SUSight Clínica",
};

export default async function Page(
  props: PageProps<"/revisoes/[id]/pedir-informacoes">,
) {
  const { id } = await props.params;
  return <RequestInfo id={id} />;
}
