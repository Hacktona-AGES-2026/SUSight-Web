import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Esconde o botão "N" do Next que aparece só em desenvolvimento.
  devIndicators: false,
  cacheComponents: true,
  // O aviso "Insight" do modo dev vem da validação de navegação instantânea.
  experimental: { instantInsights: { validationLevel: "manual-warning" } },
  partialPrefetching: true,
  // O navegador chama /backend/* e o Next repassa ao SUSight-Backend (evita CORS).
  async rewrites() {
    const backend = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";
    return [{ source: "/backend/:path*", destination: `${backend}/:path*` }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
