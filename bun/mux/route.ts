import { createHmac } from "crypto";
import Elysia, { t } from "elysia";

if (!Bun.env.MUX_SIGNING_SECRET) throw new Error("Server MUX env var Error!");

const app = new Elysia().group("/mux", (app) => {
  return app.post(
    "/",
    async ({ body, headers }) => {
      if (!headers["mux-signature"]) {
        throw new Error("Invalid signature!");
      }
      console.log(headers, body);
      const [_t, _v1] = headers["mux-signature"];
      const t = _t.slice(2);
      const expected_signature = _v1.slice(3);
      const payload = t + "." + body;
      const hmac = createHmac("sha256", Bun.env.MUX_SIGNING_SECRET!)
        .update(payload)
        .digest("base64");
      console.log(hmac, expected_signature, hmac === expected_signature);
    },
    {
      async parse(ctx) {
        return await ctx.request.text();
      },
      body: t.Not(t.Undefined()),
    }
  );
});
export default app;
