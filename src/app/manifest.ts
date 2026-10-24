import type { MetadataRoute } from "next";

/** Widget do painel do Windows 11 (membro `widgets` do manifest, ainda fora dos tipos do Next). */
type WindowsWidget = {
  name: string;
  short_name: string;
  description: string;
  tag: string;
  ms_ac_template: string;
  data: string;
  type: "application/json";
  screenshots: { src: string; sizes: string; label: string }[];
  icons: { src: string; sizes: string }[];
  auth: boolean;
  /** Intervalo de atualização, em segundos. */
  update?: number;
};

// Manifest do PWA (spec 010): permite instalar o SUSight Clínica e usar os widgets do Windows 11.
export default function manifest(): MetadataRoute.Manifest & {
  widgets: WindowsWidget[];
} {
  return {
    name: "SUSight Clínica",
    short_name: "SUSight Clínica",
    description: "Revisão segura e explicável da fila do SUS",
    lang: "pt-BR",
    start_url: "/revisoes",
    scope: "/",
    display: "standalone",
    background_color: "#F9D6E4",
    theme_color: "#A3205B",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    widgets: [
      {
        name: "Aprovações",
        short_name: "Aprovações",
        description: "Quantas propostas esperam a sua revisão.",
        tag: "aprovacoes",
        ms_ac_template: "/widgets/aprovacoes.json",
        data: "/api/widgets/aprovacoes",
        type: "application/json",
        screenshots: [
          {
            src: "/widgets/aprovacoes-preview.png",
            sizes: "600x400",
            label: "Widget Aprovações",
          },
        ],
        icons: [{ src: "/widgets/icon-64.png", sizes: "64x64" }],
        auth: false,
        update: 900,
      },
      {
        name: "Enviar documento",
        short_name: "Enviar documento",
        description: "Atalho para enviar um exame ou laudo.",
        tag: "enviar-documento",
        ms_ac_template: "/widgets/enviar-documento.json",
        data: "/widgets/enviar-documento-data.json",
        type: "application/json",
        screenshots: [
          {
            src: "/widgets/aprovacoes-preview.png",
            sizes: "600x400",
            label: "Widgets do SUSight Clínica",
          },
        ],
        icons: [{ src: "/widgets/icon-64.png", sizes: "64x64" }],
        auth: false,
      },
    ],
  };
}
