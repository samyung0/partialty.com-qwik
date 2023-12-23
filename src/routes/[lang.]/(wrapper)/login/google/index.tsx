import type { RequestHandler } from "@builder.io/qwik-city";
import { googleAuth } from "~/auth/lucia";

export const onGet: RequestHandler = async (request) => {
  const GoogleAuth = googleAuth();
  const [url, state] = await GoogleAuth.getAuthorizationUrl();
  request.cookie.set("google_oauth_state", state, {
    httpOnly: true,
    secure: import.meta.env.MODE === "production",
    path: "/",
    maxAge: 60 * 60,
  });
  throw request.redirect(302, url.toString());
};
