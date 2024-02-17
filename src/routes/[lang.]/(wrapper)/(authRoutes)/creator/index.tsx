import {
  $,
  NoSerialize,
  QRL,
  component$,
  noSerialize,
  useComputed$,
  useSignal,
  useStore,
  useVisibleTask$,
} from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { main } from "bun";
import { BUN_API_ENDPOINT_WS } from "~/const";
import { useUserLoader } from "~/routes/[lang.]/(wrapper)/(authRoutes)/layout";

export default component$(() => {
  const user = useUserLoader().value;
  const userAccessibleCourseWrite = useComputed$(() => {
    let courses: string[];
    try {
      courses = JSON.parse(user.accessible_courses || "[]");
    } catch (e) {
      courses = [];
    }
    return courses;
  });
  const contentWS = useSignal<NoSerialize<WebSocket> | undefined>();
  const timeStamp = useSignal<string>("");
  const muxWSHeartBeat = useSignal<any>();
  const isClosingPage = useSignal(false);

  const courseIdToEditingUser = useStore<Record<string, [string, string]>>({});

  const isDeletingChapter = useSignal("");
  const isDeletingChapterCallback = useSignal<QRL<() => any> | undefined>(undefined);
  const isDeletingChapterTimeout = useSignal<any>();

  const _startWSConnection: { startWSConnection: QRL<() => any>; fn: QRL<(retry: any) => any> } = {
    startWSConnection: $(() => {}),
    fn: $((retry: any) => {}),
  };
  _startWSConnection.fn = $((retry: any) => {
    try {
      console.log("Starting Websocket connection");
      timeStamp.value = Date.now() + "";
      const ws = new WebSocket(BUN_API_ENDPOINT_WS + "/content/ws");
      ws.addEventListener("open", () => {
        clearInterval(retry);
        ws.send(
          JSON.stringify({
            type: "init",
            userId: user.userId + "###" + timeStamp.value,
            accessible_courses: userAccessibleCourseWrite.value,
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
          if (d.type === "deleteContentSuccess") {
            if (!isDeletingChapterCallback.value) return;
            isDeletingChapterCallback.value();
            isDeletingChapterCallback.value = undefined;
            clearTimeout(isDeletingChapterTimeout.value);
            return;
          }
          if (d.type === "deleteContentError") {
            alert(d.message);
            isDeletingChapter.value = "";
            isDeletingChapterCallback.value = undefined;
            clearTimeout(isDeletingChapterTimeout.value);
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
        alert("Websocket connection error! Retrying connection...");
      });

      ws.addEventListener("close", () => {
        clearInterval(retry);
        contentWS.value = undefined;
        clearInterval(muxWSHeartBeat.value);
        if (isClosingPage.value) {
          return console.log("Websocket connection closed!");
        }
        console.error("Websocket connection closed!");

        _startWSConnection.startWSConnection();
      });

      contentWS.value = noSerialize(ws);
    } catch (e) {
      console.error(e);
      console.log("retrying connection in 10 seconds...");
    }
  });
  _startWSConnection.startWSConnection = $(() => {
    const retry = setInterval((): any => {
      _startWSConnection.fn(retry);
    }, 10 * 1000);
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
    startWSConnection();
    window.onbeforeunload = () => {
      closeWSConnection();
      return true;
    };
    window.onunload = () => {
      closeWSConnection();
      return true;
    };
  });

  return <main>
    
  </main>;
});

export const head: DocumentHead = {
  title: "Creator",
  meta: [
    {
      name: "description",
      content: "A page to manage all the courses created by you.",
    },
  ],
};
