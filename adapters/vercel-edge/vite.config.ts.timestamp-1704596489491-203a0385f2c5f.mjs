// adapters/vercel-edge/vite.config.ts
import { vercelEdgeAdapter } from "file:///C:/WEB/PLAYGROUND/qwik/node_modules/@builder.io/qwik-city/adapters/vercel-edge/vite/index.mjs";
import { extendConfig } from "file:///C:/WEB/PLAYGROUND/qwik/node_modules/@builder.io/qwik-city/vite/index.mjs";

// vite.config.ts
import { qwikCity } from "file:///C:/WEB/PLAYGROUND/qwik/node_modules/@builder.io/qwik-city/vite/index.mjs";
import { qwikVite } from "file:///C:/WEB/PLAYGROUND/qwik/node_modules/@builder.io/qwik/optimizer.mjs";
import { qwikSpeakInline } from "file:///C:/WEB/PLAYGROUND/qwik/node_modules/qwik-speak/inline/index.mjs";
import compileTime from "file:///C:/WEB/PLAYGROUND/qwik/node_modules/vite-plugin-compile-time/dist/index.mjs";
import tsconfigPaths from "file:///C:/WEB/PLAYGROUND/qwik/node_modules/vite-tsconfig-paths/dist/index.mjs";
import { defineConfig } from "file:///C:/WEB/PLAYGROUND/qwik/node_modules/vite/dist/node/index.js";

// lang.json
var lang_default = {
  defaultLocale: { lang: "en-US", currency: "USD" },
  supportedLocales: [
    { lang: "zh-HK", currency: "HKD" },
    { lang: "ja-JP", currency: "JPY" },
    { lang: "en-US", currency: "USD" },
  ],
};

// src/speak-config.ts
var config = {
  ...lang_default,
  assets: [
    "app",
    // Translations shared by the pages
  ],
  runtimeAssets: [
    // "runtime", // Translations with dynamic keys or parameters
  ],
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
    build: {
      rollupOptions: {
        external: [/shikiji\/.*/],
      },
    },
    plugins: [
      qwikCity({
        allowedParams: {
          lang: config.supportedLocales.map((locale) => locale.lang),
        },
      }),
      qwikVite({
        // entryStrategy: {
        //   type: "component",
        // },
      }),
      qwikSpeakInline({
        supportedLangs: lang_default.supportedLocales.map((locale) => locale.lang),
        defaultLang: lang_default.defaultLocale.lang,
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

// adapters/vercel-edge/vite.config.ts
var vite_config_default2 = extendConfig(vite_config_default, () => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ["src/entry.vercel-edge.tsx", "@qwik-city-plan"],
      },
      outDir: ".vercel/output/functions/_qwik-city.func",
    },
    plugins: [vercelEdgeAdapter()],
  };
});
export { vite_config_default2 as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYWRhcHRlcnMvdmVyY2VsLWVkZ2Uvdml0ZS5jb25maWcudHMiLCAidml0ZS5jb25maWcudHMiLCAibGFuZy5qc29uIiwgInNyYy9zcGVhay1jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxXRUJcXFxcUExBWUdST1VORFxcXFxxd2lrXFxcXGFkYXB0ZXJzXFxcXHZlcmNlbC1lZGdlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxXRUJcXFxcUExBWUdST1VORFxcXFxxd2lrXFxcXGFkYXB0ZXJzXFxcXHZlcmNlbC1lZGdlXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9XRUIvUExBWUdST1VORC9xd2lrL2FkYXB0ZXJzL3ZlcmNlbC1lZGdlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgdmVyY2VsRWRnZUFkYXB0ZXIgfSBmcm9tIFwiQGJ1aWxkZXIuaW8vcXdpay1jaXR5L2FkYXB0ZXJzL3ZlcmNlbC1lZGdlL3ZpdGVcIjtcbmltcG9ydCB7IGV4dGVuZENvbmZpZyB9IGZyb20gXCJAYnVpbGRlci5pby9xd2lrLWNpdHkvdml0ZVwiO1xuaW1wb3J0IGJhc2VDb25maWcgZnJvbSBcIi4uLy4uL3ZpdGUuY29uZmlnXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGV4dGVuZENvbmZpZyhiYXNlQ29uZmlnLCAoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgYnVpbGQ6IHtcbiAgICAgIHNzcjogdHJ1ZSxcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgaW5wdXQ6IFtcInNyYy9lbnRyeS52ZXJjZWwtZWRnZS50c3hcIiwgXCJAcXdpay1jaXR5LXBsYW5cIl0sXG4gICAgICB9LFxuICAgICAgb3V0RGlyOiBcIi52ZXJjZWwvb3V0cHV0L2Z1bmN0aW9ucy9fcXdpay1jaXR5LmZ1bmNcIixcbiAgICB9LFxuICAgIHBsdWdpbnM6IFt2ZXJjZWxFZGdlQWRhcHRlcigpXSxcbiAgfTtcbn0pO1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxXRUJcXFxcUExBWUdST1VORFxcXFxxd2lrXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxXRUJcXFxcUExBWUdST1VORFxcXFxxd2lrXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9XRUIvUExBWUdST1VORC9xd2lrL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IGNvbXBpbGVUaW1lIGZyb20gXCJ2aXRlLXBsdWdpbi1jb21waWxlLXRpbWVcIlxuaW1wb3J0IHsgcXdpa0NpdHkgfSBmcm9tIFwiQGJ1aWxkZXIuaW8vcXdpay1jaXR5L3ZpdGVcIjtcbmltcG9ydCB7IHF3aWtWaXRlIH0gZnJvbSBcIkBidWlsZGVyLmlvL3F3aWsvb3B0aW1pemVyXCI7XG5pbXBvcnQgeyBxd2lrU3BlYWtJbmxpbmUgfSBmcm9tIFwicXdpay1zcGVhay9pbmxpbmVcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgdHlwZSBDb25uZWN0IH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gXCJ2aXRlLXRzY29uZmlnLXBhdGhzXCI7XG5pbXBvcnQgbGFuZyBmcm9tIFwiLi9sYW5nLmpzb25cIjtcbmltcG9ydCB7IGNvbmZpZyB9IGZyb20gXCIuL3NyYy9zcGVhay1jb25maWdcIjtcbmNvbnN0IGNyb3NzT3JpZ2luSXNvbGF0aW9uTWlkZGxld2FyZTogQ29ubmVjdC5OZXh0SGFuZGxlRnVuY3Rpb24gPSAocmVxLCByZXNwb25zZSwgbmV4dCkgPT4ge1xuICBpZiAocmVxLnVybCAmJiAvXihcXC8uKik/XFwvY29kZXBsYXlncm91bmQvLnRlc3QocmVxLnVybCkpIHtcbiAgICByZXNwb25zZS5zZXRIZWFkZXIoXCJDcm9zcy1PcmlnaW4tT3BlbmVyLVBvbGljeVwiLCBcInNhbWUtb3JpZ2luXCIpO1xuICAgIHJlc3BvbnNlLnNldEhlYWRlcihcIkNyb3NzLU9yaWdpbi1FbWJlZGRlci1Qb2xpY3lcIiwgXCJyZXF1aXJlLWNvcnBcIik7XG4gIH1cbiAgbmV4dCgpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCgpID0+IHtcbiAgLy8gcHJvY2Vzcy5lbnYgPSB7IC4uLnByb2Nlc3MuZW52LCAuLi5sb2FkRW52KHVzZXJDb25maWcubW9kZSwgcHJvY2Vzcy5jd2QoKSkgfTtcbiAgcmV0dXJuIHtcbiAgICBidWlsZDoge1xuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBleHRlcm5hbDogWy9zaGlraWppXFwvLiovXVxuICAgICAgfVxuICAgIH0sXG4gICAgcGx1Z2luczogW1xuICAgICAgcXdpa0NpdHkoe1xuICAgICAgICBhbGxvd2VkUGFyYW1zOiB7XG4gICAgICAgICAgbGFuZzogY29uZmlnLnN1cHBvcnRlZExvY2FsZXMubWFwKChsb2NhbGUpID0+IGxvY2FsZS5sYW5nKSxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgcXdpa1ZpdGUoe1xuICAgICAgICAvLyBlbnRyeVN0cmF0ZWd5OiB7XG4gICAgICAgIC8vICAgdHlwZTogXCJjb21wb25lbnRcIixcbiAgICAgICAgLy8gfSxcbiAgICAgIH0pLFxuICAgICAgcXdpa1NwZWFrSW5saW5lKHtcbiAgICAgICAgc3VwcG9ydGVkTGFuZ3M6IGxhbmcuc3VwcG9ydGVkTG9jYWxlcy5tYXAoKGxvY2FsZSkgPT4gbG9jYWxlLmxhbmcpLFxuICAgICAgICBkZWZhdWx0TGFuZzogbGFuZy5kZWZhdWx0TG9jYWxlLmxhbmcsXG4gICAgICAgIGFzc2V0c1BhdGg6IFwiaTE4blwiLFxuICAgICAgfSksXG4gICAgICB0c2NvbmZpZ1BhdGhzKCksXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiY3Jvc3Mtb3JpZ2luLWlzb2xhdGlvblwiLFxuICAgICAgICBjb25maWd1cmVTZXJ2ZXI6IChzZXJ2ZXIpID0+IHtcbiAgICAgICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKGNyb3NzT3JpZ2luSXNvbGF0aW9uTWlkZGxld2FyZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGNvbmZpZ3VyZVByZXZpZXdTZXJ2ZXI6IChzZXJ2ZXIpID0+IHtcbiAgICAgICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKGNyb3NzT3JpZ2luSXNvbGF0aW9uTWlkZGxld2FyZSk7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgY29tcGlsZVRpbWUoKVxuICAgIF0sXG4gICAgLy8gbm9kZV9tb2R1bGVzXFxAYmFiZWxcXHR5cGVzXFxsaWJcXGRlZmluaXRpb25zXFxjb3JlLmpzXG4gICAgZGVmaW5lOiB7IFwicHJvY2Vzcy5lbnYuQkFCRUxfVFlQRVNfOF9CUkVBS0lOR1wiOiBcImZhbHNlXCIgfSxcbiAgICBkZXY6IHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgXCJDYWNoZS1Db250cm9sXCI6IFwicHVibGljLCBtYXgtYWdlPTBcIixcbiAgICAgIH0sXG4gICAgfSxcbiAgICBwcmV2aWV3OiB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIFwiQ2FjaGUtQ29udHJvbFwiOiBcInB1YmxpYywgbWF4LWFnZT02MDBcIixcbiAgICAgIH0sXG4gICAgfSxcbiAgfTtcbn0pO1xuIiwgIntcbiAgXCJkZWZhdWx0TG9jYWxlXCI6IHsgXCJsYW5nXCI6IFwiZW4tVVNcIiwgXCJjdXJyZW5jeVwiOiBcIlVTRFwiIH0sXG4gIFwic3VwcG9ydGVkTG9jYWxlc1wiOiBbXG4gICAgeyBcImxhbmdcIjogXCJ6aC1IS1wiLCBcImN1cnJlbmN5XCI6IFwiSEtEXCIgfSxcbiAgICB7IFwibGFuZ1wiOiBcImphLUpQXCIsIFwiY3VycmVuY3lcIjogXCJKUFlcIiB9LFxuICAgIHsgXCJsYW5nXCI6IFwiZW4tVVNcIiwgXCJjdXJyZW5jeVwiOiBcIlVTRFwiIH1cbiAgXVxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxXRUJcXFxcUExBWUdST1VORFxcXFxxd2lrXFxcXHNyY1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcV0VCXFxcXFBMQVlHUk9VTkRcXFxccXdpa1xcXFxzcmNcXFxcc3BlYWstY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9XRUIvUExBWUdST1VORC9xd2lrL3NyYy9zcGVhay1jb25maWcudHNcIjtpbXBvcnQgdHlwZSB7IFNwZWFrQ29uZmlnIH0gZnJvbSBcInF3aWstc3BlYWtcIjtcbmltcG9ydCBsYW5nIGZyb20gXCIuLi9sYW5nLmpzb25cIjtcblxuZXhwb3J0IGNvbnN0IGNvbmZpZzogU3BlYWtDb25maWcgPSB7XG4gIC4uLmxhbmcsXG4gIGFzc2V0czogW1xuICAgIFwiYXBwXCIsIC8vIFRyYW5zbGF0aW9ucyBzaGFyZWQgYnkgdGhlIHBhZ2VzXG4gIF0sXG4gIHJ1bnRpbWVBc3NldHM6IFtcbiAgICAvLyBcInJ1bnRpbWVcIiwgLy8gVHJhbnNsYXRpb25zIHdpdGggZHluYW1pYyBrZXlzIG9yIHBhcmFtZXRlcnNcbiAgXSxcbn07XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQStULFNBQVMseUJBQXlCO0FBQ2pXLFNBQVMsb0JBQW9COzs7QUNEK04sT0FBTyxpQkFBaUI7QUFDcFIsU0FBUyxnQkFBZ0I7QUFDekIsU0FBUyxnQkFBZ0I7QUFDekIsU0FBUyx1QkFBdUI7QUFDaEMsU0FBUyxvQkFBa0M7QUFDM0MsT0FBTyxtQkFBbUI7OztBQ0wxQjtBQUFBLEVBQ0UsZUFBaUIsRUFBRSxNQUFRLFNBQVMsVUFBWSxNQUFNO0FBQUEsRUFDdEQsa0JBQW9CO0FBQUEsSUFDbEIsRUFBRSxNQUFRLFNBQVMsVUFBWSxNQUFNO0FBQUEsSUFDckMsRUFBRSxNQUFRLFNBQVMsVUFBWSxNQUFNO0FBQUEsSUFDckMsRUFBRSxNQUFRLFNBQVMsVUFBWSxNQUFNO0FBQUEsRUFDdkM7QUFDRjs7O0FDSk8sSUFBTSxTQUFzQjtBQUFBLEVBQ2pDLEdBQUc7QUFBQSxFQUNILFFBQVE7QUFBQSxJQUNOO0FBQUE7QUFBQSxFQUNGO0FBQUEsRUFDQSxlQUFlO0FBQUE7QUFBQSxFQUVmO0FBQ0Y7OztBRkhBLElBQU0saUNBQTZELENBQUMsS0FBSyxVQUFVLFNBQVM7QUFDMUYsTUFBSSxJQUFJLE9BQU8sMkJBQTJCLEtBQUssSUFBSSxHQUFHLEdBQUc7QUFDdkQsYUFBUyxVQUFVLDhCQUE4QixhQUFhO0FBQzlELGFBQVMsVUFBVSxnQ0FBZ0MsY0FBYztBQUFBLEVBQ25FO0FBQ0EsT0FBSztBQUNQO0FBRUEsSUFBTyxzQkFBUSxhQUFhLE1BQU07QUFFaEMsU0FBTztBQUFBLElBQ0wsT0FBTztBQUFBLE1BQ0wsZUFBZTtBQUFBLFFBQ2IsVUFBVSxDQUFDLGFBQWE7QUFBQSxNQUMxQjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLFNBQVM7QUFBQSxRQUNQLGVBQWU7QUFBQSxVQUNiLE1BQU0sT0FBTyxpQkFBaUIsSUFBSSxDQUFDLFdBQVcsT0FBTyxJQUFJO0FBQUEsUUFDM0Q7QUFBQSxNQUNGLENBQUM7QUFBQSxNQUNELFNBQVM7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUlULENBQUM7QUFBQSxNQUNELGdCQUFnQjtBQUFBLFFBQ2QsZ0JBQWdCLGFBQUssaUJBQWlCLElBQUksQ0FBQyxXQUFXLE9BQU8sSUFBSTtBQUFBLFFBQ2pFLGFBQWEsYUFBSyxjQUFjO0FBQUEsUUFDaEMsWUFBWTtBQUFBLE1BQ2QsQ0FBQztBQUFBLE1BQ0QsY0FBYztBQUFBLE1BQ2Q7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLGlCQUFpQixDQUFDLFdBQVc7QUFDM0IsaUJBQU8sWUFBWSxJQUFJLDhCQUE4QjtBQUFBLFFBQ3ZEO0FBQUEsUUFDQSx3QkFBd0IsQ0FBQyxXQUFXO0FBQ2xDLGlCQUFPLFlBQVksSUFBSSw4QkFBOEI7QUFBQSxRQUN2RDtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFlBQVk7QUFBQSxJQUNkO0FBQUE7QUFBQSxJQUVBLFFBQVEsRUFBRSxzQ0FBc0MsUUFBUTtBQUFBLElBQ3hELEtBQUs7QUFBQSxNQUNILFNBQVM7QUFBQSxRQUNQLGlCQUFpQjtBQUFBLE1BQ25CO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsU0FBUztBQUFBLFFBQ1AsaUJBQWlCO0FBQUEsTUFDbkI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7OztBRDdERCxJQUFPQSx1QkFBUSxhQUFhLHFCQUFZLE1BQU07QUFDNUMsU0FBTztBQUFBLElBQ0wsT0FBTztBQUFBLE1BQ0wsS0FBSztBQUFBLE1BQ0wsZUFBZTtBQUFBLFFBQ2IsT0FBTyxDQUFDLDZCQUE2QixpQkFBaUI7QUFBQSxNQUN4RDtBQUFBLE1BQ0EsUUFBUTtBQUFBLElBQ1Y7QUFBQSxJQUNBLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQztBQUFBLEVBQy9CO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsidml0ZV9jb25maWdfZGVmYXVsdCJdCn0K
