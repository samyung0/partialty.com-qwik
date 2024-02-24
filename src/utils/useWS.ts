import type { NoSerialize, QRL } from "@builder.io/qwik";
import { $, noSerialize, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { BUN_API_ENDPOINT_WS, BUN_API_ENDPOINT_WS_DEV } from "~/const";
import type { LuciaSession } from "~/types/LuciaSession";

const useWS = (
  user: LuciaSession["user"],
  on?: {
    onOpen$?: QRL<(ws: WebSocket, userTimeStamp: string) => any>;
    onMessage$?: QRL<(ws: WebSocket, userTimeStamp: string, data: any) => any>;
  }
) => {
  const { onOpen$, onMessage$ } = on || {};

  const contentWS = useSignal<NoSerialize<WebSocket> | undefined>();
  const timeStamp = useSignal<string>("");
  const muxWSHeartBeat = useSignal<any>();
  const isClosingPage = useSignal(false);
  const retryCleared = useSignal(false);
  const failedCount = useSignal(0);
  const currentTimeout = useSignal(0);
  const exponentialFallback = useSignal([1, 5, 10]);
  const isConnecting = useSignal(false);

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
        muxWSHeartBeat.value = setInterval(() => {
          console.log("heartbeat sent");
          ws.send(
            JSON.stringify({
              type: "heartBeat",
              userId: user.userId + "###" + timeStamp.value,
            })
          );
        }, 30 * 1000);

        onOpen$?.(ws, user.userId + "###" + timeStamp.value);

        contentWS.value = noSerialize(ws);
        failedCount.value = 0;
        currentTimeout.value = 0;
        isConnecting.value = false;
      });

      ws.addEventListener("message", ({ data }) => {
        onMessage$?.(ws, user.userId + "###" + timeStamp.value, data);
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

  return contentWS;
};

export default useWS;
