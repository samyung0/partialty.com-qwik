import type { RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async ({ cacheControl, url }) => {
  // https://qwik.builder.io/docs/caching/
  // if (url.pathname === "/") {
  //   cacheControl({
  //     public: true,
  //     staleWhileRevalidate: 60 * 60 * 24 * 7,
  //     maxAge: 60 * 60 * 24,
  //     sMaxAge: 60 * 60 * 24,
  //   });
  //   cacheControl(
  //     {
  //       public: true,
  //       staleWhileRevalidate: 60 * 60 * 24 * 7,
  //       maxAge: 60 * 60 * 24,
  //       sMaxAge: 60 * 60 * 24,
  //     },
  //     "CDN-Cache-Control"
  //   );
  // }
};
