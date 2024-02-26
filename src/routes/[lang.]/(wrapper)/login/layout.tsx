import { routeLoader$, type RequestHandler } from "@builder.io/qwik-city";
import type { Session } from "lucia";
import { auth, initLuciaIfNeeded } from "~/auth/lucia";
import { initDrizzleIfNeeded } from "~/utils/drizzleClient";
import { checkProtectedPath } from "~/utils/redirect";
import { initTursoIfNeeded } from "~/utils/tursoClient";

// redirect to dashboard if user is logged in
export const useUserLoader = routeLoader$(async (event) => {
  const authRequest = auth().handleRequest(event);

  let session: Session | null = null;
  try {
    session = await authRequest.validate();
  } catch (e) {
    /* empty */
  }

  const [shouldRedirect, redirectTo] = checkProtectedPath(
    event.url.pathname,
    session ? session.user.role : ""
  );

  if (shouldRedirect) {
    throw event.redirect(302, redirectTo);
  }

  return session;
});

export const onRequest: RequestHandler = ({ env }) => {
  initTursoIfNeeded(env, import.meta.env.VITE_USE_PROD_DB === "1");
  initDrizzleIfNeeded(import.meta.env.VITE_USE_PROD_DB === "1");
  initLuciaIfNeeded(env, import.meta.env.VITE_USE_PROD_DB === "1");
};
