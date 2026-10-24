import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Esconde o botão "N" do Next que aparece só em desenvolvimento.
  devIndicators: false,
  cacheComponents: true,
  partialPrefetching: true,
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
