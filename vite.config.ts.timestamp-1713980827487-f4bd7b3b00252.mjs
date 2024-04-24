// vite.config.ts
import { qwikCity } from "file:///home/sam/WEB/partialty-wsl/node_modules/@builder.io/qwik-city/vite/index.mjs";
import { qwikInsights } from "file:///home/sam/WEB/partialty-wsl/node_modules/@builder.io/qwik-labs/vite/index.js";
import { qwikReact } from "file:///home/sam/WEB/partialty-wsl/node_modules/@builder.io/qwik-react/lib/vite.mjs";
import { qwikVite } from "file:///home/sam/WEB/partialty-wsl/node_modules/@builder.io/qwik/optimizer.mjs";
import { qwikSpeakInline } from "file:///home/sam/WEB/partialty-wsl/node_modules/qwik-speak/inline/index.mjs";
import { defineConfig, loadEnv } from "file:///home/sam/WEB/partialty-wsl/node_modules/vite/dist/node/index.js";
import compileTime from "file:///home/sam/WEB/partialty-wsl/node_modules/vite-plugin-compile-time/dist/index.mjs";
import tsconfigPaths from "file:///home/sam/WEB/partialty-wsl/node_modules/vite-tsconfig-paths/dist/index.mjs";
import { sentryVitePlugin } from "file:///home/sam/WEB/partialty-wsl/node_modules/@sentry/vite-plugin/dist/esm/index.mjs";

// lang.ts
var lang_default = {
  defaultLocale: { lang: "en-US", currency: "USD" },
  supportedLocales: [
    { lang: "zh-HK", currency: "HKD" },
    { lang: "ja-JP", currency: "JPY" },
    { lang: "en-US", currency: "USD" }
  ]
};

// src/speak-config.ts
var config = {
  defaultLocale: lang_default.defaultLocale,
  supportedLocales: [...lang_default.supportedLocales],
  assets: [
    "app"
    // Translations shared by the pages
  ],
  runtimeAssets: [
    // "runtime", // Translations with dynamic keys or parameters
  ]
};

// vite.config.ts
var crossOriginIsolationMiddleware = (req, response, next) => {
  if (req.url && /^(\/.*)?\/codeplayground/.test(req.url)) {
    response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    response.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  }
  next();
};
var vite_config_default = defineConfig(() => {
  return {
    plugins: [
      qwikInsights({
        publicApiKey: loadEnv("", ".", "").PUBLIC_QWIK_INSIGHTS_KEY
      }),
      qwikCity({
        allowedParams: {
          lang: config.supportedLocales.map((locale) => locale.lang)
        }
      }),
      qwikVite({
        entryStrategy: {
          type: "smart"
        }
      }),
      qwikSpeakInline({
        supportedLangs: lang_default.supportedLocales.map((locale) => locale.lang),
        defaultLang: lang_default.defaultLocale.lang,
        assetsPath: "i18n"
      }),
      tsconfigPaths(),
      {
        name: "cross-origin-isolation",
        configureServer: (server) => {
          server.middlewares.use(crossOriginIsolationMiddleware);
        },
        configurePreviewServer: (server) => {
          server.middlewares.use(crossOriginIsolationMiddleware);
        }
      },
      compileTime(),
      qwikReact(),
      sentryVitePlugin({
        authToken: loadEnv("", ".", "").SENTRY_AUTH_TOKEN_JS,
        org: "partialtycom",
        project: "partialty-client"
      }),
      sentryVitePlugin({
        authToken: loadEnv("", ".", "").SENTRY_AUTH_TOKEN_NODE,
        org: "partialtycom",
        project: "partialty-serverentry"
      })
    ],
    // node_modules\@babel\types\lib\definitions\core.js
    define: { "process.env.BABEL_TYPES_8_BREAKING": "false" },
    dev: {
      headers: {
        "Cache-Control": "public, max-age=0"
      }
    },
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600"
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAibGFuZy50cyIsICJzcmMvc3BlYWstY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvc2FtL1dFQi9wYXJ0aWFsdHktd3NsXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9zYW0vV0VCL3BhcnRpYWx0eS13c2wvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvc2FtL1dFQi9wYXJ0aWFsdHktd3NsL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgcXdpa0NpdHkgfSBmcm9tICdAYnVpbGRlci5pby9xd2lrLWNpdHkvdml0ZSc7XG5pbXBvcnQgeyBxd2lrSW5zaWdodHMgfSBmcm9tICdAYnVpbGRlci5pby9xd2lrLWxhYnMvdml0ZSc7XG5pbXBvcnQgeyBxd2lrUmVhY3QgfSBmcm9tICdAYnVpbGRlci5pby9xd2lrLXJlYWN0L3ZpdGUnO1xuaW1wb3J0IHsgcXdpa1ZpdGUgfSBmcm9tICdAYnVpbGRlci5pby9xd2lrL29wdGltaXplcic7XG5pbXBvcnQgeyBxd2lrU3BlYWtJbmxpbmUgfSBmcm9tICdxd2lrLXNwZWFrL2lubGluZSc7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYsIHR5cGUgQ29ubmVjdCB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IGNvbXBpbGVUaW1lIGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXBpbGUtdGltZSc7XG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJztcbmltcG9ydCB7IHNlbnRyeVZpdGVQbHVnaW4gfSBmcm9tIFwiQHNlbnRyeS92aXRlLXBsdWdpblwiO1xuaW1wb3J0IGxhbmcgZnJvbSAnLi9sYW5nJztcbmltcG9ydCB7IGNvbmZpZyB9IGZyb20gJy4vc3JjL3NwZWFrLWNvbmZpZyc7XG5jb25zdCBjcm9zc09yaWdpbklzb2xhdGlvbk1pZGRsZXdhcmU6IENvbm5lY3QuTmV4dEhhbmRsZUZ1bmN0aW9uID0gKHJlcSwgcmVzcG9uc2UsIG5leHQpID0+IHtcbiAgaWYgKHJlcS51cmwgJiYgL14oXFwvLiopP1xcL2NvZGVwbGF5Z3JvdW5kLy50ZXN0KHJlcS51cmwpKSB7XG4gICAgcmVzcG9uc2Uuc2V0SGVhZGVyKCdDcm9zcy1PcmlnaW4tT3BlbmVyLVBvbGljeScsICdzYW1lLW9yaWdpbicpO1xuICAgIHJlc3BvbnNlLnNldEhlYWRlcignQ3Jvc3MtT3JpZ2luLUVtYmVkZGVyLVBvbGljeScsICdyZXF1aXJlLWNvcnAnKTtcbiAgfVxuICBuZXh0KCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKCkgPT4ge1xuICAvLyBwcm9jZXNzLmVudiA9IHsgLi4ucHJvY2Vzcy5lbnYsIC4uLmxvYWRFbnYodXNlckNvbmZpZy5tb2RlLCBwcm9jZXNzLmN3ZCgpKSB9O1xuICByZXR1cm4ge1xuICAgIHBsdWdpbnM6IFtcbiAgICAgIHF3aWtJbnNpZ2h0cyh7XG4gICAgICAgIHB1YmxpY0FwaUtleTogbG9hZEVudignJywgJy4nLCAnJykuUFVCTElDX1FXSUtfSU5TSUdIVFNfS0VZLFxuICAgICAgfSksXG4gICAgICBxd2lrQ2l0eSh7XG4gICAgICAgIGFsbG93ZWRQYXJhbXM6IHtcbiAgICAgICAgICBsYW5nOiBjb25maWcuc3VwcG9ydGVkTG9jYWxlcy5tYXAoKGxvY2FsZSkgPT4gbG9jYWxlLmxhbmcpLFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBxd2lrVml0ZSh7XG4gICAgICAgIGVudHJ5U3RyYXRlZ3k6IHtcbiAgICAgICAgICB0eXBlOiAnc21hcnQnLFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBxd2lrU3BlYWtJbmxpbmUoe1xuICAgICAgICBzdXBwb3J0ZWRMYW5nczogbGFuZy5zdXBwb3J0ZWRMb2NhbGVzLm1hcCgobG9jYWxlKSA9PiBsb2NhbGUubGFuZyksXG4gICAgICAgIGRlZmF1bHRMYW5nOiBsYW5nLmRlZmF1bHRMb2NhbGUubGFuZyxcbiAgICAgICAgYXNzZXRzUGF0aDogJ2kxOG4nLFxuICAgICAgfSksXG4gICAgICB0c2NvbmZpZ1BhdGhzKCksXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdjcm9zcy1vcmlnaW4taXNvbGF0aW9uJyxcbiAgICAgICAgY29uZmlndXJlU2VydmVyOiAoc2VydmVyKSA9PiB7XG4gICAgICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZShjcm9zc09yaWdpbklzb2xhdGlvbk1pZGRsZXdhcmUpO1xuICAgICAgICB9LFxuICAgICAgICBjb25maWd1cmVQcmV2aWV3U2VydmVyOiAoc2VydmVyKSA9PiB7XG4gICAgICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZShjcm9zc09yaWdpbklzb2xhdGlvbk1pZGRsZXdhcmUpO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGNvbXBpbGVUaW1lKCksXG4gICAgICBxd2lrUmVhY3QoKSxcbiAgICAgIHNlbnRyeVZpdGVQbHVnaW4oe1xuICAgICAgICBhdXRoVG9rZW46IGxvYWRFbnYoJycsICcuJywgJycpLlNFTlRSWV9BVVRIX1RPS0VOX0pTLFxuICAgICAgICBvcmc6IFwicGFydGlhbHR5Y29tXCIsXG4gICAgICAgIHByb2plY3Q6IFwicGFydGlhbHR5LWNsaWVudFwiLFxuICAgICAgfSksXG4gICAgICBzZW50cnlWaXRlUGx1Z2luKHtcbiAgICAgICAgYXV0aFRva2VuOiBsb2FkRW52KCcnLCAnLicsICcnKS5TRU5UUllfQVVUSF9UT0tFTl9OT0RFLFxuICAgICAgICBvcmc6IFwicGFydGlhbHR5Y29tXCIsXG4gICAgICAgIHByb2plY3Q6IFwicGFydGlhbHR5LXNlcnZlcmVudHJ5XCIsXG4gICAgICB9KSxcbiAgICBdLFxuICAgIC8vIG5vZGVfbW9kdWxlc1xcQGJhYmVsXFx0eXBlc1xcbGliXFxkZWZpbml0aW9uc1xcY29yZS5qc1xuICAgIGRlZmluZTogeyAncHJvY2Vzcy5lbnYuQkFCRUxfVFlQRVNfOF9CUkVBS0lORyc6ICdmYWxzZScgfSxcbiAgICBkZXY6IHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0NhY2hlLUNvbnRyb2wnOiAncHVibGljLCBtYXgtYWdlPTAnLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHByZXZpZXc6IHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0NhY2hlLUNvbnRyb2wnOiAncHVibGljLCBtYXgtYWdlPTYwMCcsXG4gICAgICB9LFxuICAgIH0sXG4gIH07XG59KTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvc2FtL1dFQi9wYXJ0aWFsdHktd3NsXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9zYW0vV0VCL3BhcnRpYWx0eS13c2wvbGFuZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9zYW0vV0VCL3BhcnRpYWx0eS13c2wvbGFuZy50c1wiO2V4cG9ydCBkZWZhdWx0IHtcbiAgZGVmYXVsdExvY2FsZTogeyBsYW5nOiAnZW4tVVMnLCBjdXJyZW5jeTogJ1VTRCcgfSxcbiAgc3VwcG9ydGVkTG9jYWxlczogW1xuICAgIHsgbGFuZzogJ3poLUhLJywgY3VycmVuY3k6ICdIS0QnIH0sXG4gICAgeyBsYW5nOiAnamEtSlAnLCBjdXJyZW5jeTogJ0pQWScgfSxcbiAgICB7IGxhbmc6ICdlbi1VUycsIGN1cnJlbmN5OiAnVVNEJyB9LFxuICBdLFxufSBhcyBjb25zdDtcblxuZXhwb3J0IGNvbnN0IGRpc3BsYXlOYW1lc0xhbmcgPSB7XG4gICd6aC1ISyc6ICdDaGluZXNlICh0cmFkaXRpb25hbCknLFxuICAnamEtSlAnOiAnSmFwYW5lc2UnLFxuICAnZW4tVVMnOiAnRW5nbGlzaCcsXG59IGFzIGNvbnN0O1xuXG5leHBvcnQgY29uc3QgbGlzdFN1cHBvcnRlZExhbmcgPSBbXG4gIHsgdmFsdWU6ICdlbi1VUycsIGxhYmVsOiAnRW5nbGlzaCcgfSxcbiAgeyB2YWx1ZTogJ3poLUhLJywgbGFiZWw6ICdDaGluZXNlICh0cmFkaXRpb25hbCknIH0sXG4gIHsgdmFsdWU6ICd6aC1DTicsIGxhYmVsOiAnQ2hpbmVzZSAoc2ltcGxpZmllZCknIH0sXG4gIHsgdmFsdWU6ICdqYS1KUCcsIGxhYmVsOiAnSmFwYW5lc2UnIH0sXG4gIHsgdmFsdWU6ICdrby1LUicsIGxhYmVsOiAnS29yZWFuJyB9LFxuICB7IHZhbHVlOiAnZnItRlInLCBsYWJlbDogJ0ZyZW5jaCcgfSxcbiAgeyB2YWx1ZTogJ2VzLUVTJywgbGFiZWw6ICdTcGFuaXNoJyB9LFxuICB7IHZhbHVlOiAnZGUtREUnLCBsYWJlbDogJ0dlcm1hbicgfSxcbiAgeyB2YWx1ZTogJ2l0LUlUJywgbGFiZWw6ICdJdGFsaWFuJyB9LFxuICB7IHZhbHVlOiAncHQtUFQnLCBsYWJlbDogJ1BvcnR1Z3Vlc2UnIH0sXG4gIHsgdmFsdWU6ICdydS1SVScsIGxhYmVsOiAnUnVzc2lhbicgfSxcbl07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL3NhbS9XRUIvcGFydGlhbHR5LXdzbC9zcmNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3NhbS9XRUIvcGFydGlhbHR5LXdzbC9zcmMvc3BlYWstY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3NhbS9XRUIvcGFydGlhbHR5LXdzbC9zcmMvc3BlYWstY29uZmlnLnRzXCI7aW1wb3J0IHR5cGUgeyBTcGVha0NvbmZpZyB9IGZyb20gJ3F3aWstc3BlYWsnO1xuaW1wb3J0IGxhbmcgZnJvbSAnLi4vbGFuZyc7XG5cbmV4cG9ydCBjb25zdCBjb25maWc6IFNwZWFrQ29uZmlnID0ge1xuICBkZWZhdWx0TG9jYWxlOiBsYW5nLmRlZmF1bHRMb2NhbGUsXG4gIHN1cHBvcnRlZExvY2FsZXM6IFsuLi5sYW5nLnN1cHBvcnRlZExvY2FsZXNdLFxuICBhc3NldHM6IFtcbiAgICAnYXBwJywgLy8gVHJhbnNsYXRpb25zIHNoYXJlZCBieSB0aGUgcGFnZXNcbiAgXSxcbiAgcnVudGltZUFzc2V0czogW1xuICAgIC8vIFwicnVudGltZVwiLCAvLyBUcmFuc2xhdGlvbnMgd2l0aCBkeW5hbWljIGtleXMgb3IgcGFyYW1ldGVyc1xuICBdLFxufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBbVEsU0FBUyxnQkFBZ0I7QUFDNVIsU0FBUyxvQkFBb0I7QUFDN0IsU0FBUyxpQkFBaUI7QUFDMUIsU0FBUyxnQkFBZ0I7QUFDekIsU0FBUyx1QkFBdUI7QUFDaEMsU0FBUyxjQUFjLGVBQTZCO0FBQ3BELE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sbUJBQW1CO0FBQzFCLFNBQVMsd0JBQXdCOzs7QUNSb04sSUFBTyxlQUFRO0FBQUEsRUFDbFEsZUFBZSxFQUFFLE1BQU0sU0FBUyxVQUFVLE1BQU07QUFBQSxFQUNoRCxrQkFBa0I7QUFBQSxJQUNoQixFQUFFLE1BQU0sU0FBUyxVQUFVLE1BQU07QUFBQSxJQUNqQyxFQUFFLE1BQU0sU0FBUyxVQUFVLE1BQU07QUFBQSxJQUNqQyxFQUFFLE1BQU0sU0FBUyxVQUFVLE1BQU07QUFBQSxFQUNuQztBQUNGOzs7QUNKTyxJQUFNLFNBQXNCO0FBQUEsRUFDakMsZUFBZSxhQUFLO0FBQUEsRUFDcEIsa0JBQWtCLENBQUMsR0FBRyxhQUFLLGdCQUFnQjtBQUFBLEVBQzNDLFFBQVE7QUFBQSxJQUNOO0FBQUE7QUFBQSxFQUNGO0FBQUEsRUFDQSxlQUFlO0FBQUE7QUFBQSxFQUVmO0FBQ0Y7OztBRkRBLElBQU0saUNBQTZELENBQUMsS0FBSyxVQUFVLFNBQVM7QUFDMUYsTUFBSSxJQUFJLE9BQU8sMkJBQTJCLEtBQUssSUFBSSxHQUFHLEdBQUc7QUFDdkQsYUFBUyxVQUFVLDhCQUE4QixhQUFhO0FBQzlELGFBQVMsVUFBVSxnQ0FBZ0MsY0FBYztBQUFBLEVBQ25FO0FBQ0EsT0FBSztBQUNQO0FBRUEsSUFBTyxzQkFBUSxhQUFhLE1BQU07QUFFaEMsU0FBTztBQUFBLElBQ0wsU0FBUztBQUFBLE1BQ1AsYUFBYTtBQUFBLFFBQ1gsY0FBYyxRQUFRLElBQUksS0FBSyxFQUFFLEVBQUU7QUFBQSxNQUNyQyxDQUFDO0FBQUEsTUFDRCxTQUFTO0FBQUEsUUFDUCxlQUFlO0FBQUEsVUFDYixNQUFNLE9BQU8saUJBQWlCLElBQUksQ0FBQyxXQUFXLE9BQU8sSUFBSTtBQUFBLFFBQzNEO0FBQUEsTUFDRixDQUFDO0FBQUEsTUFDRCxTQUFTO0FBQUEsUUFDUCxlQUFlO0FBQUEsVUFDYixNQUFNO0FBQUEsUUFDUjtBQUFBLE1BQ0YsQ0FBQztBQUFBLE1BQ0QsZ0JBQWdCO0FBQUEsUUFDZCxnQkFBZ0IsYUFBSyxpQkFBaUIsSUFBSSxDQUFDLFdBQVcsT0FBTyxJQUFJO0FBQUEsUUFDakUsYUFBYSxhQUFLLGNBQWM7QUFBQSxRQUNoQyxZQUFZO0FBQUEsTUFDZCxDQUFDO0FBQUEsTUFDRCxjQUFjO0FBQUEsTUFDZDtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04saUJBQWlCLENBQUMsV0FBVztBQUMzQixpQkFBTyxZQUFZLElBQUksOEJBQThCO0FBQUEsUUFDdkQ7QUFBQSxRQUNBLHdCQUF3QixDQUFDLFdBQVc7QUFDbEMsaUJBQU8sWUFBWSxJQUFJLDhCQUE4QjtBQUFBLFFBQ3ZEO0FBQUEsTUFDRjtBQUFBLE1BQ0EsWUFBWTtBQUFBLE1BQ1osVUFBVTtBQUFBLE1BQ1YsaUJBQWlCO0FBQUEsUUFDZixXQUFXLFFBQVEsSUFBSSxLQUFLLEVBQUUsRUFBRTtBQUFBLFFBQ2hDLEtBQUs7QUFBQSxRQUNMLFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQSxNQUNELGlCQUFpQjtBQUFBLFFBQ2YsV0FBVyxRQUFRLElBQUksS0FBSyxFQUFFLEVBQUU7QUFBQSxRQUNoQyxLQUFLO0FBQUEsUUFDTCxTQUFTO0FBQUEsTUFDWCxDQUFDO0FBQUEsSUFDSDtBQUFBO0FBQUEsSUFFQSxRQUFRLEVBQUUsc0NBQXNDLFFBQVE7QUFBQSxJQUN4RCxLQUFLO0FBQUEsTUFDSCxTQUFTO0FBQUEsUUFDUCxpQkFBaUI7QUFBQSxNQUNuQjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLFNBQVM7QUFBQSxRQUNQLGlCQUFpQjtBQUFBLE1BQ25CO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
