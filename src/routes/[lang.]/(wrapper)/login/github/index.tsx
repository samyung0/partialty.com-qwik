import type { RequestHandler } from "@builder.io/qwik-city";
import { githubAuth } from "~/auth/lucia";

export const onGet: RequestHandler = async (request) => {
  const GithubAuth = githubAuth();
  const [url, state] = await GithubAuth.getAuthorizationUrl();
  request.cookie.set("github_oauth_state", state, {
    httpOnly: true,
    secure: import.meta.env.MODE === "production",
    path: "/",
    maxAge: 60 * 60,
  });
  throw request.redirect(302, url.toString());
};
