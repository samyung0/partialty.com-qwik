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
        try {
          console.log(body);
          const data = JSON.parse(body as any);
          const type = data.type;
          if (!type) {
            throw new Error("Unknown asset from Mux!");
          }
          if (type === "video.upload.created") {
            const url = data.data.url;
            const id = data.object.id;
            if (url && id) {
              uploadIdMapUploadUrl.set(id, url);
            }
            return;
          }
          if (type === "video.asset.created") {
            const upload_id = data.data.upload_id;
            const id = data.object.id;
            if (!upload_id) {
              console.error("Upload Id not found in video.asset.created!");
              deleteMuxAsset(id);
              return;
            }
            const url = uploadIdMapUploadUrl.get(upload_id);
            if (!url) {
              uploadIdMapUploadUrl.forEach((value, key) => {
                console.log(key, value);
              });
              console.error("Url not found in uploadIdMapUploadUrl!");
              deleteMuxAsset(id);
              return;
            }
            const { userId, filename } = uploadUrlMapUserId.get(url);
            if (!userId || !filename) {
              uploadUrlMapUserId.forEach((value, key) => {
                console.log(key, value);
              });
              console.error("UserId or Filename not found in uploadUrlMapUserId!");
              deleteMuxAsset(id);
              return;
            }
            return wsArr.get(userId).send(
              JSON.stringify({
                type: "assetSuccess",
                message: "OK",
              })
            );
          }
          if (type === "video.asset.ready") {
            const id = data.object.id;
            const upload_id = data.data.upload_id;
            if (!upload_id) {
              deleteMuxAsset(id);
              return;
            }
            const url = uploadIdMapUploadUrl.get(upload_id);
            if (!url) {
              deleteMuxAsset(id);
              return;
            }
            const { userId, filename } = uploadUrlMapUserId.get(url);
            if (!userId || !filename) {
              deleteMuxAsset(id);
              return;
            }
            try {
              await insertMuxAssetDB(id, userId, filename);
            } catch (e) {
              console.error(e);
              deleteMuxAsset(id);
            }
            wsArr.get(userId).send(
              JSON.stringify({
                type: "assetReady",
                message: {
                  id: id,
                  filename: filename,
                  duration: data.data.duration,
                  created_at: data.data.created_at,
                },
              })
            );
            uploadIdMapUploadUrl.delete(upload_id);
            uploadUrlMapUserId.delete(url);
            return;
          }
          if (type === "video.asset.deleted") {
            const id = data.object.id;
            deleteMuxAssetDB(id);
            return;
          }
        } catch (e) {
          console.error(e);
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
            setTimeout(
              () => {
                console.error("deleting" + userId);
                wsArr.delete(userId);
              },
              2 * 60 * 1000
            )
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
            console.error("Hearbeat Error! unknown id!");
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
            setTimeout(
              () => {
                console.error("deleting" + userId);
                wsArr.delete(userId);
              },
              2 * 60 * 1000
            )
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
