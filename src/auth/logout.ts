import { server$ } from '@builder.io/qwik-city';
import { auth } from '~/auth/lucia';

export const logout = server$(async function () {
  const Auth = auth(this.env, import.meta.env.VITE_USE_PROD_DB === '1');
  const authRequest = Auth.handleRequest(this);

  const session = await authRequest.validate();
  if (!session) return;

  await Auth.invalidateSession(session.sessionId);
  authRequest.setSession(null);

  Auth.deleteDeadUserSessions(session.user.userId);
});
