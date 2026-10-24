import { Suspense } from "react";
import type { Metadata } from "next";
import { ContestForm } from "./contest-form";

export const metadata: Metadata = {
  title: "Contestar a fila · SUSight Clínica",
};

export default function Page() {
  return (
    <Suspense>
      <ContestForm />
    </Suspense>
  );
}
