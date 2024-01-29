// vite.config.ts
import { qwikCity } from "file:///C:/WEB/PLAYGROUND/partialty/node_modules/@builder.io/qwik-city/vite/index.mjs";
import { qwikReact } from "file:///C:/WEB/PLAYGROUND/partialty/node_modules/@builder.io/qwik-react/lib/vite.mjs";
import { qwikVite } from "file:///C:/WEB/PLAYGROUND/partialty/node_modules/@builder.io/qwik/optimizer.mjs";
import { qwikSpeakInline } from "file:///C:/WEB/PLAYGROUND/partialty/node_modules/qwik-speak/inline/index.mjs";
import compileTime from "file:///C:/WEB/PLAYGROUND/partialty/node_modules/vite-plugin-compile-time/dist/index.mjs";
import tsconfigPaths from "file:///C:/WEB/PLAYGROUND/partialty/node_modules/vite-tsconfig-paths/dist/index.mjs";
import { defineConfig } from "file:///C:/WEB/PLAYGROUND/partialty/node_modules/vite/dist/node/index.js";

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
    plugins: [
      qwikCity({
        allowedParams: {
          lang: config.supportedLocales.map((locale) => locale.lang),
        },
      }),
      qwikVite({
        entryStrategy: {
          type: "component",
        },
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
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAibGFuZy5qc29uIiwgInNyYy9zcGVhay1jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxXRUJcXFxcUExBWUdST1VORFxcXFxwYXJ0aWFsdHlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFdFQlxcXFxQTEFZR1JPVU5EXFxcXHBhcnRpYWx0eVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovV0VCL1BMQVlHUk9VTkQvcGFydGlhbHR5L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgcXdpa0NpdHkgfSBmcm9tIFwiQGJ1aWxkZXIuaW8vcXdpay1jaXR5L3ZpdGVcIjtcbmltcG9ydCB7IHF3aWtSZWFjdCB9IGZyb20gXCJAYnVpbGRlci5pby9xd2lrLXJlYWN0L3ZpdGVcIjtcbmltcG9ydCB7IHF3aWtWaXRlIH0gZnJvbSBcIkBidWlsZGVyLmlvL3F3aWsvb3B0aW1pemVyXCI7XG5pbXBvcnQgeyBxd2lrU3BlYWtJbmxpbmUgfSBmcm9tIFwicXdpay1zcGVhay9pbmxpbmVcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgdHlwZSBDb25uZWN0IH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCBjb21waWxlVGltZSBmcm9tIFwidml0ZS1wbHVnaW4tY29tcGlsZS10aW1lXCI7XG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tIFwidml0ZS10c2NvbmZpZy1wYXRoc1wiO1xuaW1wb3J0IGxhbmcgZnJvbSBcIi4vbGFuZy5qc29uXCI7XG5pbXBvcnQgeyBjb25maWcgfSBmcm9tIFwiLi9zcmMvc3BlYWstY29uZmlnXCI7XG5jb25zdCBjcm9zc09yaWdpbklzb2xhdGlvbk1pZGRsZXdhcmU6IENvbm5lY3QuTmV4dEhhbmRsZUZ1bmN0aW9uID0gKHJlcSwgcmVzcG9uc2UsIG5leHQpID0+IHtcbiAgaWYgKHJlcS51cmwgJiYgL14oXFwvLiopP1xcL2NvZGVwbGF5Z3JvdW5kLy50ZXN0KHJlcS51cmwpKSB7XG4gICAgcmVzcG9uc2Uuc2V0SGVhZGVyKFwiQ3Jvc3MtT3JpZ2luLU9wZW5lci1Qb2xpY3lcIiwgXCJzYW1lLW9yaWdpblwiKTtcbiAgICByZXNwb25zZS5zZXRIZWFkZXIoXCJDcm9zcy1PcmlnaW4tRW1iZWRkZXItUG9saWN5XCIsIFwicmVxdWlyZS1jb3JwXCIpO1xuICB9XG4gIG5leHQoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoKSA9PiB7XG4gIC8vIHByb2Nlc3MuZW52ID0geyAuLi5wcm9jZXNzLmVudiwgLi4ubG9hZEVudih1c2VyQ29uZmlnLm1vZGUsIHByb2Nlc3MuY3dkKCkpIH07XG4gIHJldHVybiB7XG4gICAgcGx1Z2luczogW1xuICAgICAgcXdpa0NpdHkoe1xuICAgICAgICBhbGxvd2VkUGFyYW1zOiB7XG4gICAgICAgICAgbGFuZzogY29uZmlnLnN1cHBvcnRlZExvY2FsZXMubWFwKChsb2NhbGUpID0+IGxvY2FsZS5sYW5nKSxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgcXdpa1ZpdGUoe1xuICAgICAgICBlbnRyeVN0cmF0ZWd5OiB7XG4gICAgICAgICAgdHlwZTogXCJjb21wb25lbnRcIixcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgcXdpa1NwZWFrSW5saW5lKHtcbiAgICAgICAgc3VwcG9ydGVkTGFuZ3M6IGxhbmcuc3VwcG9ydGVkTG9jYWxlcy5tYXAoKGxvY2FsZSkgPT4gbG9jYWxlLmxhbmcpLFxuICAgICAgICBkZWZhdWx0TGFuZzogbGFuZy5kZWZhdWx0TG9jYWxlLmxhbmcsXG4gICAgICAgIGFzc2V0c1BhdGg6IFwiaTE4blwiLFxuICAgICAgfSksXG4gICAgICB0c2NvbmZpZ1BhdGhzKCksXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiY3Jvc3Mtb3JpZ2luLWlzb2xhdGlvblwiLFxuICAgICAgICBjb25maWd1cmVTZXJ2ZXI6IChzZXJ2ZXIpID0+IHtcbiAgICAgICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKGNyb3NzT3JpZ2luSXNvbGF0aW9uTWlkZGxld2FyZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGNvbmZpZ3VyZVByZXZpZXdTZXJ2ZXI6IChzZXJ2ZXIpID0+IHtcbiAgICAgICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKGNyb3NzT3JpZ2luSXNvbGF0aW9uTWlkZGxld2FyZSk7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgY29tcGlsZVRpbWUoKSxcbiAgICAgIHF3aWtSZWFjdCgpLFxuICAgIF0sXG4gICAgLy8gbm9kZV9tb2R1bGVzXFxAYmFiZWxcXHR5cGVzXFxsaWJcXGRlZmluaXRpb25zXFxjb3JlLmpzXG4gICAgZGVmaW5lOiB7IFwicHJvY2Vzcy5lbnYuQkFCRUxfVFlQRVNfOF9CUkVBS0lOR1wiOiBcImZhbHNlXCIgfSxcbiAgICBkZXY6IHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgXCJDYWNoZS1Db250cm9sXCI6IFwicHVibGljLCBtYXgtYWdlPTBcIixcbiAgICAgIH0sXG4gICAgfSxcbiAgICBwcmV2aWV3OiB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIFwiQ2FjaGUtQ29udHJvbFwiOiBcInB1YmxpYywgbWF4LWFnZT02MDBcIixcbiAgICAgIH0sXG4gICAgfSxcbiAgfTtcbn0pO1xuIiwgIntcbiAgXCJkZWZhdWx0TG9jYWxlXCI6IHsgXCJsYW5nXCI6IFwiZW4tVVNcIiwgXCJjdXJyZW5jeVwiOiBcIlVTRFwiIH0sXG4gIFwic3VwcG9ydGVkTG9jYWxlc1wiOiBbXG4gICAgeyBcImxhbmdcIjogXCJ6aC1IS1wiLCBcImN1cnJlbmN5XCI6IFwiSEtEXCIgfSxcbiAgICB7IFwibGFuZ1wiOiBcImphLUpQXCIsIFwiY3VycmVuY3lcIjogXCJKUFlcIiB9LFxuICAgIHsgXCJsYW5nXCI6IFwiZW4tVVNcIiwgXCJjdXJyZW5jeVwiOiBcIlVTRFwiIH1cbiAgXVxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxXRUJcXFxcUExBWUdST1VORFxcXFxwYXJ0aWFsdHlcXFxcc3JjXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxXRUJcXFxcUExBWUdST1VORFxcXFxwYXJ0aWFsdHlcXFxcc3JjXFxcXHNwZWFrLWNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovV0VCL1BMQVlHUk9VTkQvcGFydGlhbHR5L3NyYy9zcGVhay1jb25maWcudHNcIjtpbXBvcnQgdHlwZSB7IFNwZWFrQ29uZmlnIH0gZnJvbSBcInF3aWstc3BlYWtcIjtcbmltcG9ydCBsYW5nIGZyb20gXCIuLi9sYW5nLmpzb25cIjtcblxuZXhwb3J0IGNvbnN0IGNvbmZpZzogU3BlYWtDb25maWcgPSB7XG4gIC4uLmxhbmcsXG4gIGFzc2V0czogW1xuICAgIFwiYXBwXCIsIC8vIFRyYW5zbGF0aW9ucyBzaGFyZWQgYnkgdGhlIHBhZ2VzXG4gIF0sXG4gIHJ1bnRpbWVBc3NldHM6IFtcbiAgICAvLyBcInJ1bnRpbWVcIiwgLy8gVHJhbnNsYXRpb25zIHdpdGggZHluYW1pYyBrZXlzIG9yIHBhcmFtZXRlcnNcbiAgXSxcbn07XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTJRLFNBQVMsZ0JBQWdCO0FBQ3BTLFNBQVMsaUJBQWlCO0FBQzFCLFNBQVMsZ0JBQWdCO0FBQ3pCLFNBQVMsdUJBQXVCO0FBQ2hDLFNBQVMsb0JBQWtDO0FBQzNDLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sbUJBQW1COzs7QUNOMUI7QUFBQSxFQUNFLGVBQWlCLEVBQUUsTUFBUSxTQUFTLFVBQVksTUFBTTtBQUFBLEVBQ3RELGtCQUFvQjtBQUFBLElBQ2xCLEVBQUUsTUFBUSxTQUFTLFVBQVksTUFBTTtBQUFBLElBQ3JDLEVBQUUsTUFBUSxTQUFTLFVBQVksTUFBTTtBQUFBLElBQ3JDLEVBQUUsTUFBUSxTQUFTLFVBQVksTUFBTTtBQUFBLEVBQ3ZDO0FBQ0Y7OztBQ0pPLElBQU0sU0FBc0I7QUFBQSxFQUNqQyxHQUFHO0FBQUEsRUFDSCxRQUFRO0FBQUEsSUFDTjtBQUFBO0FBQUEsRUFDRjtBQUFBLEVBQ0EsZUFBZTtBQUFBO0FBQUEsRUFFZjtBQUNGOzs7QUZGQSxJQUFNLGlDQUE2RCxDQUFDLEtBQUssVUFBVSxTQUFTO0FBQzFGLE1BQUksSUFBSSxPQUFPLDJCQUEyQixLQUFLLElBQUksR0FBRyxHQUFHO0FBQ3ZELGFBQVMsVUFBVSw4QkFBOEIsYUFBYTtBQUM5RCxhQUFTLFVBQVUsZ0NBQWdDLGNBQWM7QUFBQSxFQUNuRTtBQUNBLE9BQUs7QUFDUDtBQUVBLElBQU8sc0JBQVEsYUFBYSxNQUFNO0FBRWhDLFNBQU87QUFBQSxJQUNMLFNBQVM7QUFBQSxNQUNQLFNBQVM7QUFBQSxRQUNQLGVBQWU7QUFBQSxVQUNiLE1BQU0sT0FBTyxpQkFBaUIsSUFBSSxDQUFDLFdBQVcsT0FBTyxJQUFJO0FBQUEsUUFDM0Q7QUFBQSxNQUNGLENBQUM7QUFBQSxNQUNELFNBQVM7QUFBQSxRQUNQLGVBQWU7QUFBQSxVQUNiLE1BQU07QUFBQSxRQUNSO0FBQUEsTUFDRixDQUFDO0FBQUEsTUFDRCxnQkFBZ0I7QUFBQSxRQUNkLGdCQUFnQixhQUFLLGlCQUFpQixJQUFJLENBQUMsV0FBVyxPQUFPLElBQUk7QUFBQSxRQUNqRSxhQUFhLGFBQUssY0FBYztBQUFBLFFBQ2hDLFlBQVk7QUFBQSxNQUNkLENBQUM7QUFBQSxNQUNELGNBQWM7QUFBQSxNQUNkO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixpQkFBaUIsQ0FBQyxXQUFXO0FBQzNCLGlCQUFPLFlBQVksSUFBSSw4QkFBOEI7QUFBQSxRQUN2RDtBQUFBLFFBQ0Esd0JBQXdCLENBQUMsV0FBVztBQUNsQyxpQkFBTyxZQUFZLElBQUksOEJBQThCO0FBQUEsUUFDdkQ7QUFBQSxNQUNGO0FBQUEsTUFDQSxZQUFZO0FBQUEsTUFDWixVQUFVO0FBQUEsSUFDWjtBQUFBO0FBQUEsSUFFQSxRQUFRLEVBQUUsc0NBQXNDLFFBQVE7QUFBQSxJQUN4RCxLQUFLO0FBQUEsTUFDSCxTQUFTO0FBQUEsUUFDUCxpQkFBaUI7QUFBQSxNQUNuQjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLFNBQVM7QUFBQSxRQUNQLGlCQUFpQjtBQUFBLE1BQ25CO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
