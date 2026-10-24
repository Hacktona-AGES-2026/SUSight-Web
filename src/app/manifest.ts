import type { MetadataRoute } from "next";

// Manifest do PWA (spec 010): permite instalar o SUSight Clínica e usar os widgets do Windows 11.
export default function manifest(): MetadataRoute.Manifest {
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
  };
}
