// redirect gets handled in layouts
// it is not systematic at this moment
// if new routes are added, redirecting needs to be added again for that layout

import { profiles } from "../../drizzle_turso/schema/profile";

export const protectedRoutes: {
  path: string;
  authRolesPermitted: string[];
  redirectTo: string;
  exact?: boolean;
}[] = [
  {
    path: "/",
    authRolesPermitted: [],
    redirectTo: "/members/dashboard",
    exact: true,
  },
  {
    path: "/staging/",
    authRolesPermitted: [],
    redirectTo: "/members/dashboard",
    exact: true,
  },
  {
    path: "/members", // also matches for /members /members/a /members/a/b
    authRolesPermitted: profiles.role.enumValues, // the roles are matched against the roles in profile, NOT auth
    // if you need to test against profile roles, test it after the page loads, meaning you need to implement a loading screen and redirect if roles doesnt match
    redirectTo: "/login",
  },
  {
    path: "/login",
    authRolesPermitted: [], // anything but authenticated
    redirectTo: "/members/dashboard", // if logged in, redirect to dashboard
  },
  {
    path: "/signup",
    authRolesPermitted: [], // anything but authenticated
    redirectTo: "/members/dashboard", // if logged in, redirect to dashboard
  },
  {
    path: "/uploadRepo",
    authRolesPermitted: profiles.role.enumValues,
    redirectTo: "/login",
  },
];
