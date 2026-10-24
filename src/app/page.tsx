"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

/** Splash; depois segue para as revisões (sem sessão, o login assume). */
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.replace("/revisoes"), 1200);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="bg-brand-highlight flex flex-1 flex-col items-center justify-center gap-3.5 px-4 text-center">
      <Image
        src="/logo.png"
        alt=""
        width={88}
        height={88}
        className="rounded-[28px]"
        priority
      />
      <h1 className="text-title-lg font-bold">SUSight Clínica</h1>
      <p className="text-body text-brand">
        Revisão segura e explicável da fila do SUS
      </p>
    </main>
  );
}
