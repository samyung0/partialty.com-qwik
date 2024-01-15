import type { RequestHandler } from "@builder.io/qwik-city";
import { OAuthRequestError } from "@lucia-auth/oauth";
import bunApp from "~/_api/bun/util/edenTreaty";

export const onGet: RequestHandler = async (request) => {
  const storedState = request.cookie.get("github_app_state")?.value;
  const url = new URL(request.url);
  const state = url.searchParams.get("state");
  // const code = url.searchParams.get("code");
  const installationId = url.searchParams.get("installation_id");

  if (!storedState || !state || storedState !== state || !installationId) {
    throw request.redirect(302, "/uploadRepo/?errMessage=App installation failed!");
  }

  try {
    if (!request.env.get("GITHUB_REPO_APPID")) throw Error("Server Error! Please try again later");
    // console.log(request.env.get("GITHUB_REPO_ID"), request.env.get("GITHUB_REPO_SECRET"), code);
    const jwt = await bunApp.auth.githubApp.generateJWT.post({
      id: request.env.get("GITHUB_REPO_APPID")!,
      installationId,
    });
    if (jwt.error) throw Error("Server Error! Please try again later");
    const res = await fetch(
      `https://api.github.com/app/installations/${installationId}/access_tokens`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt.data}`,
          "X-GitHub-Api-Version": "2022-11-28",
          Accept: "application/vnd.github+json",
        },
      }
    )
      .then((res) => {
        return res.json();
      })
      .catch((e) => {
        throw Error(e);
      });
    request.cookie.set("github_access_token", res.token, {
      path: "/",
      secure: true,
      httpOnly: true,
      expires: new Date(res.expires_at),
    });
  } catch (e) {
    console.error(e);
    if (e instanceof OAuthRequestError) {
      throw request.redirect(302, "/uploadRepo/?errMessage=OAuth failed!");
    }
    throw request.redirect(302, "/uploadRepo/?errMessage=" + e);
  }
  throw request.redirect(302, "/uploadRepo/");

  // try {
  //   const { getExistingUser, githubUser, createUser } = await githubAuthRepoAccess().validateCallback(code);

  //   const getUser = async () => {
  //     const existingUser = await getExistingUser();
  //     if (existingUser) return existingUser;
  //     else throw Error("Dsadas")
  //     // const attributes: Lucia.DatabaseUserAttributes = {
  //     //   username: githubUser.login,
  //     //   avatar_url: githubUser.avatar_url,
  //     //   nickname: githubUser.login,
  //     // };
  //     // if (githubUser.email) attributes.email = githubUser.email;
  //     // const user = await createUser({
  //     //   attributes,
  //     // });
  //     // return user;
  //   };

  //   const Auth = auth();

  //   const user = await getUser();
  //   const session = await Auth.createSession({
  //     userId: user.userId,
  //     attributes: {},
  //   });
  //   const authRequest = Auth.handleRequest(request);
  //   authRequest.setSession(session);
  // } catch (e) {
  //   console.error(e);
  //   if (e instanceof OAuthRequestError) {
  //     throw request.redirect(302, "/login/?errMessage=OAuth failed!");
  //   }
  //   throw request.redirect(302, "/login/?errMessage=" + e);
  // }
  // throw request.redirect(302, "/uploadRepo/");
};
