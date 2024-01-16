import type { RequestHandler } from "@builder.io/qwik-city";
import { OAuthRequestError } from "@lucia-auth/oauth";
import { auth, googleAuth } from "~/auth/lucia";
import type { Lucia } from "~/lucia";

export const onGet: RequestHandler = async (request) => {
  const storedState = request.cookie.get("google_oauth_state")?.value;
  const url = new URL(request.url);
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");

  if (!storedState || !state || storedState !== state || !code) {
    throw request.redirect(302, "/login/?errMessage=OAuth failed!");
  }

  try {
    const { getExistingUser, googleUser, createUser } = await googleAuth().validateCallback(code);

    console.log(googleUser);

    const getUser = async () => {
      const existingUser = await getExistingUser();
      if (existingUser) return existingUser;
      const attributes: Lucia.DatabaseUserAttributes = {
        username: googleUser.name,
        avatar_url: googleUser.picture,
        nickname: googleUser.name,
        email_verified: false,
        google_id: BigInt(googleUser.sub),
      };
      if (googleUser.email && googleUser.email_verified) {
        attributes.email = googleUser.email;
        attributes.email_verified = true;
      }
      const user = await createUser({
        attributes,
      });
      return user;
    };

    const Auth = auth();

    const user = await getUser();
    const session = await Auth.createSession({
      userId: user.userId,
      attributes: {},
    });
    const authRequest = Auth.handleRequest(request);
    authRequest.setSession(session);
  } catch (e) {
    console.error(e);
    if (e instanceof OAuthRequestError) {
      throw request.redirect(302, "/login/?errMessage=OAuth failed!");
    }
    throw request.redirect(302, "/login/?errMessage=" + e);
  }
  throw request.redirect(302, "/members/dashboard/");
};
