import type { Metadata } from "next";
import { SendDocument } from "./send-document";

export const metadata: Metadata = {
  title: "Enviar documento · SUSight Clínica",
};

export default function Page() {
  return <SendDocument />;
}
