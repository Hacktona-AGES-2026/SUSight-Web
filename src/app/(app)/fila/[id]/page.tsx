import type { Metadata } from "next";
import { QueueEntryView } from "./queue-entry";

export const metadata: Metadata = { title: "Ficha na fila · SUSight Clínica" };

export default async function Page(props: PageProps<"/fila/[id]">) {
  const { id } = await props.params;
  return <QueueEntryView id={id} />;
}
