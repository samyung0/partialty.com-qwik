import { Slot, component$ } from "@builder.io/qwik";
import { routeLoader$, type RequestHandler } from "@builder.io/qwik-city";
import type { Session } from "lucia";
import { auth, initLuciaIfNeeded } from "~/auth/lucia";
import { initDrizzleIfNeeded } from "~/utils/drizzleClient";
import { checkProtectedPath } from "~/utils/redirect";
import { initTursoIfNeeded } from "~/utils/tursoClient";

// turso, drizzle and lucia are all initialized per page request
// since edge and serverless functions are stateless
export const onRequest: RequestHandler = async ({ env, url }) => {
  await initTursoIfNeeded(env);
  await Promise.all([initDrizzleIfNeeded(), initLuciaIfNeeded(env, url.origin)]);
};

export const onGet: RequestHandler = async ({ cacheControl }) => {
  cacheControl({
    maxAge: 0,
    sMaxAge: 0,
    noStore: true,
    noCache: true,
  });
};

export const useUserLoader = routeLoader$(async (event) => {
  const authRequest = auth().handleRequest(event);

  const time1 = performance.now();
  let session: Session | null = null;
  try {
    session = await authRequest.validate();
  } catch (e) {
    /* empty */
  }

  console.log("Time to validate session: ", performance.now() - time1);

  const [shouldRedirect, redirectTo] = checkProtectedPath(
    event.url.pathname,
    session?.user.role ?? ""
  );

  if (shouldRedirect) {
    throw event.redirect(302, redirectTo);
  }

  // checkProtectedPath should do all the redirecting
  // this is for type safety
  if (!session) throw event.redirect(302, "/");
  return session;
});

export default component$(() => {
  return <Slot />;
});
