"use client";

import { useEffect } from "react";

/** Registra o service worker dos widgets e avisos (spec 010). Sem suporte, não faz nada. */
export function ServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .catch((error) => {
        console.warn("Não foi possível registrar o service worker.", error);
      });
  }, []);
  return null;
}
