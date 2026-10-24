import type { Metadata } from "next";
import { PendingReviews } from "./pending-reviews";

export const metadata: Metadata = {
  title: "Revisões pendentes · SUSight Clínica",
};

export default function Page() {
  return <PendingReviews />;
}
