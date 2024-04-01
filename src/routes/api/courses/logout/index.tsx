import type { RequestHandler } from '@builder.io/qwik-city';
import { auth } from '~/auth/lucia';

export const onPost: RequestHandler = async (req) => {
  req.cacheControl({
    maxAge: 0,
    sMaxAge: 0,
    noStore: true,
    noCache: true,
  });
  const Auth = auth(req.env, import.meta.env.VITE_USE_PROD_DB === '1');
  const authRequest = Auth.handleRequest(req);

  const session = await authRequest.validate();
  if (!session) return;

  await Auth.invalidateSession(session.sessionId);
  authRequest.setSession(null);

  Auth.deleteDeadUserSessions(session.user.userId);

  req.json(200, "OK")
};
