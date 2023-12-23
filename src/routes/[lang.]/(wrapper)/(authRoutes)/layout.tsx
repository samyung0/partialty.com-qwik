import { Slot, component$ } from "@builder.io/qwik";
import { routeLoader$, type RequestHandler } from "@builder.io/qwik-city";
import { auth } from "~/auth/lucia";
import { checkProtectedPath } from "~/utils/redirect";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // https://qwik.builder.io/docs/caching/
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
  const session = await authRequest.validate();
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
