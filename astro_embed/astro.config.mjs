import react from "@astrojs/react";
import solidJs from "@astrojs/solid-js";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
import { defineConfig } from "astro/config";

import qwikdev from "@qwikdev/astro";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    solidJs(),
    svelte(),
    qwikdev(),
  ],
  output: "hybrid",
  adapter: vercel(),
  vite: {
    ssr: {
      noExternal: ['path-to-regexp'],
    }
  }
});
