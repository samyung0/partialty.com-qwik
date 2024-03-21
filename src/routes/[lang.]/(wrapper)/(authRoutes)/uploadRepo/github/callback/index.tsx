import { type RequestHandler } from "@builder.io/qwik-city";
import { eq } from "drizzle-orm";
import { auth } from "~/auth/lucia";
import type { LuciaSession } from "~/types/LuciaSession";
import drizzleClient from "~/utils/drizzleClient";
import { profiles } from "../../../../../../../../drizzle_turso/schema/profiles";

export const onGet: RequestHandler = async (request) => {
  const storedState = request.cookie.get("github_app_state")?.value;
  const url = new URL(request.url);
  const state = url.searchParams.get("state");
  // const code = url.searchParams.get("code");
  const installationId = url.searchParams.get("installation_id");

  if (!storedState || !state || storedState !== state || !installationId) {
    throw request.redirect(302, "/uploadRepo/?errMessage=App installation failed!");
  }

  const authRequest = auth(request.env, import.meta.env.VITE_USE_PROD_DB === "1").handleRequest(
    request
  );

  let session: LuciaSession | null = null;
  try {
    session = await authRequest.validate();
  } catch (e) {
    throw request.redirect(302, "/uploadRepo/?errMessage=Unauthorized!");
  }

  if (!session) throw request.redirect(302, "/uploadRepo/?errMessage=Unauthorized!");
  const userId = session.user.userId;

  await drizzleClient(request.env)
    .update(profiles)
    .set({ github_installation_id: installationId })
    .where(eq(profiles.id, userId));

  // await drizzleClient()
  // try {
  //   if (!request.env.get("GITHUB_REPO_APPID")) throw Error("Server Error! Please try again later");
  //   // console.log(request.env.get("GITHUB_REPO_ID"), request.env.get("GITHUB_REPO_SECRET"), code);
  //   const jwt = await bunApp.auth.githubApp.generateJWT.post({
  //     id: request.env.get("GITHUB_REPO_APPID")!,
  //     installationId,
  //   });
  //   if (jwt.error) throw Error("Server Error! Please try again later");
  //   const res = await fetch(
  //     `https://api.github.com/app/installations/${installationId}/access_tokens`,
  //     {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${jwt.data}`,
  //         "X-GitHub-Api-Version": "2022-11-28",
  //         Accept: "application/vnd.github+json",
  //       },
  //     }
  //   )
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .catch((e) => {
  //       throw Error(e);
  //     });
  //   request.cookie.set("github_access_token", res.token, {
  //     path: "/",
  //     secure: true,
  //     httpOnly: true,
  //     expires: new Date(res.expires_at),
  //   });
  // } catch (e) {
  //   console.error(e);
  //   if (e instanceof OAuthRequestError) {
  //     throw request.redirect(302, "/uploadRepo/?errMessage=OAuth failed!");
  //   }
  //   throw request.redirect(302, "/uploadRepo/?errMessage=" + e);
  // }
  throw request.redirect(302, "/uploadRepo/");
};
