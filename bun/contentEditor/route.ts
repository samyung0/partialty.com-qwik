import { createHmac } from "crypto";
import Elysia, { t } from "elysia";
import { turso } from "../turso";

const wsContentArr = new Map<string, any>();
const userIdToAccessibleCourses = new Map<string, string[]>();
const wsContentArrClear = new Map<string, NodeJS.Timeout>();
const uuidToUserId = new Map<number, string>();
const uploadUrlMapUserId = new Map<string, { userId: string; filename: string }>();
const uploadIdMapUploadUrl = new Map<string, string>();
const courseIdToUserId = new Map<string, [string, string]>();
const userIdToCourseId = new Map<string, [string, string]>();

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

const getUser = (id: string) =>
  turso.execute({
    sql: "SELECT * FROM profiles WHERE id = ? LIMIT 1",
    args: [id],
  });

const getContentIndex = (id: string) =>
  turso.execute({
    sql: "SELECT author FROM content_index WHERE id = ? LIMIT 1",
    args: [id],
  });

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
              console.error("Url not found in uploadIdMapUploadUrl!");
              deleteMuxAsset(id);
              return;
            }
            if (!uploadUrlMapUserId.get(url)) {
              console.error("UserId or Filename not found in uploadUrlMapUserId!");
              deleteMuxAsset(id);
              return;
            }
            const { userId, filename } = uploadUrlMapUserId.get(url)!;
            return wsContentArr.get(userId).send(
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
              console.error("Upload Id not found in video.asset.created!");
              deleteMuxAsset(id);
              return;
            }
            const url = uploadIdMapUploadUrl.get(upload_id);
            if (!url) {
              console.error("Url not found in uploadIdMapUploadUrl!");
              deleteMuxAsset(id);
              return;
            }
            if (!uploadUrlMapUserId.get(url)) {
              console.error("UserId or Filename not found in uploadUrlMapUserId!");
              deleteMuxAsset(id);
              return;
            }
            const { userId, filename } = uploadUrlMapUserId.get(url)!;
            try {
              await insertMuxAssetDB(id, userId.split("###")[0], filename);
            } catch (e) {
              console.error(e);
              deleteMuxAsset(id);
            }
            wsContentArr.get(userId).send(
              JSON.stringify({
                type: "assetReady",
                message: {
                  id: id,
                  filename: filename,
                  duration: data.data.duration,
                  created_at: data.data.created_at,
                  playbackId: data.data.playback_ids[0].id,
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
  .ws("/content/ws", {
    async message(ws, msg: any) {
      // console.log(msg);
      try {
        if (msg.type === "init") {
          const userId = msg.userId;
          const accessible_courses = msg.accessible_courses;
          wsContentArrClear.set(
            userId,
            setTimeout(
              () => {
                console.error("deleting" + userId);
                const serverContentId = userIdToCourseId.get(userId);
                const message: any = {};
                if (serverContentId) {
                  courseIdToUserId.delete(serverContentId[0]);
                  userIdToCourseId.delete(userId);
                  message[serverContentId[0]] = true;
                  const userIdAccessible: string[] = [];
                  userIdToAccessibleCourses.forEach((val, key) => {
                    if (val[0] === "*" || val.includes(serverContentId[1]))
                      userIdAccessible.push(key);
                  });
                  userIdAccessible.forEach((userId) => {
                    if (wsContentArr.get(userId))
                      wsContentArr.get(userId).send(
                        JSON.stringify({
                          type: "removeUserEditing",
                          message,
                        })
                      );
                  });
                  courseIdToUserId.delete(serverContentId[0]);
                  userIdToCourseId.delete(userId);
                }
                wsContentArr.delete(userId);
                uuidToUserId.delete(ws.id);
                userIdToAccessibleCourses.delete(userId);
                wsContentArrClear.delete(userId);
              },
              5 * 60 * 1000
            )
          );
          wsContentArr.set(userId, ws);
          userIdToAccessibleCourses.set(userId, accessible_courses);
          uuidToUserId.set(ws.id, userId);
          const entries: Record<string, [string, string]> = {};
          courseIdToUserId.forEach((val, key) => {
            if (accessible_courses[0] === "*" || accessible_courses.includes(key))
              entries[key] = [val[0].split("###")[0], val[1]];
          });
          ws.send(
            JSON.stringify({
              type: "initUserEditing",
              message: entries,
            })
          );
          return;
        }
        if (msg.type === "openContent") {
          const userId = msg.userId;
          const contentId = msg.contentId;
          const avatar_url = msg.avatar_url;
          const courseId = msg.courseId;
          if (!userId || !contentId || !avatar_url || !courseId) {
            console.error("User ID, Content ID or Avatar url is empty!");
            return ws.send(
              JSON.stringify({
                type: "openContentError",
                message: "User ID, Content ID or Avatar url is empty!",
              })
            );
          }
          if (courseIdToUserId.get(contentId)) {
            if (courseIdToUserId.get(contentId) === userId) return;
            return ws.send(
              JSON.stringify({
                type: "openContentError",
                message: "Another Person is already editing the content!",
              })
            );
          }
          courseIdToUserId.set(contentId, [userId, avatar_url]);
          userIdToCourseId.set(userId, [contentId, courseId]);
          const message: any = {};
          message[contentId] = [userId, avatar_url];
          const userIdAccessible: string[] = [];
          userIdToAccessibleCourses.forEach((val, key) => {
            if (val[0] === "*" || val.includes(courseId)) userIdAccessible.push(key);
          });
          userIdAccessible.forEach((userId) => {
            if (wsContentArr.get(userId))
              wsContentArr.get(userId).send(
                JSON.stringify({
                  type: "addUserEditing",
                  message,
                })
              );
          });
          return ws.send(
            JSON.stringify({
              type: "openContentSuccess",
              message: "OK",
            })
          );
        }
        if (msg.type === "closeContent") {
          const userId = msg.userId;
          const contentId = msg.contentId;
          const courseId = msg.courseId;
          if (!userId || !contentId || !courseId) {
            return;
          }
          const serverContentId = contentId;
          const message: any = {};
          if (serverContentId) {
            courseIdToUserId.delete(serverContentId);
            userIdToCourseId.delete(userId);
            message[serverContentId] = true;
            const userIdAccessible: string[] = [];
            userIdToAccessibleCourses.forEach((val, key) => {
              if (val[0] === "*" || val.includes(courseId)) userIdAccessible.push(key);
            });
            userIdAccessible.forEach((userId) => {
              if (wsContentArr.get(userId))
                wsContentArr.get(userId).send(
                  JSON.stringify({
                    type: "removeUserEditing",
                    message,
                  })
                );
            });
          }
        }
        if (msg.type === "createContent") {
          const details = msg.details;
          const courseId = msg.courseId;
          if (!details || !courseId) {
            return ws.send(JSON.stringify({ type: "createContentFail", msg: "Content is empty!" }));
          }
          const message = { details, courseId };
          const userIdAccessible: string[] = [];
          userIdToAccessibleCourses.forEach((val, key) => {
            if (val[0] === "*" || val.includes(courseId)) userIdAccessible.push(key);
          });
          userIdAccessible.forEach((userId) => {
            if (wsContentArr.get(userId))
              wsContentArr.get(userId).send(
                JSON.stringify({
                  type: "contentCreated",
                  message,
                })
              );
          });
          return ws.send(JSON.stringify({ type: "createContentSuccess", msg: "OK" }));
        }
        if (msg.type === "createChapter") {
          const details = msg.details;
          const courseId = msg.courseId;
          const chapterId = msg.chapterId;
          if (!details || !courseId) return;
          const message = { details, courseId, chapterId };
          const userIdAccessible: string[] = [];
          userIdToAccessibleCourses.forEach((val, key) => {
            if (val[0] === "*" || val.includes(courseId)) userIdAccessible.push(key);
          });
          userIdAccessible.forEach((userId) => {
            if (wsContentArr.get(userId))
              wsContentArr.get(userId).send(
                JSON.stringify({
                  type: "chapterCreated",
                  message,
                })
              );
          });
          return ws.send(JSON.stringify({ type: "createChapterSuccess", msg: "OK" }));
        }
        if (msg.type === "editContentDetails") {
          const details = msg.details;
          const courseId = msg.courseId;
          const chapterId = msg.chapterId;
          if (!details || !courseId || !chapterId) return;
          const message = { details, courseId, chapterId };
          const userIdAccessible: string[] = [];
          userIdToAccessibleCourses.forEach((val, key) => {
            if (val[0] === "*" || val.includes(courseId)) userIdAccessible.push(key);
          });
          userIdAccessible.forEach((userId) => {
            if (wsContentArr.get(userId))
              wsContentArr.get(userId).send(
                JSON.stringify({
                  type: "contentDetailsEdited",
                  message,
                })
              );
          });
          return;
        }
        if (msg.type === "editContentIndexDetails") {
          const details = msg.details;
          const courseId = msg.courseId;
          if (!details || !courseId) return;
          const message = { details, courseId };
          const userIdAccessible: string[] = [];
          userIdToAccessibleCourses.forEach((val, key) => {
            if (val[0] === "*" || val.includes(courseId)) userIdAccessible.push(key);
          });
          userIdAccessible.forEach((userId) => {
            if (wsContentArr.get(userId))
              wsContentArr.get(userId).send(
                JSON.stringify({
                  type: "contentIndexDetailsEdited",
                  message,
                })
              );
          });
          return;
        }
        if (msg.type === "deleteContent") {
          const userId = msg.userId;
          const contentId = msg.contentId;
          const courseId = msg.courseId;
          if (!userId || !contentId || !courseId) {
            return ws.send(
              JSON.stringify({
                type: "deleteContentError",
                message: "Badly formatted request",
              })
            );
          }
          const user = (await getUser(userId)).rows[0];
          if (!user)
            return ws.send(
              JSON.stringify({
                type: "deleteContentError",
                message: "Badly formatted request",
              })
            );
          try {
            let accessible_courses: string[] = [];
            if (user.role !== "admin") {
              accessible_courses = JSON.parse((user.accessible_courses as string) || "[]");
              if (!accessible_courses.includes(courseId))
                return ws.send(
                  JSON.stringify({
                    type: "deleteContentError",
                    message: "No permission!",
                  })
                );
            }
          } catch (e) {
            console.error(e);
            return ws.send(
              JSON.stringify({
                type: "deleteContentError",
                message: "Server error occured. Please try again later.",
              })
            );
          }
          if (courseIdToUserId.get(contentId)) {
            return ws.send(
              JSON.stringify({
                type: "deleteContentError",
                message: "Someone is editing the content!",
              })
            );
          }
          return ws.send(
            JSON.stringify({
              type: "deleteContentSuccess",
              message: "OK",
            })
          );
        }
        if (msg.type === "deleteContentIndex") {
          const userId = msg.userId;
          const _contentId = msg.contentId;
          const courseId = msg.courseId;
          if (!userId || !_contentId || !courseId) {
            return ws.send(
              JSON.stringify({
                type: "deleteContentError",
                message: "Badly formatted request",
              })
            );
          }
          const user = (await getUser(userId)).rows[0];
          if (!user)
            return ws.send(
              JSON.stringify({
                type: "deleteContentError",
                message: "Badly formatted request",
              })
            );
          try {
            let accessible_courses: string[] = [];
            if (user.role !== "admin") {
              accessible_courses = JSON.parse((user.accessible_courses as string) || "[]");
              if (!accessible_courses.includes(courseId))
                return ws.send(
                  JSON.stringify({
                    type: "deleteContentError",
                    message: "No permission!",
                  })
                );
            }
          } catch (e) {
            console.error(e);
            return ws.send(
              JSON.stringify({
                type: "deleteContentError",
                message: "Server error occured. Please try again later.",
              })
            );
          }
          for (let i = 0; i < _contentId.length; i++) {
            const contentId = _contentId[i];
            if (courseIdToUserId.get(contentId)) {
              return ws.send(
                JSON.stringify({
                  type: "deleteContentIndexError",
                  message: "Someone is editing the content!",
                })
              );
            }
          }
          return ws.send(
            JSON.stringify({
              type: "deleteContentIndexSuccess",
              message: "OK",
            })
          );
        }
        if (msg.type === "deleteContentCB") {
          const contentId = msg.contentId;
          const courseId = msg.courseId;
          if (!contentId || !courseId) {
            return;
          }
          const message: any = {};
          message.contentId = contentId;
          message.courseId = courseId;
          const userIdAccessible: string[] = [];
          userIdToAccessibleCourses.forEach((val, key) => {
            if (val[0] === "*" || val.includes(courseId)) userIdAccessible.push(key);
          });
          userIdAccessible.forEach((userId) => {
            if (wsContentArr.get(userId))
              wsContentArr.get(userId).send(
                JSON.stringify({
                  type: "contentDeleted",
                  message,
                })
              );
          });
        }
        if (msg.type === "deleteContentIndexCB") {
          const courseId = msg.courseId;
          if (!courseId) {
            console.log("missing", msg.contentId);
            return;
          }
          const message: any = {};
          message.courseId = courseId;
          const userIdAccessible: string[] = [];
          userIdToAccessibleCourses.forEach((val, key) => {
            if (val[0] === "*" || val.includes(courseId)) userIdAccessible.push(key);
          });
          userIdAccessible.forEach((userId) => {
            if (wsContentArr.get(userId))
              wsContentArr.get(userId).send(
                JSON.stringify({
                  type: "contentIndexDeleted",
                  message,
                })
              );
          });
        }
        if (msg.type === "lockContent") {
          const contentId = msg.contentId;
          const courseId = msg.courseId;
          const userId = msg.userId;
          if (!contentId || !courseId || !userId) {
            return;
          }
          const contentIndex = (await getContentIndex(courseId)).rows[0];
          if (!contentIndex || (contentIndex.author as string) !== userId) {
            return;
          }
          if (courseIdToUserId.get(contentId)) {
            if (wsContentArr.get(courseIdToUserId.get(contentId)![0]))
              wsContentArr.get(courseIdToUserId.get(contentId)![0]).send(
                JSON.stringify({
                  type: "forceCloseContent",
                  message: "Chapter locked by author!",
                })
              );
          }
          const message = { courseId, contentId };
          const userIdAccessible: string[] = [];
          userIdToAccessibleCourses.forEach((val, key) => {
            if (val[0] === "*" || val.includes(courseId)) userIdAccessible.push(key);
          });
          userIdAccessible.forEach((userId) => {
            if (wsContentArr.get(userId))
              wsContentArr.get(userId).send(
                JSON.stringify({
                  type: "contentLocked",
                  message,
                })
              );
          });
          return;
        }
        if (msg.type === "lockContentIndex") {
          const _contentId = msg.contentId;
          const courseId = msg.courseId;
          const userId = msg.userId;
          if (!_contentId || !courseId || !userId) {
            return;
          }
          const contentIndex = (await getContentIndex(courseId)).rows[0];
          if (!contentIndex || (contentIndex.author as string) !== userId) {
            return;
          }
          for (let i = 0; i < _contentId.length; i++) {
            const contentId = _contentId[i];
            if (courseIdToUserId.get(contentId)) {
              if (wsContentArr.get(courseIdToUserId.get(contentId)![0]))
                wsContentArr.get(courseIdToUserId.get(contentId)![0]).send(
                  JSON.stringify({
                    type: "forceCloseContent",
                    message: "Course locked by author!",
                  })
                );
            }
          }
          const message = { courseId };
          const userIdAccessible: string[] = [];
          userIdToAccessibleCourses.forEach((val, key) => {
            if (val[0] === "*" || val.includes(courseId)) userIdAccessible.push(key);
          });
          userIdAccessible.forEach((userId) => {
            if (wsContentArr.get(userId))
              wsContentArr.get(userId).send(
                JSON.stringify({
                  type: "contentIndexLocked",
                  message,
                })
              );
          });
          return;
        }
        if (msg.type === "unlockContent") {
          const contentId = msg.contentId;
          const courseId = msg.courseId;
          const userId = msg.userId;
          if (!contentId || !courseId || !userId) {
            return;
          }
          const contentIndex = (await getContentIndex(courseId)).rows[0];
          if (!contentIndex || (contentIndex.author as string) !== userId) {
            return;
          }
          const message = { courseId, contentId };
          const userIdAccessible: string[] = [];
          userIdToAccessibleCourses.forEach((val, key) => {
            if (val[0] === "*" || val.includes(courseId)) userIdAccessible.push(key);
          });
          userIdAccessible.forEach((userId) => {
            if (wsContentArr.get(userId))
              wsContentArr.get(userId).send(
                JSON.stringify({
                  type: "contentUnlocked",
                  message,
                })
              );
          });
          return;
        }
        if (msg.type === "unlockContentIndex") {
          const _contentId = msg.contentId;
          const courseId = msg.courseId;
          const userId = msg.userId;
          if (!_contentId || !courseId || !userId) {
            return;
          }
          const contentIndex = (await getContentIndex(courseId)).rows[0];
          if (!contentIndex || (contentIndex.author as string) !== userId) {
            return;
          }
          const message = { courseId };
          const userIdAccessible: string[] = [];
          userIdToAccessibleCourses.forEach((val, key) => {
            if (val[0] === "*" || val.includes(courseId)) userIdAccessible.push(key);
          });
          userIdAccessible.forEach((userId) => {
            if (wsContentArr.get(userId))
              wsContentArr.get(userId).send(
                JSON.stringify({
                  type: "contentIndexUnlocked",
                  message,
                })
              );
          });
          return;
        }
        if (msg.type === "heartBeat") {
          const userId = msg.userId;
          if (!userId || !wsContentArrClear.get(userId)) {
            console.error("Hearbeat Error! unknown id!");
            return ws.send(
              JSON.stringify({
                type: "error",
                message: "User ID is empty or User ID not found in connection map!",
              })
            );
          }
          clearTimeout(wsContentArrClear.get(userId));
          wsContentArrClear.set(
            userId,
            setTimeout(
              () => {
                console.error("deleting" + userId);
                const serverContentId = userIdToCourseId.get(userId);
                const message: any = {};
                if (serverContentId) {
                  courseIdToUserId.delete(serverContentId[0]);
                  userIdToCourseId.delete(userId);
                  message[serverContentId[0]] = true;
                  const userIdAccessible: string[] = [];
                  userIdToAccessibleCourses.forEach((val, key) => {
                    if (val[0] === "*" || val.includes(serverContentId[1]))
                      userIdAccessible.push(key);
                  });
                  userIdAccessible.forEach((userId) => {
                    if (wsContentArr.get(userId))
                      wsContentArr.get(userId).send(
                        JSON.stringify({
                          type: "removeUserEditing",
                          message,
                        })
                      );
                  });
                  courseIdToUserId.delete(serverContentId[0]);
                  userIdToCourseId.delete(userId);
                }
                wsContentArr.delete(userId);
                uuidToUserId.delete(ws.id);
                userIdToAccessibleCourses.delete(userId);
                wsContentArrClear.delete(userId);
              },
              5 * 60 * 1000
            )
          );
        }
        if (msg.type === "initCreate") {
          const url = msg.url,
            userId = msg.userId,
            filename = msg.filename;
          if (!url || !userId || !filename) {
            return ws.send(
              JSON.stringify({
                type: "initCreateError",
                message: "Upload Url or userId or filename is empty!",
              })
            );
          }
          uploadUrlMapUserId.set(url, { userId, filename });
          return ws.send(
            JSON.stringify({
              type: "initCreateSuccess",
              message: "OK",
            })
          );
        }
        if (msg.type === "terminate") {
          const userId = msg.userId;
          clearTimeout(wsContentArrClear.get(userId));
          const serverContentId = userIdToCourseId.get(userId);
          const message: any = {};
          if (serverContentId) {
            courseIdToUserId.delete(serverContentId[0]);
            userIdToCourseId.delete(userId);
            message[serverContentId[0]] = true;
            const userIdAccessible: string[] = [];
            userIdToAccessibleCourses.forEach((val, key) => {
              if (val[0] === "*" || val.includes(serverContentId[1])) userIdAccessible.push(key);
            });
            userIdAccessible.forEach((userId) => {
              if (wsContentArr.get(userId))
                wsContentArr.get(userId).send(
                  JSON.stringify({
                    type: "removeUserEditing",
                    message,
                  })
                );
            });

            courseIdToUserId.delete(serverContentId[0]);
            userIdToCourseId.delete(userId);
          }

          wsContentArrClear.delete(userId);
          uuidToUserId.delete(ws.id);
          userIdToAccessibleCourses.delete(userId);
          return wsContentArr.delete(userId);
        }
        if (msg.type === "echo") {
          return ws.send(JSON.stringify(msg));
        }
      } catch (e) {
        console.error(e);
      }
    },
    open(ws) {
      ws.id = Date.now();
    },
    close(ws) {
      const userId = uuidToUserId.get(ws.id);
      if (!userId) return;
      clearTimeout(wsContentArrClear.get(userId));

      const serverContentId = userIdToCourseId.get(userId);
      const message: any = {};
      if (serverContentId) {
        message[serverContentId[0]] = true;
        const userIdAccessible: string[] = [];
        userIdToAccessibleCourses.forEach((val, key) => {
          if (val[0] === "*" || val.includes(serverContentId[1])) userIdAccessible.push(key);
        });
        userIdAccessible.forEach((userId) => {
          if (wsContentArr.get(userId))
            wsContentArr.get(userId).send(
              JSON.stringify({
                type: "removeUserEditing",
                message,
              })
            );
        });

        courseIdToUserId.delete(serverContentId[0]);
        userIdToCourseId.delete(userId);
      }

      wsContentArrClear.delete(userId);
      uuidToUserId.delete(ws.id);
      userIdToAccessibleCourses.delete(userId);
      wsContentArr.delete(userId);
    },
  });
export default app;
