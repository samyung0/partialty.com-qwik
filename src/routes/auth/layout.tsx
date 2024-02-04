import { type RequestHandler } from "@builder.io/qwik-city";
import { initLuciaIfNeeded } from "~/auth/lucia";
import { initDrizzleIfNeeded } from "~/utils/drizzleClient";
import { initTursoIfNeeded } from "~/utils/tursoClient";

export const onRequest: RequestHandler = async ({ env, url, cacheControl }) => {
  cacheControl({
    maxAge: 0,
    sMaxAge: 0,
    noStore: true,
    noCache: true,
  });

  await initTursoIfNeeded(env, !!import.meta.env.VITE_USE_PROD_DB);
  await Promise.all([
    initDrizzleIfNeeded(!!import.meta.env.VITE_USE_PROD_DB),
    initLuciaIfNeeded(env, !!import.meta.env.VITE_USE_PROD_DB),
  ]);
};
