import type { Metadata } from "next";
import { Decisions } from "./decisions";

export const metadata: Metadata = {
  title: "Decisões registradas · SUSight Clínica",
};

export default function Page() {
  return <Decisions />;
}
