// redirect gets handled in layouts
// it is not systematic at this moment
// if new routes are added, redirecting needs to be added again for that layout

export const protectedRoutes = [
  {
    path: "/members", // also matches for /members /members/a /members/a/b
    authRolesPermitted: ["authenticated"], // the roles are matched against the roles in auth, NOT in profiles
    // if you need to test against profile roles, test it after the page loads, meaning you need to implement a loading screen and redirect if roles doesnt match
    redirectTo: "/",
  },
  {
    path: "/login",
    authRolesPermitted: [], // anything but authenticated
    redirectTo: "/members/dashboard", // if logged in, redirect to dashboard
  },
];
