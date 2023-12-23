import { routeLoader$, type RequestHandler } from "@builder.io/qwik-city";
import { auth, initLuciaIfNeeded } from "~/auth/lucia";
import { initDrizzleIfNeeded } from "~/utils/drizzleClient";
import { checkProtectedPath } from "~/utils/redirect";
import { initTursoIfNeeded } from "~/utils/tursoClient";

// redirect to dashboard if user is logged in
export const useUserLoader = routeLoader$(async (event) => {
  const authRequest = auth().handleRequest(event);

  const session = await authRequest.validate();

  const [shouldRedirect, redirectTo] = checkProtectedPath(
    event.url.pathname,
    session?.user.role ?? ""
  );

  if (shouldRedirect) {
    throw event.redirect(302, redirectTo);
  }

  return session;
});

export const onRequest: RequestHandler = async ({ env, url }) => {
  await initTursoIfNeeded(env);
  await Promise.all([initDrizzleIfNeeded(), initLuciaIfNeeded(env, url.origin)]);
};
