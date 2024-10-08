import { Elysia, t } from 'elysia';
import generateJWTForGithub from './generateJWTForGithub';
import passwordToHash from './passwordToHash';
import verifyHash from './verifyHash';

const app = new Elysia().group('/auth', (app) => {
  return app
    .post(
      '/githubApp/generateJWT',
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
      '/signup/passwordToHash',
      async ({ body, set }) => {
        if (Date.now() - body.time > 3 * 60 * 1000) {
          set.status = 400;
          return { error: true, message: 'Bad Request' };
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
      '/login/hashToPassword',
      async ({ body, set }) => {
        if (Date.now() - body.time > 3 * 60 * 1000) {
          set.status = 400;
          return { error: true, message: 'Bad Request' };
        }
        try {
          if (await verifyHash(body.password, body.hash)) {
            return { error: false, isVerified: true };
          } else {
            return { error: false, isVerified: false, message: 'Incorrect Password!' };
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
