import { createHmac } from "crypto";
import Elysia, { t } from "elysia";

// const;
const wsArr = [];

if (!Bun.env.MUX_PRODUCTION_ID || !Bun.env.MUX_PRODUCTION_SECRET)
  throw new Error("Server Mux env var Error!");

const deleteMuxAsset = (id: string) => {
  fetch("https://api.mux.com/video/v1/assets/" + id, {
    method: "DELETE",
    headers: {
      Authorization: `Basic ${btoa(
        Bun.env.MUX_PRODUCTION_ID! + ":" + Bun.env.MUX_PRODUCTION_SECRET!
      )}`,
      "Content-Type": "application/json",
    },
  });
};

const app = new Elysia().group("/mux", (app) => {
  return app
    .post(
      "/",
      async ({ body, headers }) => {
        if (!headers["mux-signature"]) {
          throw new Error("Invalid signature!");
        }
        const [_t, _v1] = headers["mux-signature"].split(",");
        const t = _t.slice(2);
        const expected_signature = _v1.slice(3);
        const payload = t + "." + body;
        const hmac = createHmac("sha256", Bun.env.MUX_SIGNING_SECRET!)
          .update(payload)
          .digest("hex");
        if (hmac !== expected_signature) {
          throw new Error("Invalid signature!");
        }
        console.log(body);
        const type = (body as any).type;
        const id = (body as any).object.id;
        const upload_id = (body as any).data.upload_id;
        if (!type || !id) {
          throw new Error("Unknown asset from Mux!");
        }
        if (!upload_id) {
          deleteMuxAsset(id);
          return;
        }
      },
      {
        async parse(ctx) {
          return await ctx.request.text();
        },
        body: t.Not(t.Undefined()),
      }
    )
    .ws("/ws", {
      open(ws) {
        wsArr.push(ws);
      },
    });
});
export default app;
