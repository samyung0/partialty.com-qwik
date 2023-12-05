import { qwikCity } from "@builder.io/qwik-city/vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikSpeakInline } from "qwik-speak/inline";
import { defineConfig, type Connect } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import lang from "./lang.json";

const crossOriginIsolationMiddleware: Connect.NextHandleFunction = (req, response, next) => {
  if (req.url === "/codeplayground/") {
    response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    response.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  }
  next();
};

export default defineConfig((userConfig) => {
  // process.env = { ...process.env, ...loadEnv(userConfig.mode, process.cwd()) };
  return {
    plugins: [
      qwikCity(),
      qwikVite(),
      qwikSpeakInline({
        supportedLangs: lang.supportedLocales.map((locale) => locale.lang),
        defaultLang: lang.defaultLocale.lang,
        assetsPath: "i18n",
      }),
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
    // node_modules\@babel\types\lib\definitions\core.js
    define: { "process.env.BABEL_TYPES_8_BREAKING": "false" },
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    },
  };
});
