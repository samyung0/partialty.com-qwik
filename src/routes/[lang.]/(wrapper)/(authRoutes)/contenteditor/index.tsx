import type { NoSerialize } from "@builder.io/qwik";
import { $, component$, noSerialize, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { routeLoader$, server$ } from "@builder.io/qwik-city";

import { eq } from "drizzle-orm";
import ContentEditor from "~/components/ContentEditor";
import SideNav from "~/components/ContentEditor/SideNav";
import { BUN_API_ENDPOINT_WS } from "~/const";
import { CLOUDINARY_NAME } from "~/const/cloudinary";
import { useUserLoader } from "~/routes/[lang.]/(wrapper)/(authRoutes)/layout";
import type { CloudinaryPublicPic } from "~/types/Cloudinary";
import type Mux from "~/types/Mux";
import drizzleClient from "~/utils/drizzleClient";
import { content } from "../../../../../../drizzle_turso/schema/content";
import { mux_assets } from "../../../../../../drizzle_turso/schema/mux_assets";

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

export const useContent = routeLoader$(async (requestEvent) => {
  const ret = await drizzleClient().select().from(content);
  return ret;
});

export default component$(() => {
  const user = useUserLoader().value;
  const userAssets = useUserAssets().value;

  const contentWS = useSignal<NoSerialize<WebSocket>>();
  const muxWSHeartBeat = useSignal<any>();

  const closeWS = $(() => {
    console.log("closing content websocket");
    contentWS.value?.send(JSON.stringify({ type: "terminate", userId: user.userId }));
    contentWS.value?.close();
    contentWS.value = undefined;
    clearInterval(muxWSHeartBeat.value);
    return true;
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const ws = new WebSocket(BUN_API_ENDPOINT_WS + "/content/ws");
    ws.addEventListener("open", () => {
      ws.send(
        JSON.stringify({
          type: "init",
          userId: user.userId,
        })
      );
      muxWSHeartBeat.value = setInterval(() => {
        console.log("heartbeat sent");
        ws.send(
          JSON.stringify({
            type: "heartBeat",
            userId: user.userId,
          })
        );
      }, 30 * 1000);
    });

    ws.addEventListener("message", ({ data }) => {
      try {
        const d = JSON.parse(data);
        console.log(d);
        // if (d.type === "open") {
        // }
      } catch (e) {
        console.error(e);
      }
    });

    ws.addEventListener("error", () => {
      console.error("content connection error!");
      contentWS.value = undefined;
      clearInterval(muxWSHeartBeat.value);
    });

    ws.addEventListener("close", () => {
      console.error("content connection closed!");
      contentWS.value = undefined;
      clearInterval(muxWSHeartBeat.value);
    });
    window.addEventListener("onbeforeunload", () => {
      ws.send(JSON.stringify({ type: "terminate", userId: user.userId }));
      ws.close();
      contentWS.value = undefined;
      clearInterval(muxWSHeartBeat.value);
      return true;
    });
    window.addEventListener("onunload", () => {
      ws.send(JSON.stringify({ type: "terminate", userId: user.userId }));
      ws.close();
      contentWS.value = undefined;
      clearInterval(muxWSHeartBeat.value);
      return true;
    });

    contentWS.value = noSerialize(ws);
  });

  const contentEditorValue = useSignal<any>();
  const renderedHTML = useSignal<string>();
  const isEditing = useSignal(false);
  const chapterId = useSignal("");

  const hasChanged = useSignal(false);

  return (
    <main class="relative flex h-[100vh] overflow-hidden bg-background-light-gray">
      <SideNav
        contentEditorValue={contentEditorValue}
        renderedHTML={renderedHTML}
        contentWS={contentWS}
        userId={user.userId}
        userAvatar={user.avatar_url}
        isEditing={isEditing}
        chapterId={chapterId}
      />
      {contentWS.value && (
        <ContentEditor
          isEditing={isEditing.value}
          initialValue={contentEditorValue.value}
          renderedHTML={renderedHTML.value}
          closeWS={closeWS}
          user={user}
          initialUserAssets={userAssets}
          chapterId={chapterId.value}
          hasChanged={hasChanged.value}
          setHasChanged={$(() => (hasChanged.value = true))}
          saveChanges={$(async (contentEditorValue: any, renderedHTML: string) => {
            const ret = (await server$(async () => {
              try {
                return await drizzleClient()
                  .update(content)
                  .set({ content_slate: contentEditorValue, renderedHTML })
                  .returning();
              } catch (e) {
                return [false, e];
              }
            })()) as any[];
            if (ret.length > 0 && ret[0] === false)
              return alert("Save failed! " + ret[1].toString());
            hasChanged.value = false;
          })}
        ></ContentEditor>
      )}
    </main>
  );
});
