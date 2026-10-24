// Service worker do SUSight Clínica (spec 010): widgets do Windows 11 e avisos por Web Push.
// Regras e textos vêm prontos das rotas e dos modelos; aqui só exibimos e abrimos telas.

// Tela aberta por cada widget quando o clique não traz URL.
const WIDGET_URLS = {
  aprovacoes: "/revisoes",
  "enviar-documento": "/enviar-documento",
};

/** Busca o modelo e os dados e redesenha o widget. */
async function renderWidget(widget) {
  const { tag, msAcTemplate, data } = widget.definition;
  const [template, payload] = await Promise.all([
    fetch(msAcTemplate).then((response) => response.text()),
    fetch(data, { credentials: "include", cache: "no-store" }).then(
      (response) => response.text(),
    ),
  ]);
  await self.widgets.updateByTag(tag, { template, data: payload });
}

async function renderByTag(tag) {
  const widget = await self.widgets.getByTag(tag);
  if (widget) await renderWidget(widget);
}

/** Abre uma tela do próprio site, reaproveitando a janela já aberta. */
async function openUrl(url) {
  const target = new URL(url || "/revisoes", self.location.origin);
  if (target.origin !== self.location.origin) return;
  const windows = await self.clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });
  const existing = windows.find((client) =>
    client.url.startsWith(self.location.origin),
  );
  if (existing) {
    await existing.focus();
    await existing.navigate(target.href);
  } else {
    await self.clients.openWindow(target.href);
  }
}

function clickData(event) {
  if (typeof event.data === "string") {
    try {
      return JSON.parse(event.data);
    } catch {
      return {};
    }
  }
  return event.data ?? {};
}

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) =>
  event.waitUntil(self.clients.claim()),
);

// Widget adicionado ao painel: desenha e agenda a atualização periódica.
self.addEventListener("widgetinstall", (event) => {
  event.waitUntil(
    (async () => {
      await renderWidget(event.widget);
      const { tag, update } = event.widget.definition;
      if (update && self.registration.periodicSync) {
        await self.registration.periodicSync
          .register(tag, { minInterval: update * 1000 })
          .catch(() => {});
      }
    })(),
  );
});

// Painel aberto: redesenha com os dados atuais.
self.addEventListener("widgetresume", (event) => {
  event.waitUntil(renderWidget(event.widget));
});

self.addEventListener("widgetuninstall", (event) => {
  const { tag } = event.widget.definition;
  event.waitUntil(
    self.registration.periodicSync?.unregister(tag) ?? Promise.resolve(),
  );
});

self.addEventListener("periodicsync", (event) => {
  if (event.tag in WIDGET_URLS) event.waitUntil(renderByTag(event.tag));
});

// Botões dos widgets só abrem telas: nenhum widget aprova ou rejeita.
self.addEventListener("widgetclick", (event) => {
  if (event.action !== "open") return;
  const tag = event.widget?.definition?.tag;
  event.waitUntil(openUrl(clickData(event).url ?? WIDGET_URLS[tag]));
});

// Aviso por Web Push. O conteúdo vem pronto do servidor (notificationFor em src/lib/widgets).
self.addEventListener("push", (event) => {
  let notification = null;
  try {
    notification = event.data?.json() ?? null;
  } catch {
    return;
  }
  if (!notification?.title) return;
  event.waitUntil(
    self.registration.showNotification(notification.title, {
      body: notification.body,
      tag: notification.tag,
      lang: "pt-BR",
      icon: "/icons/icon-192.png",
      data: { url: notification.url },
      actions: notification.actions ?? [],
    }),
  );
});

// Clique no aviso ou no botão ("Revisar", "Abrir"): só abre a tela, nunca decide nada.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(openUrl(event.notification.data?.url));
});
