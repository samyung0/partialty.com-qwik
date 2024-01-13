import { Elysia, t } from "elysia";
import verifyHash from "./verifyHash";

const app = new Elysia().group("/auth", (app) => {
  return app
    .post(
      "/signup/passwordToHash",
      async ({ body, set }) => {
        console.log(Date.now(), body.time);
        if (Date.now() - body.time > 3 * 60 * 1000) {
          set.status = 400;
          return { error: true, message: "Bad Request" };
        }
        try {
          const hash = await Bun.password.hash(body.password);
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
        console.log(Date.now(), body.time);
        if (Date.now() - body.time > 3 * 60 * 1000) {
          set.status = 400;
          return { error: true, message: "Bad Request" };
        }
        try {
          if (await verifyHash(body.password, body.hash)) {
            return { error: false, isVerified: true };
          } else {
            return { error: true, isVerified: false, message: "Incorrect Password!" };
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
