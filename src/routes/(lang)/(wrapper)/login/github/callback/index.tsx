import type { RequestHandler } from '@builder.io/qwik-city';
import { LibsqlError } from '@libsql/client';
import { OAuthRequestError } from '@lucia-auth/oauth';
import { and, eq } from 'drizzle-orm';
import { auth, githubAuth } from '~/auth/lucia';
import type { Lucia } from '~/lucia';
import drizzleClient from '~/utils/drizzleClient';
import { profiles } from '../../../../../../../drizzle_turso/schema/profiles';

export const onGet: RequestHandler = async (request) => {
  const redirectedFrom = request.cookie.get('redirectedFrom')?.value;
  request.cookie.delete('redirectedFrom');

  const storedState = request.cookie.get('github_oauth_state')?.value;
  const url = new URL(request.url);
  const state = url.searchParams.get('state');
  const code = url.searchParams.get('code');

  if (!storedState || !state || storedState !== state || !code) {
    throw request.redirect(302, '/login/?errMessage=OAuth failed!');
  }

  try {
    const { getExistingUser, githubUser, createUser, githubTokens, createKey } = await githubAuth(
      request.env,
      import.meta.env.VITE_USE_PROD_DB === '1'
    ).validateCallback(code);

    const getUser = async () => {
      const existingUser = await getExistingUser();
      if (existingUser) return existingUser;
      const attributes: Lucia.DatabaseUserAttributes = {
        username: githubUser.login,
        avatar_url: githubUser.avatar_url,
        nickname: githubUser.login,
        email_verified: false,
        github_id: String(githubUser.id),
      };
      const emails = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${githubTokens.accessToken}`,
        },
      }).then((res) => res.json());
      if (Array.isArray(emails)) {
        const primaryEmail = emails.filter(
          (email: { email: string; primary: boolean; verified: boolean; visibility: boolean }) => email.primary
        )[0];
        if (primaryEmail && primaryEmail.verified) {
          const drizzle = drizzleClient(request.env);
          const existingDatabaseUserWithEmail = await drizzle
            .select()
            .from(profiles)
            .where(and(eq(profiles.email, primaryEmail.email), eq(profiles.email_verified, true)))
            .limit(1);
          if (existingDatabaseUserWithEmail.length > 0) {
            const user = Auth.transformDatabaseUser(existingDatabaseUserWithEmail[0]);
            await createKey(user.userId);
            await drizzle
              .update(profiles)
              .set({ github_id: String(githubUser.id) })
              .where(eq(profiles.id, user.userId));
            return user;
          } else {
            attributes.email = primaryEmail.email;
            attributes.email_verified = true;
            const user = await createUser({
              attributes,
            });
            return user;
          }
        } else {
          throw request.redirect(
            302,
            '/login/?errMessage=Error! Please use a Github account with a verified email address.'
          );
        }
      } else {
        const user = await createUser({
          attributes,
        });
        return user;
      }
    };

    const Auth = auth(request.env, import.meta.env.VITE_USE_PROD_DB === '1');

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
        e.message.includes('UNIQUE constraint failed: user_key.id') ||
        e.message.includes('UNIQUE constraint failed: profiles.email')
      ) {
        throw request.redirect(
          302,
          '/login/?errMessage=Error! User already exists! Try verifying your email first before logging in with other means.'
        );
      }
    }
    if (e instanceof OAuthRequestError) {
      throw request.redirect(302, '/login/?errMessage=OAuth failed!');
    }
    throw request.redirect(302, '/login/?errMessage=' + e);
  }
  if (redirectedFrom) throw request.redirect(302, redirectedFrom);
  throw request.redirect(302, '/members/dashboard/');
};
