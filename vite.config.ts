import { qwikCity } from "@builder.io/qwik-city/vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { defineConfig, loadEnv, type Connect } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const crossOriginIsolationMiddleware: Connect.NextHandleFunction = (_, response, next) => {
  response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  response.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
};

export default defineConfig((userConfig) => {
  process.env = { ...process.env, ...loadEnv(userConfig.mode, process.cwd()) };
  return {
    plugins: [
      qwikCity(),
      qwikVite(),
      tsconfigPaths(),
      {
        name: "cross-origin-isolation",
        configureServer: (server) => {
          server.middlewares.use(crossOriginIsolationMiddleware);
        },
        configurePreviewServer: (server) => {
          server.middlewares.use(crossOriginIsolationMiddleware);
        },
      },
    ],
    define: {},
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    },
  };
});
