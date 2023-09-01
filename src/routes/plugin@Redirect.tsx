import { routeLoader$ } from "@builder.io/qwik-city";
import { preload } from "~/routes/plugin@Auth";
import { protectedRoutes } from "~/utils/protectedRoutes";

export const checkProtectedPath = (path: string | undefined, user: any): [boolean, string] => {
  let shouldRedirect = false,
    redirectTo = "/"; // default to base

  // in case somehow the path is empty, redirect to homepage and refresh
  if (!path) return [true, redirectTo];

  for (const i of protectedRoutes) {
    const re = new RegExp(i.path);
    if (re.test(path)) {
      redirectTo = i.redirectTo;
      if (user?.role) shouldRedirect = !i.authRolesPermitted.includes(user.role);
      else shouldRedirect = true;
      break;
    }
  }
  return [shouldRedirect, redirectTo];
};

export const useRedirectLoader = routeLoader$(async (request) => {
  // bind to the root request since request inside server$ has different request object
  console.log("routing");
  const { session, url } = await preload.bind(request)();
  console.log(session);

  const [shouldRedirect, redirectTo] = checkProtectedPath(url.pathname, session?.user);
  if (shouldRedirect) throw request.redirect(308, redirectTo);
  return { session, url };
});
