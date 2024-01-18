import type { RequestHandler } from "@builder.io/qwik-city";
import { LibsqlError } from "@libsql/client";
import { OAuthRequestError } from "@lucia-auth/oauth";
import { and, eq } from "drizzle-orm";
import { auth, googleAuth } from "~/auth/lucia";
import type { Lucia } from "~/lucia";
import drizzleClient from "~/utils/drizzleClient";
import { profiles } from "../../../../../../../drizzle_turso/schema/profiles";

export const onGet: RequestHandler = async (request) => {
  const storedState = request.cookie.get("google_oauth_state")?.value;
  const url = new URL(request.url);
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");

  if (!storedState || !state || storedState !== state || !code) {
    throw request.redirect(302, "/login/?errMessage=OAuth failed!");
  }

  try {
    const { getExistingUser, googleUser, createUser, createKey } =
      await googleAuth().validateCallback(code);

    console.log(googleUser);

    const getUser = async () => {
      const existingUser = await getExistingUser();
      if (existingUser) return existingUser;
      const attributes: Lucia.DatabaseUserAttributes = {
        username: googleUser.name,
        avatar_url: googleUser.picture,
        nickname: googleUser.name,
        email_verified: false,
        google_id: String(googleUser.sub),
      };

      if (googleUser.email && googleUser.email_verified) {
        const drizzle = drizzleClient();
        const existingDatabaseUserWithEmail = await drizzle
          .select()
          .from(profiles)
          .where(and(eq(profiles.email, googleUser.email), eq(profiles.email_verified, true)))
          .limit(1);
        if (existingDatabaseUserWithEmail.length > 0) {
          const user = Auth.transformDatabaseUser(existingDatabaseUserWithEmail[0]);
          await createKey(user.userId);
          await drizzle
            .update(profiles)
            .set({ google_id: String(googleUser.sub) })
            .where(eq(profiles.id, user.userId));
          return user;
        } else {
          attributes.email = googleUser.email;
          attributes.email_verified = true;
          const user = await createUser({
            attributes,
          });
          return user;
        }
      } else {
        const user = await createUser({
          attributes,
        });
        return user;
      }
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
    if (e instanceof LibsqlError) {
      if (
        e.message.includes("UNIQUE constraint failed: user_key.id") ||
        e.message.includes("UNIQUE constraint failed: profiles.email")
      ) {
        throw request.redirect(
          302,
          "/login/?errMessage=Error! User already exists! Try verifying your email first before logging in with other means."
        );
      }
    }
    if (e instanceof OAuthRequestError) {
      throw request.redirect(302, "/login/?errMessage=OAuth failed!");
    }
    throw request.redirect(302, "/login/?errMessage=" + e);
  }
  throw request.redirect(302, "/members/dashboard/");
};
