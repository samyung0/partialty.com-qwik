import type { RequestHandler } from '@builder.io/qwik-city';
import { githubAuth } from '~/auth/lucia';

export const onGet: RequestHandler = async (request) => {
  const GithubAuth = githubAuth(request.env, import.meta.env.VITE_USE_PROD_DB === '1');
  const [url, state] = await GithubAuth.getAuthorizationUrl();
  const searchParams = request.url.searchParams;
  request.cookie.set('github_oauth_state', state, {
    httpOnly: true,
    secure: import.meta.env.MODE === 'production',
    path: '/',
    maxAge: 60 * 60,
  });
  if (searchParams.get('redirectedFrom'))
    request.cookie.set('redirectedFrom', searchParams.get('redirectedFrom')!, {
      httpOnly: true,
      secure: false,
      path: '/',
      maxAge: 60 * 60,
    });
  throw request.redirect(302, url.toString());
};
