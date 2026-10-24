"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ApiError } from "@/lib/data";

export function errorMessage(error: unknown) {
  if (error instanceof ApiError) return error.body.message;
  return "Não foi possível conectar. Tente novamente.";
}

/** Leva ao login quando a sessão expirou (401). */
export function useSessionRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  return useCallback(
    (error: unknown) => {
      if (error instanceof ApiError && error.status === 401) {
        router.replace(`/login?expirou=1&next=${encodeURIComponent(pathname)}`);
        return true;
      }
      return false;
    },
    [router, pathname],
  );
}

/** Intervalo da atualização em segundo plano (a fila é compartilhada e muda a todo momento). */
export const REFRESH_MS = 5000;

type State<T> = { key: string; data?: T; error?: string };

/**
 * Carrega dados quando `key` muda e expõe `retry`. `load` deve depender só
 * do que está em `key`.
 */
export function useData<T>(key: string, load: () => Promise<T>, refreshMs = REFRESH_MS) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<State<T>>({ key: "" });
  const redirect = useSessionRedirect();
  const current = `${key}#${attempt}`;

  useEffect(() => {
    let cancelled = false;
    load().then(
      (data) => !cancelled && setState({ key: current, data }),
      (error) => {
        if (cancelled || redirect(error)) return;
        setState({ key: current, error: errorMessage(error) });
      },
    );
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  // Atualiza em silêncio com a aba visível; falha momentânea mantém o que já está na tela.
  useEffect(() => {
    if (!refreshMs) return;
    let cancelled = false;
    const timer = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      load().then(
        (data) =>
          !cancelled &&
          setState((old) =>
            old.key === current && JSON.stringify(old.data) !== JSON.stringify(data)
              ? { key: current, data }
              : old,
          ),
        (error) => {
          if (!cancelled) redirect(error);
        },
      );
    }, refreshMs);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, refreshMs]);

  const ready = state.key === current;
  return {
    data: ready ? state.data : undefined,
    error: ready ? state.error : undefined,
    loading: !ready,
    retry: () => setAttempt((n) => n + 1),
  };
}
