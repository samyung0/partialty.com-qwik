import { protectedRoutes } from '~/utils/protectedRoutes';

const removeTrailing = (path: string) => {
  if (path === '/') return path;
  if (path.endsWith('/')) return path.slice(0, path.length - 1);
  return path;
};

export const checkProtectedPath = (path: string | undefined, role: any): [boolean, string, URLSearchParams] => {
  let shouldRedirect = false,
    redirectTo = '/'; // default to base
  const searchParams = new URLSearchParams();

  // in case somehow the path is empty, redirect to homepage and refresh
  if (!path) return [true, redirectTo, searchParams];

  for (const i of protectedRoutes) {
    if (
      i.exact
        ? removeTrailing(i.path) === removeTrailing(path)
        : removeTrailing(path).startsWith(removeTrailing(i.path))
    ) {
      searchParams.append('redirectedFrom', path || '/');
      redirectTo = i.redirectTo;
      if (i.authRolesPermitted.length > 0) shouldRedirect = !i.authRolesPermitted.includes(role);
      else shouldRedirect = !!role; // if no roles permitted, then only UNAUTHED persons can access
      break;
    }
  }
  return [shouldRedirect, redirectTo, searchParams];
};

// export const useRedirectLoader = routeLoader$(async (request) => {
//   // bind to the root request since request inside server$ has different request object
//   const context = await preload.bind(request)();

//   // userRole can be null if error
//   const [shouldRedirect, redirectTo] = checkProtectedPath(
//     context.req.url!.pathname,
//     context.session?.userRole
//   );
//   if (shouldRedirect) throw request.redirect(308, redirectTo);
//   return context;
// });
