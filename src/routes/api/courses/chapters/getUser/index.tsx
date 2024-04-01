import type { RequestHandler } from '@builder.io/qwik-city';
import { auth, initLuciaIfNeeded } from '~/auth/lucia';
import { initDrizzleIfNeeded } from '~/utils/drizzleClient';
import { initTursoIfNeeded } from '~/utils/tursoClient';

export const onGet: RequestHandler = async (req) => {
  initTursoIfNeeded(req.env, import.meta.env.VITE_USE_PROD_DB === '1');
  initDrizzleIfNeeded(req.env, import.meta.env.VITE_USE_PROD_DB === '1');
  initLuciaIfNeeded(req.env, import.meta.env.VITE_USE_PROD_DB === '1');
  const authRequest = auth(req.env, import.meta.env.VITE_USE_PROD_DB === '1').handleRequest(req);
  const session = await authRequest.validate();
  return session;
};
