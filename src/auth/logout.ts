import { server$ } from "@builder.io/qwik-city";
import { auth } from "~/auth/lucia";

export const logout = server$(async function () {
  const Auth = auth(this);
  const authRequest = Auth.handleRequest(this);

  const session = await authRequest.validate();
  if (!session) return;

  await Auth.invalidateSession(session.sessionId);
  authRequest.setSession(null);
});
