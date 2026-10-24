import Image from "next/image";

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
    </main>
  );
}
