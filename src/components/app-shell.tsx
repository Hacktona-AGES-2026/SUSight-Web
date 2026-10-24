"use client";

import { createContext, useContext } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ClipboardCheck,
  Clock,
  Download,
  List,
  LogOut,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Doctor } from "@/lib/api/types";
import { dataSource } from "@/lib/data";
import { useData } from "@/lib/use-data";
import { Chip } from "@/components/chip";

const DoctorContext = createContext<Doctor | null>(null);

/** Médico logado; só existe dentro das telas internas. */
export function useDoctor() {
  const doctor = useContext(DoctorContext);
  if (!doctor) throw new Error("useDoctor fora do AppShell");
  return doctor;
}

const nav = [
  { href: "/revisoes", label: "Revisões", icon: ClipboardCheck },
  { href: "/fila", label: "Fila do SUS", icon: List },
  { href: "/enviar-documento", label: "Enviar documento", icon: Upload },
  { href: "/decisoes", label: "Decisões registradas", icon: Clock },
  { href: "/exportar", label: "Exportar fila", icon: Download },
];

/** Toda tela interna exige sessão: sem ela, `useData` leva ao login. */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: doctor } = useData("me", () => dataSource.me());
  const { data: pending } = useData(`pending:${pathname}`, () =>
    dataSource.listProposals(),
  );

  async function signOut() {
    await dataSource.logout();
    router.replace("/login");
  }

  if (!doctor) {
    return (
      <p className="text-ink-secondary text-subtitle m-auto p-8">Carregando…</p>
    );
  }

  return (
    <DoctorContext.Provider value={doctor}>
      <div className="flex flex-1 flex-col md:flex-row">
        <aside className="bg-sidebar flex shrink-0 flex-col justify-between gap-6 px-2.5 pt-2 pb-4 md:w-58 md:pt-4">
          <nav aria-label="Principal" className="flex flex-col gap-0.5">
            {nav.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "text-subtitle flex items-center gap-2.5 rounded-lg px-3 py-2.5",
                    active && "bg-brand-soft",
                  )}
                >
                  <Icon className="size-[18px]" />
                  <span className="flex-1">{label}</span>
                  {href === "/revisoes" && pending && (
                    <Chip tone="warning">{pending.total}</Chip>
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="text-note flex flex-col gap-px pl-3">
            <p className="text-subtle-foreground font-semibold">
              {doctor.name}
            </p>
            {doctor.crm && <p className="text-ink-secondary">{doctor.crm}</p>}
            <button
              type="button"
              onClick={signOut}
              className="text-brand mt-2 flex w-fit items-center gap-1.5 font-semibold"
            >
              <LogOut className="size-3.5" /> Sair
            </button>
          </div>
        </aside>
        <main className="flex-1 px-4 py-6 md:px-8 md:py-[72px]">
          <div className="flex max-w-[804px] flex-col gap-4">{children}</div>
        </main>
      </div>
    </DoctorContext.Provider>
  );
}
