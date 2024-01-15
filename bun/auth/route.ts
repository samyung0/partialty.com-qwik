import { Elysia, t } from "elysia";
import generateJWTForGithub from "./generateJWTForGithub";
import passwordToHash from "./passwordToHash";
import verifyHash from "./verifyHash";

import { createAppAuth } from "@octokit/auth-app";
import path from "node:path";
import { Octokit } from "octokit";

const app = new Elysia().group("/auth", (app) => {
  return app
    .post(
      "/test",
      async ({ body }) => {
        const octokit = new Octokit({
          authStrategy: createAppAuth,
          auth: {
            appId: body.id,
            privateKey: await Bun.file(
              path.resolve(import.meta.dir, "../keys/partialty-com-dev.2024-01-14.private-key.pem")
            ).text(),
            installationId: body.installationId,
          },
        });
        const repos = await octokit.request("GET /search/repositories", {
          q: "user:samyung0",
          per_page: 999,
        });
        console.log("REPOS", repos.data.total_count, repos.data.incomplete_results);
      },
      {
        body: t.Object({
          id: t.String(),
          installationId: t.String(),
        }),
      }
    )
    .post(
      "/githubApp/generateJWT",
      async ({ body }) => {
        const jwt = await generateJWTForGithub(body.id);
        // const res: any = await fetch(
        //   `https://api.github.com/app/installations/${body.installationId}/access_tokens`,
        //   {
        //     method: "POST",
        //     headers: {
        //       Authorization: `Bearer ${jwt}`,
        //       "X-GitHub-Api-Version": "2022-11-28",
        //       Accept: "application/vnd.github+json",
        //     },
        //   }
        // )
        //   .then((res) => {
        //     return res.json();
        //   });
        //   const token = res.token;
        return jwt;
      },
      {
        body: t.Object({
          id: t.String(),
          installationId: t.String(),
        }),
      }
    )
    .post(
      "/signup/passwordToHash",
      async ({ body, set }) => {
        if (Date.now() - body.time > 3 * 60 * 1000) {
          set.status = 400;
          return { error: true, message: "Bad Request" };
        }
        try {
          const hash = await passwordToHash(body.password);
          return { error: false, data: hash };
        } catch (e) {
          return { error: true, message: (e as any).toString() };
        }
      },
      {
        body: t.Object({
          password: t.String(),
          time: t.Number(),
        }),
      }
    )
    .post(
      "/login/hashToPassword",
      async ({ body, set }) => {
        if (Date.now() - body.time > 3 * 60 * 1000) {
          set.status = 400;
          return { error: true, message: "Bad Request" };
        }
        try {
          if (await verifyHash(body.password, body.hash)) {
            return { error: false, isVerified: true };
          } else {
            return { error: false, isVerified: false, message: "Incorrect Password!" };
          }
        } catch (e) {
          return { error: true, isVerified: false, message: (e as any).toString() };
        }
      },
      {
        body: t.Object({
          hash: t.String(),
          password: t.String(),
          time: t.Number(),
        }),
      }
    );
});

export default app;
