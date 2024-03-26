import type { RequestHandler } from '@builder.io/qwik-city';
import { githubAuth } from '~/auth/lucia';

export const onGet: RequestHandler = async (request) => {
  const GithubAuth = githubAuth(request.env, import.meta.env.VITE_USE_PROD_DB === '1');
  const [_, state] = await GithubAuth.getAuthorizationUrl();
  request.cookie.set('github_app_state', state, {
    httpOnly: true,
    secure: import.meta.env.MODE === 'production',
    path: '/',
    maxAge: 60 * 60,
  });
  const url = `https://github.com/apps/partialty-com-dev/installations/new?state=${state}&redirect_uri=http://localhost:5173/uploadRepo/github/callback/`;
  throw request.redirect(302, url.toString());
};
