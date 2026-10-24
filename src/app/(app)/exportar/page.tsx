import type { Metadata } from "next";
import { ExportQueue } from "./export-queue";

export const metadata: Metadata = { title: "Exportar fila · SUSight Clínica" };

export default function Page() {
  return <ExportQueue />;
}
