"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
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
  const [error, setError] = useState<string>();
  const [sending, setSending] = useState(false);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    return enter({ identifier, password });
  }

  const filled = identifier.trim() !== "" && password !== "";

  async function enter(credentials: { identifier: string; password: string }) {
    if (sending) return;
    setSending(true);
    setError(undefined);
    try {
      await dataSource.login(credentials);
      router.replace(safeNext(params.get("next")));
    } catch (e) {
      setError(errorMessage(e));
      setSending(false);
    }
  }

  return (
    <main className="flex flex-1 flex-col md:flex-row">
      <section className="bg-brand-highlight flex flex-col justify-center gap-3 px-8 py-12 md:w-[480px] md:px-14">
        <Image
          src="/logo.png"
          alt=""
          width={64}
          height={64}
          className="rounded-[20px]"
          priority
        />
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
            Use seu usuário e senha.
          </p>
          {params.get("expirou") && (
            <Notice
              title="Sua sessão expirou. Entre novamente."
              tone="warning"
            />
          )}
          <TextField
            label="Usuário"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="medico-demo"
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
          {error && (
            <p role="alert" className="text-destructive text-subtitle">
              {error}
            </p>
          )}
          <Button
            type="submit"
            disabled={sending}
            className={cn(
              "text-body h-14 rounded-[28px] font-semibold",
              filled && "bg-brand hover:bg-brand/90 text-white",
            )}
          >
            Entrar
          </Button>
        </form>
      </section>
    </main>
  );
}
