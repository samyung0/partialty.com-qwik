import { createHmac } from "crypto";
import Elysia, { t } from "elysia";
import { turso } from "../turso";

// const;
const wsArr = new Map();
const wsArrClear = new Map();
const uploadUrlMapUserId = new Map();
const uploadIdMapUploadUrl = new Map();

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
  deleteMuxAssetDB(id);
};

const insertMuxAssetDB = (id: string, userId: string, filename: string) =>
  turso.execute(
    `INSERT INTO mux_assets (id, user_id, name) values ('${id}', '${userId}', '${filename}')`
  );

const deleteMuxAssetDB = (id: string) => turso.execute(`DELETE FROM mux_assets where id='${id}'`);

const app = new Elysia()
  .group("/mux", (app) => {
    return app.post(
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
        if (!type || !id) {
          throw new Error("Unknown asset from Mux!");
        }
        if (type === "video.upload.created") {
          const url = (body as any).data.url;
          if (url) {
            console.log("set url");
            uploadIdMapUploadUrl.set(id, url);
          }
        }
        if (type === "video.asset.created") {
          const upload_id = (body as any).data.upload_id;
          if (!upload_id) {
            console.log("no upload id");
            deleteMuxAssetDB(id);
            return;
          }
          const url = uploadIdMapUploadUrl.get(upload_id);
          if (!url) {
            console.log("no url");
            deleteMuxAssetDB(id);
            return;
          }
          const { userId, filename } = uploadUrlMapUserId.get(url);
          if (!userId || !filename) {
            console.log("no userId or filename");
            deleteMuxAssetDB(id);
            return;
          }
          await insertMuxAssetDB(id, userId, filename);
          wsArr.get(userId).send(
            JSON.stringify({
              type: "assetSuccess",
              message: "OK",
            })
          );
        }
        if (type === "video.asset.ready") {
          const upload_id = (body as any).data.upload_id;
          if (!upload_id) {
            deleteMuxAssetDB(id);
            return;
          }
          const url = uploadIdMapUploadUrl.get(upload_id);
          if (!url) {
            deleteMuxAssetDB(id);
            return;
          }
          const { userId, filename } = uploadUrlMapUserId.get(url);
          if (!userId || !filename) {
            deleteMuxAssetDB(id);
            return;
          }
          await insertMuxAssetDB(id, userId, filename);
          wsArr.get(userId).send(
            JSON.stringify({
              type: "assetReady",
              message: "OK",
            })
          );
          uploadIdMapUploadUrl.delete(upload_id);
          uploadUrlMapUserId.delete(url);
        }
        if (type === "video.asset.deleted") {
          deleteMuxAssetDB(id);
          return;
        }
      },
      {
        async parse(ctx) {
          return await ctx.request.text();
        },
        body: t.Not(t.Undefined()),
      }
    );
  })
  .ws("/mux/ws", {
    message(ws, msg: any) {
      console.log(msg);
      try {
        if (msg.type === "init") {
          const userId = msg.userId;
          console.log("init", userId, Array.from(wsArr.keys()));
          if (!userId || wsArr.get(userId)) {
            ws.send(
              JSON.stringify({
                type: "error",
                message: "User ID is empty or a connection has already been made!",
              })
            );
            return ws.close();
          }
          wsArrClear.set(
            userId,
            setTimeout(() => wsArr.delete(userId), 60 * 1000)
          );
          return wsArr.set(userId, ws);
        }
        if (msg.type === "initCreate") {
          const url = msg.url,
            userId = msg.userId,
            filename = msg.filename;
          if (!url || !userId || !filename) {
            return ws.send(
              JSON.stringify({
                type: "error",
                message: "Upload Url or userId or filename is empty!",
              })
            );
          }
          uploadUrlMapUserId.set(url, { userId, filename });
          return ws.send(
            JSON.stringify({
              type: "createSuccess",
              message: "OK",
            })
          );
        }
        if (msg.type === "heartBeat") {
          const userId = msg.userId;
          if (!userId || !wsArrClear.get(userId)) {
            return ws.send(
              JSON.stringify({
                type: "error",
                message: "User ID is empty or User ID not found in connection map!",
              })
            );
          }
          clearTimeout(wsArrClear.get(userId));
          wsArrClear.set(
            userId,
            setTimeout(() => wsArr.delete(userId), 60 * 1000)
          );
        }
        if (msg.type === "terminate") {
          const userId = msg.userId;
          wsArrClear.delete(userId);
          return wsArr.delete(userId);
        }
      } catch (e) {
        console.error(e);
      }
    },
  });
export default app;
