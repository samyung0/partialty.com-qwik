import { server$ } from '@builder.io/qwik-city';
import { eq } from 'drizzle-orm';
import bunApp from '~/_api/bun/util/edenTreaty';
import drizzleClient from '~/utils/drizzleClient';
import { profiles } from '../../../drizzle_turso/schema/profiles';

export default server$(async function (userId: string) {
  if (this.cookie.get('github_access_token')) return this.cookie.get('github_access_token')!.value;
  const installationId = (
    await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === '1')
      .select({ github_installation_id: profiles.github_installation_id })
      .from(profiles)
      .where(eq(profiles.id, userId))
  )[0]?.github_installation_id;
  if (!installationId) return null;
  try {
    if (!this.env.get('GITHUB_REPO_APPID')) throw Error('Server Error! Please try again later');
    // console.log(this.env.get("GITHUB_REPO_ID"), this.env.get("GITHUB_REPO_SECRET"), code);
    const jwt = await bunApp.auth.githubApp.generateJWT.post({
      id: this.env.get('GITHUB_REPO_APPID')!,
      installationId,
    });
    if (jwt.error) throw Error('Server Error! Please try again later');
    const res = await fetch(`https://api.github.com/app/installations/${installationId}/access_tokens`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt.data}`,
        'X-GitHub-Api-Version': '2022-11-28',
        Accept: 'application/vnd.github+json',
      },
    })
      .then((res) => {
        return res.json();
      })
      .catch((e) => {
        throw Error(e);
      });
    this.cookie.set('github_access_token', res.token, {
      path: '/',
      secure: true,
      httpOnly: true,
      expires: new Date(res.expires_at),
    });
    return res.token;
  } catch (e) {
    console.error(e);
    return null;
  }
});
