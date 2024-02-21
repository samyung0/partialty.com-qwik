import type { NoSerialize, QRL } from "@builder.io/qwik";
import { $, component$, noSerialize, useSignal, useStore, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { and, eq, not, or } from "drizzle-orm";

import Creator from "~/components/_Creator";
import { BUN_API_ENDPOINT_WS, BUN_API_ENDPOINT_WS_DEV } from "~/const";
import { useUserLoader } from "~/routes/[lang.]/(wrapper)/(authRoutes)/layout";
import drizzleClient from "~/utils/drizzleClient";
import { content_category } from "../../../../../../drizzle_turso/schema/content_category";
import type { ContentIndex } from "../../../../../../drizzle_turso/schema/content_index";
import { content_index } from "../../../../../../drizzle_turso/schema/content_index";
import type { Profiles } from "../../../../../../drizzle_turso/schema/profiles";
import { profiles } from "../../../../../../drizzle_turso/schema/profiles";
import { tag } from "../../../../../../drizzle_turso/schema/tag";

export const useAccessibleCourseWrite = routeLoader$(async (event) => {
  const userVal = await event.resolveValue(useUserLoader);
  if (userVal.role === "admin") return ["*"];
  let courses: string[];
  try {
    courses = JSON.parse(userVal.accessible_courses || "[]");
  } catch (e) {
    console.error(e);
    courses = [];
  }
  return courses;
});

export const useAccessibleCourseWriteResolved = routeLoader$(async (event) => {
  const accessibleCourseWrite = await event.resolveValue(useAccessibleCourseWrite);
  if (accessibleCourseWrite.length === 0) return [];
  let courses: { content_index: ContentIndex; profiles: Profiles }[] = [];
  if (accessibleCourseWrite.length === 1 && accessibleCourseWrite[0] === "*") {
    courses = await drizzleClient()
      .select()
      .from(content_index)
      .where(not(eq(content_index.is_deleted, true)))
      .innerJoin(profiles, eq(profiles.id, content_index.author));
  } else
    courses = await drizzleClient()
      .select()
      .from(content_index)
      .where(
        and(
          or(...accessibleCourseWrite.map((id) => eq(content_index.id, id))),
          not(eq(content_index.is_deleted, true))
        )
      )
      .innerJoin(profiles, eq(profiles.id, content_index.author));
  return courses;
});

export const useTags = routeLoader$(async () => {
  return await drizzleClient().select().from(tag);
});

export const useCategories = routeLoader$(async () => {
  return await drizzleClient().select().from(content_category);
});

export default component$(() => {
  const user = useUserLoader().value;
  const userAccessibleCourseWrite = useAccessibleCourseWrite().value;
  const userAccessibleCourseWriteResolved = useAccessibleCourseWriteResolved().value;
  const tags = useTags().value;
  const catgories = useCategories().value;

  const contentWS = useSignal<NoSerialize<WebSocket> | undefined>();
  const timeStamp = useSignal<string>("");
  const muxWSHeartBeat = useSignal<any>();
  const isClosingPage = useSignal(false);
  const retryCleared = useSignal(false);
  const failedCount = useSignal(0);
  const currentTimeout = useSignal(0);
  const exponentialFallback = useSignal([1, 5, 10]);
  const isConnecting = useSignal(false);

  const courseIdToEditingUser = useStore<Record<string, [string, string]>>({});

  const _startWSConnection: { startWSConnection: QRL<() => any>; fn: QRL<(retry: any) => any> } = {
    startWSConnection: $(() => {}),
    fn: $((retry: any) => {}),
  };
  _startWSConnection.fn = $((retry: any) => {
    if (isConnecting.value) return;
    if (
      failedCount.value > 0 &&
      currentTimeout.value < exponentialFallback.value[failedCount.value - 1]
    ) {
      currentTimeout.value++;
      return;
    }
    try {
      console.log("Starting Websocket connection");
      isConnecting.value = true;
      timeStamp.value = Date.now() + "";
      const ws = new WebSocket(
        (import.meta.env.MODE === "production" ? BUN_API_ENDPOINT_WS : BUN_API_ENDPOINT_WS_DEV) +
          "/content/ws"
      );
      ws.addEventListener("open", () => {
        clearInterval(retry);
        retryCleared.value = true;
        ws.send(
          JSON.stringify({
            type: "init",
            userId: user.userId + "###" + timeStamp.value,
            accessible_courses: userAccessibleCourseWrite,
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

        contentWS.value = noSerialize(ws);
        failedCount.value = 0;
        currentTimeout.value = 0;
        isConnecting.value = false;
      });
      ws.addEventListener("message", ({ data }) => {
        try {
          const d = JSON.parse(data);
          console.log(d);
          if (d.type === "initUserEditing") {
            for (const i in courseIdToEditingUser) delete courseIdToEditingUser[i];
            for (const i in d.message) courseIdToEditingUser[i] = d.message[i];
            return;
          }
          if (d.type === "addUserEditing") {
            for (const i in d.message) courseIdToEditingUser[i] = d.message[i];
            return;
          }
          if (d.type === "removeUserEditing") {
            for (const i in d.message) delete courseIdToEditingUser[i];
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
        // error event fires with close event
        contentWS.value = undefined;
        clearInterval(muxWSHeartBeat.value);

        failedCount.value++;
        currentTimeout.value = 0;
        isConnecting.value = false;

        if (failedCount.value > exponentialFallback.value.length) {
          alert("Failed to connect to server! Please try again later or contact support.");
          clearInterval(retry);
          return;
        } else
          alert(
            "Websocket connection error! Retrying connection in " +
              exponentialFallback.value[failedCount.value - 1] +
              " second(s)..."
          );
      });

      ws.addEventListener("close", () => {
        contentWS.value = undefined;
        clearInterval(muxWSHeartBeat.value);
        if (isClosingPage.value) {
          return console.log("Websocket connection closed!");
        }
        console.error("Websocket connection closed!");

        if (retryCleared.value) {
          _startWSConnection.startWSConnection();
          retryCleared.value = false;
        }
      });
    } catch (e) {
      console.error(e);
      console.log("retrying connection...");
    }
  });
  _startWSConnection.startWSConnection = $(() => {
    const retry = setInterval((): any => {
      _startWSConnection.fn(retry);
    }, 1000);
    _startWSConnection.fn(retry);
  });
  const startWSConnection = _startWSConnection.startWSConnection;
  const closeWSConnection = $(() => {
    console.log("closing content websocket");
    isClosingPage.value = true;
    if (contentWS.value) {
      contentWS.value.send(
        JSON.stringify({ type: "terminate", userId: user.userId + "###" + timeStamp.value })
      );
      contentWS.value.close();
    }
    contentWS.value = undefined;
    clearInterval(muxWSHeartBeat.value);
  });

  useVisibleTask$(async () => {
    if (contentWS.value) {
      closeWSConnection();
      contentWS.value = undefined;
    }
    startWSConnection();
    return () => {
      closeWSConnection();
    };
  });

  return (
    <main>
      <Creator
        ws={contentWS}
        userAccessibleCourseWrite={userAccessibleCourseWrite}
        userAccessibleCourseWriteResolved={userAccessibleCourseWriteResolved}
        tags={tags}
        categories={catgories}
        courseIdToEditingUser={courseIdToEditingUser}
      />
    </main>
  );
});

export const head: DocumentHead = {
  title: "Creator",
  meta: [
    {
      name: "description",
      content: "A page to manage all the courses and projects created by you.",
    },
  ],
};
