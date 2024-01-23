import type { RequestHandler } from "@builder.io/qwik-city";
import { googleAuth } from "~/auth/lucia";

export const onGet: RequestHandler = async (request) => {
  const GoogleAuth = googleAuth();
  const [url, state] = await GoogleAuth.getAuthorizationUrl();
  const searchParams = request.url.searchParams;
  request.cookie.set("google_oauth_state", state, {
    httpOnly: true,
    secure: import.meta.env.MODE === "production",
    path: "/",
    maxAge: 60 * 60,
  });
  if (searchParams.get("redirectedFrom"))
    request.cookie.set("redirectedFrom", searchParams.get("redirectedFrom")!, {
      httpOnly: true,
      secure: false,
      path: "/",
      maxAge: 60 * 60,
    });
  throw request.redirect(302, url.toString());
};
