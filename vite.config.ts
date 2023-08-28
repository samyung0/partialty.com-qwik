import { defineConfig, loadEnv } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";

const config = {
  plugins: [qwikCity(), qwikVite(), tsconfigPaths()],
  define: {},
  preview: {
    headers: {
      "Cache-Control": "public, max-age=600",
    },
  },
};

export default defineConfig((userConfig) => {
  process.env = { ...process.env, ...loadEnv(userConfig.mode, process.cwd()) };
  return config;
});
