import { type RequestHandler } from '@builder.io/qwik-city';
import { initLuciaIfNeeded } from '~/auth/lucia';
import { initDrizzleIfNeeded } from '~/utils/drizzleClient';
import { initTursoIfNeeded } from '~/utils/tursoClient';

export const onRequest: RequestHandler = ({ env, url, cacheControl }) => {
  cacheControl({
    maxAge: 0,
    sMaxAge: 0,
    noStore: true,
    noCache: true,
  });

  initTursoIfNeeded(env, import.meta.env.VITE_USE_PROD_DB === '1');
  initDrizzleIfNeeded(env, import.meta.env.VITE_USE_PROD_DB === '1');
  initLuciaIfNeeded(env, import.meta.env.VITE_USE_PROD_DB === '1');
};
