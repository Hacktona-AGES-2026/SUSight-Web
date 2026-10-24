import Image from "next/image";
import { PushOptIn } from "@/components/push-opt-in";

export default function Home() {
  return (
    <main className="bg-brand-highlight flex flex-1 flex-col items-center justify-center gap-3.5 px-4 text-center">
      <div className="bg-background flex size-22 items-center justify-center rounded-[28px]">
        <Image src="/pulse.svg" alt="" width={44} height={44} priority />
      </div>
      <h1 className="text-title-lg font-bold">SUSight Clínica</h1>
      <p className="text-body text-brand">
        Revisão segura e explicável da fila do SUS
      </p>
      {/* Até o layout interno da spec 002 existir, o convite para os avisos fica aqui. */}
      <PushOptIn />
    </main>
  );
}
