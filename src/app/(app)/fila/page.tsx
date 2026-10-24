import type { Metadata } from "next";
import { QueueTable } from "./queue-table";

export const metadata: Metadata = { title: "Fila do SUS · SUSight Clínica" };

export default function Page() {
  return <QueueTable />;
}
