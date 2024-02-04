import { Slot, component$ } from "@builder.io/qwik";
import { routeLoader$, type RequestHandler } from "@builder.io/qwik-city";
import { auth, initLuciaIfNeeded } from "~/auth/lucia";
import type { LuciaSession } from "~/types/LuciaSession";
import { initDrizzleIfNeeded } from "~/utils/drizzleClient";
import { checkProtectedPath } from "~/utils/redirect";
import { initTursoIfNeeded } from "~/utils/tursoClient";

// turso, drizzle and lucia are all initialized per page request
// since edge and serverless functions are stateless
export const onRequest: RequestHandler = async ({ env, cacheControl }) => {
  cacheControl({
    maxAge: 0,
    sMaxAge: 0,
    noStore: true,
    noCache: true,
  });
  await initTursoIfNeeded(env, import.meta.env.VITE_USE_PROD_DB === "1");
  await Promise.all([
    initDrizzleIfNeeded(import.meta.env.VITE_USE_PROD_DB === "1"),
    initLuciaIfNeeded(env, import.meta.env.VITE_USE_PROD_DB === "1"),
  ]);
};

export const useUserLoader = routeLoader$(async (event) => {
  const authRequest = auth().handleRequest(event);

  const time1 = performance.now();
  let session: LuciaSession | null = null;
  try {
    session = await authRequest.validate();
  } catch (e) {
    /* empty */
  }
  
  console.log("Time to validate session: ", performance.now() - time1);
  
  const [shouldRedirect, redirectTo, searchParams] = checkProtectedPath(
    event.url.pathname,
    session?.user.role ?? ""
  );

  if (shouldRedirect) {
    throw event.redirect(302, redirectTo + "?" + searchParams.toString());
  }

  // checkProtectedPath should do all the redirecting
  // this is for type safety

  if (!session) throw event.redirect(302, "/");
  return session.user as LuciaSession["user"];
});

export default component$(() => {
  return <Slot />;
});
