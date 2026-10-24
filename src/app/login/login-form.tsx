"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/field";
import { Notice } from "@/components/notice";
import { dataSource } from "@/lib/data";
import { errorMessage } from "@/lib/use-data";

/** Só aceita caminhos internos, para não redirecionar para outro site. */
function safeNext(next: string | null) {
  return next && next.startsWith("/") && !next.startsWith("//")
    ? next
    : "/revisoes";
}

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();
  const [sending, setSending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    setError(undefined);
    try {
      await dataSource.login({ identifier, password });
      router.replace(safeNext(params.get("next")));
    } catch (e) {
      setError(errorMessage(e));
      setSending(false);
    }
  }

  return (
    <main className="flex flex-1 flex-col md:flex-row">
      <section className="bg-brand-highlight flex flex-col justify-center gap-3 px-8 py-12 md:w-[480px] md:px-14">
        <div className="bg-background flex size-16 items-center justify-center rounded-[20px]">
          <Image src="/pulse.svg" alt="" width={32} height={32} priority />
        </div>
        <h2 className="text-title-page font-bold">
          Decisões justas começam com a revisão de quem cuida.
        </h2>
        <p className="text-body text-brand">
          A IA propõe, você decide. Toda decisão fica registrada com seu nome,
          data e hora.
        </p>
      </section>
      <section className="flex flex-1 items-center justify-center px-6 py-12">
        <form
          onSubmit={submit}
          className="flex w-full max-w-[380px] flex-col gap-3.5"
        >
          <h1 className="text-title-page font-bold">
            Entrar no SUSight Clínica
          </h1>
          <p className="text-subtitle text-ink-secondary">
            Use sua conta gov.br ou seu registro profissional.
          </p>
          {params.get("expirou") && (
            <Notice
              title="Sua sessão expirou. Entre novamente."
              tone="warning"
            />
          )}
          {/* ponytail: gov.br ainda sem integração (spec 002, questão em aberto) */}
          <button
            type="button"
            disabled
            title="Entrada com gov.br ainda não está disponível"
            className="text-body h-14 w-full rounded-[28px] bg-[#111] font-semibold text-white disabled:opacity-50"
          >
            Entrar com gov.br
          </button>
          <p className="text-note text-ink-secondary text-center">
            ou entre com seu CRM
          </p>
          <TextField
            label="CRM e UF"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="CRM/RJ 123456"
            autoComplete="username"
            required
          />
          <TextField
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          {/* ponytail: código de verificação só no layout; o contrato ainda não o recebe */}
          <TextField
            label="Código de verificação"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="000 000"
            inputMode="numeric"
            autoComplete="one-time-code"
          />
          {error && (
            <p role="alert" className="text-destructive text-subtitle">
              {error}
            </p>
          )}
          <Button
            type="submit"
            disabled={sending}
            className="text-body h-14 rounded-[28px] font-semibold"
          >
            Entrar
          </Button>
        </form>
      </section>
    </main>
  );
}
