import { qwikCity } from "@builder.io/qwik-city/vite";
import { qwikReact } from "@builder.io/qwik-react/vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikSpeakInline } from "qwik-speak/inline";
import { defineConfig, type Connect } from "vite";
import compileTime from "vite-plugin-compile-time";
import tsconfigPaths from "vite-tsconfig-paths";
import lang from "./lang";
import { config } from "./src/speak-config";
const crossOriginIsolationMiddleware: Connect.NextHandleFunction = (req, response, next) => {
  if (req.url && /^(\/.*)?\/codeplayground/.test(req.url)) {
    response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    response.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  }
  next();
};

export default defineConfig(() => {
  // process.env = { ...process.env, ...loadEnv(userConfig.mode, process.cwd()) };
  return {
    plugins: [
      qwikCity({
        allowedParams: {
          lang: config.supportedLocales.map((locale) => locale.lang),
        },
      }),
      qwikVite({
        entryStrategy: {
          type: "smart",
        },
      }),
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
      compileTime(),
      qwikReact(),
    ],
    // node_modules\@babel\types\lib\definitions\core.js
    define: { "process.env.BABEL_TYPES_8_BREAKING": "false" },
    dev: {
      headers: {
        "Cache-Control": "public, max-age=0",
      },
    },
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    },
  };
});
