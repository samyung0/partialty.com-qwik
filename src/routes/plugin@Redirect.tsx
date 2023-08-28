import { $ } from "@builder.io/qwik";
import { type RequestHandler, routeLoader$ } from "@builder.io/qwik-city";
import { preload } from "~/routes/plugin@Auth";
import { allRoutes } from "~/utils/allRoutes";
import { protectedRoutes } from "~/utils/protectedRoutes";

export const checkValidPath = (reqPath: string): boolean => {
  let path = reqPath.slice(1);
  if (path !== "" && path[path.length - 1] === "/") path = path.slice(0, -1);

  const possibleSegments = path.split("/").map((segment: string) => "/" + segment);
  const segments: string[][] = [];
  const comb = (cur: string[], rem: string[]) => {
    if (rem.length === 0) {
      segments.push(cur);
    } else {
      comb([...cur, rem[0]], rem.slice(1));
      if (cur.length === 0) return;
      const t = [...cur];
      t[t.length - 1] += rem[0];
      comb([...t], rem.slice(1));
    }
  };
  comb([], possibleSegments);
  const rec = (obj: any, remaining: string[]): boolean => {
    if (remaining.length === 0) return true;
    return Object.prototype.hasOwnProperty.call(obj, remaining[0])
      ? rec(obj[remaining[0]], remaining.slice(1))
      : false;
  };
  return segments.filter((possibleSegments) => rec(allRoutes, possibleSegments)).length > 0;
};

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

export const onGet: RequestHandler = (request) => {
  if (!checkValidPath(request.url.pathname)) throw request.redirect(308, "/notfound");
};

export const useRedirectLoader = routeLoader$(async (request) => {
  const { session, url } = await preload.bind(request)();

  const [shouldRedirect, redirectTo] = checkProtectedPath(url.pathname, session?.user);
  if (shouldRedirect) throw request.redirect(308, redirectTo);
  return { session, url };
});
