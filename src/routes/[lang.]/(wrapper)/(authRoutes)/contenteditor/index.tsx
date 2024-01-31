import type { NoSerialize, QRL } from "@builder.io/qwik";
import { $, component$, noSerialize, useSignal, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { routeLoader$, server$ } from "@builder.io/qwik-city";

import { eq, or } from "drizzle-orm";
import ContentEditor from "~/components/ContentEditor";
import SideNav from "~/components/ContentEditor/SideNav";
import { BUN_API_ENDPOINT_WS } from "~/const";
import { CLOUDINARY_NAME } from "~/const/cloudinary";
import { useUserLoader } from "~/routes/[lang.]/(wrapper)/(authRoutes)/layout";
import type { CloudinaryPublicPic } from "~/types/Cloudinary";
import type Mux from "~/types/Mux";
import drizzleClient from "~/utils/drizzleClient";
import type { Content } from "../../../../../../drizzle_turso/schema/content";
import { content } from "../../../../../../drizzle_turso/schema/content";
import type { ContentIndex } from "../../../../../../drizzle_turso/schema/content_index";
import { content_index } from "../../../../../../drizzle_turso/schema/content_index";
import { mux_assets } from "../../../../../../drizzle_turso/schema/mux_assets";
import { profiles } from "../../../../../../drizzle_turso/schema/profiles";

export const useUserAssets = routeLoader$(async (requestEvent) => {
  const ret: {
    cloudinaryImages: CloudinaryPublicPic[];
    muxAudiosWithNames: [Mux["data"][0], string][];
  } = { cloudinaryImages: [], muxAudiosWithNames: [] };
  const user = await requestEvent.resolveValue(useUserLoader);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/resources/search`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(
        requestEvent.env.get("CLOUDINARY_API_KEY")! +
          ":" +
          requestEvent.env.get("CLOUDINARY_API_SECRET")!
      )}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      expression: `folder:public/${user.userId}/*`,
      max_results: 999999,
    }),
  })
    .then((res) => res.json())
    .catch((e) => console.error(e));
  const userMuxAssets = await drizzleClient()
    .select()
    .from(mux_assets)
    .where(eq(mux_assets.user_id, user.userId));
  const _muxAudios = await Promise.allSettled(
    userMuxAssets.map(
      (asset) =>
        fetch("https://api.mux.com/video/v1/assets/" + asset.id, {
          method: "GET",
          headers: {
            Authorization: `Basic ${btoa(
              requestEvent.env.get("MUX_PRODUCTION_ID")! +
                ":" +
                requestEvent.env.get("MUX_PRODUCTION_SECRET")!
            )}`,
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .catch((e) => console.error(e)) as Promise<{ data: Mux["data"][0] }>
    )
  );
  const muxAudios = _muxAudios.filter(
    (res) => res.status === "fulfilled" && res.value.data.resolution_tier === "audio-only"
  ) as PromiseFulfilledResult<{ data: Mux["data"][0] }>[];
  const muxAudiosWithNames = muxAudios.map((audioFile) => [
    audioFile.value.data,
    userMuxAssets.find((asset) => asset.id === audioFile.value.data.id)!.name,
  ]) as [Mux["data"][0], string][];
  muxAudiosWithNames.sort((a, b) => Number(b[0].created_at) - Number(a[0].created_at));
  ret.muxAudiosWithNames = muxAudiosWithNames;

  if (!res || !res.resources) return ret;
  ret.cloudinaryImages = res.resources;

  return ret;
});

export const useContent = routeLoader$<[ContentIndex[], Content[]]>(async (requestEvent) => {
  const user = await requestEvent.resolveValue(useUserLoader);
  const accessible_courses =
    (
      await drizzleClient()
        .select({ accessible_courses: profiles.accessible_courses })
        .from(profiles)
        .where(eq(profiles.id, user.userId))
    )[0].accessible_courses || [];
  const contentCourses =
    accessible_courses.length > 0
      ? await drizzleClient()
          .select()
          .from(content_index)
          .where(or(...accessible_courses.map((id) => eq(content_index.id, id))))
      : [];
  const contentChapters =
    contentCourses.length > 0
      ? await drizzleClient()
          .select()
          .from(content)
          .where(
            or(
              ...contentCourses
                .map((course) => course.chapter_order.map((chapterId) => eq(content.id, chapterId)))
                .flat()
            )
          )
      : [];
  return [contentCourses, contentChapters];
});

export default component$(() => {
  const user = useUserLoader().value;
  const userAssets = useUserAssets().value;

  const contentWS = useSignal<NoSerialize<WebSocket> | undefined>();
  const timeStamp = useSignal<string>("");
  const muxWSHeartBeat = useSignal<any>();

  const startWSConnection = $(() => {
    timeStamp.value = Date.now() + "";
    const ws = new WebSocket(BUN_API_ENDPOINT_WS + "/content/ws");
    ws.addEventListener("open", () => {
      ws.send(
        JSON.stringify({
          type: "init",
          userId: user.userId + "###" + timeStamp.value,
        })
      );
      muxWSHeartBeat.value = setInterval(() => {
        console.log("heartbeat sent");
        ws.send(
          JSON.stringify({
            type: "heartBeat",
            userId: user.userId + "###" + timeStamp.value,
          })
        );
      }, 30 * 1000);
    });

    ws.addEventListener("message", ({ data }) => {
      try {
        const d = JSON.parse(data);
        console.log(d);
        if (d.type === "addUserEditing") {
          for (const i of d.message) courseIdToEditingUser[i] = d.message[i];
          return;
        }
        if (d.type === "removeUserEditing") {
          for (const i of d.message) delete courseIdToEditingUser[i];
          return;
        }
        if (d.type === "openContentSuccess") {
          if (!isRequestingChapterCallback.value) return;
          isRequestingChapterCallback.value();
          isRequestingChapterCallback.value = undefined;
          clearTimeout(isRequestingChapterTimeout.value);
          return;
        }
        if (d.type === "openContentError") {
          alert(d.message);
          isRequestingChapter.value = false;
          isRequestingChapterCallback.value = undefined;
          clearTimeout(isRequestingChapterTimeout.value);
          return;
        }
        if (d.type === "error") {
          alert(d.message);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    });

    ws.addEventListener("error", () => {
      alert("Webcoket connection error! Retrying connection...");
      contentWS.value = undefined;
      clearInterval(muxWSHeartBeat.value);

      startWSConnection();
    });

    ws.addEventListener("close", () => {
      console.error("content connection closed!");
      contentWS.value = undefined;
      clearInterval(muxWSHeartBeat.value);
    });

    contentWS.value = noSerialize(ws);
  });

  const closeWSConnection = $(() => {
    console.log("closing content websocket");
    if (contentWS.value) {
      contentWS.value.send(
        JSON.stringify({ type: "terminate", userId: user.userId + "###" + timeStamp })
      );
      contentWS.value.close();
    }
    contentWS.value = undefined;
    clearInterval(muxWSHeartBeat.value);
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    await closeWSConnection(); // preload and cache the function

    await startWSConnection();
    window.addEventListener("onbeforeunload", () => {
      closeWSConnection();
      return true;
    });
    window.addEventListener("onunload", () => {
      closeWSConnection();
      return true;
    });
  });

  const courseIdToEditingUser = useStore<Record<string, { userId: string; avatar_url: string }>>(
    {}
  );
  const contentEditorValue = useSignal<any>();
  const renderedHTML = useSignal<string>();
  const isEditing = useSignal(false);
  const chapterId = useSignal("");
  const audioAssetId = useSignal<string | undefined>(undefined);
  const hasChanged = useSignal(false);
  const isRequestingChapter = useSignal(false);
  const isRequestingChapterCallback = useSignal<QRL<() => any> | undefined>(undefined);
  const isRequestingChapterTimeout = useSignal<any>();

  const fetchAudio = $(
    async (id: string) =>
      await server$(async function (id: string) {
        const audio = (await fetch("https://api.mux.com/video/v1/assets/" + id, {
          method: "GET",
          headers: {
            Authorization: `Basic ${btoa(
              this.env.get("MUX_PRODUCTION_ID")! + ":" + this.env.get("MUX_PRODUCTION_SECRET")!
            )}`,
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .catch((e) => console.error(e))) as any;
        const filename = (
          await drizzleClient()
            .select({ filename: mux_assets.name })
            .from(mux_assets)
            .where(eq(mux_assets.id, id))
        )[0].filename;
        audio.filename = filename;
        return audio as {
          data: Mux["data"][0];
          filename: string;
        };
      })(id)
  );

  return (
    <main class="relative flex h-[100vh] overflow-hidden bg-background-light-gray">
      <SideNav
        timeStamp={timeStamp}
        isRequestingChapter={isRequestingChapter}
        isRequestingChapterCallback={isRequestingChapterCallback}
        isRequestingChapterTimeout={isRequestingChapterTimeout}
        courseIdToEditingUser={courseIdToEditingUser}
        contentEditorValue={contentEditorValue}
        renderedHTML={renderedHTML}
        contentWS={contentWS}
        userId={user.userId}
        isEditing={isEditing}
        chapterId={chapterId}
        audioAssetId={audioAssetId}
        userRole={user.role}
        avatar_url={user.avatar_url}
      />
      {contentWS.value && (
        <ContentEditor
          timeStamp={timeStamp.value}
          isEditing={isEditing.value}
          initialValue={contentEditorValue.value}
          renderedHTML={renderedHTML.value}
          contentWS={contentWS.value}
          user={user}
          initialUserAssets={userAssets}
          chapterId={chapterId.value}
          hasChanged={hasChanged.value}
          audioAssetId={audioAssetId.value}
          setHasChanged={$(() => (hasChanged.value = true))}
          fetchAudio={fetchAudio}
          saveChanges={$(
            async (
              contentEditorValue: string,
              renderedHTML: string,
              audio_track_playback_id: string | undefined,
              audio_track_asset_id: string | undefined
            ) => {
              const ret = (await server$(async () => {
                try {
                  const contentVal: any = {
                    content_slate: contentEditorValue,
                    renderedHTML,
                  };
                  contentVal["audio_track_playback_id"] = audio_track_playback_id || null;
                  contentVal["audio_track_asset_id"] = audio_track_asset_id || null;
                  return await drizzleClient()
                    .update(content)
                    .set(contentVal)
                    .where(eq(content.id, chapterId.value))
                    .returning();
                } catch (e) {
                  return [false, e];
                }
              })()) as any[];
              if (ret.length > 0 && ret[0] === false) {
                alert("Save failed! " + ret[1].toString());
                return "";
              }
              hasChanged.value = false;
              return "";
            }
          )}
        ></ContentEditor>
      )}
    </main>
  );
});
