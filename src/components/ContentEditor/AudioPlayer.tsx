/** @jsxImportSource react */

import { server$ } from "@builder.io/qwik-city";
import * as UpChunk from "@mux/upchunk";
import { Play, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { MUX_AUDIO_MAX_SIZE } from "~/const/mux";
import type Mux from "~/types/Mux";

export const CenterAudioChooser = ({
  ws,
  userId,
  setShowAudioChooser,
  userAudiosWithName,
}: {
  ws: WebSocket;
  userId: string;
  setShowAudioChooser: React.Dispatch<React.SetStateAction<boolean>>;
  userAudiosWithName: [Mux["data"][0], string][];
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef<File>();
  const urlRef = useRef<string>();

  useEffect(() => {
    ws.addEventListener("message", ({ data }) => {
      try {
        const d = JSON.parse(data);
        if (d.type === "error") return alert("WS ERROR: " + d.message);
        if (d.type === "createSuccess") {
          if (!urlRef.current || !fileRef.current) return;
          const upload = UpChunk.createUpload({
            endpoint: urlRef.current,
            file: fileRef.current,
            chunkSize: 5120,
          });
          urlRef.current = undefined;
          fileRef.current = undefined;
          console.log(upload);
          upload.on("error", (err) => {
            console.error("💥 🙀", err.detail);
          });
          upload.on("progress", (progress) => {
            console.log("Uploaded", progress.detail, "percent of this file.");
          });
          // subscribe to events
          upload.on("success", async (details) => {
            console.log("Wrap it up, we're done here. 👋");
          });
          return;
        }
        if (d.type === "assetSuccess") {
          console.log("asset ready");
        }
      } catch (_) {
        /* empty */
      }
    });
  }, []);

  return (
    <div className="fixed left-0 top-0 z-[999] flex h-[100vh] w-[100vw] items-center justify-center backdrop-blur-sm">
      <div className="relative flex w-[80vw] flex-col items-center justify-center rounded-lg border-2 border-primary-dark-gray bg-light-mint p-8">
        <h2 className="pb-8 font-mosk text-[2rem] font-bold tracking-wider">Select Audio</h2>
        <button onClick={() => setShowAudioChooser(false)} className="absolute right-8 top-8 p-2">
          <X size={20} />
        </button>
        {userAudiosWithName.length === 0 && (
          <div className="text-lg tracking-wide">
            Uh Oh. It seems like you haven't uploaded any audio tracks yet.
          </div>
        )}
        <div className="pt-8">
          <label htmlFor="uploadImage">
            {!isUploading ? (
              <p className="cursor-pointer text-lg underline decoration-wavy underline-offset-8">
                {userAudiosWithName.length === 0
                  ? "start by uploading an audio track"
                  : "or upload a new audio track"}
              </p>
            ) : (
              <span>
                <svg
                  aria-hidden="true"
                  className="inline-block h-4 w-4 animate-spin fill-background-light-gray text-primary-dark-gray"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </span>
            )}
            <input
              onChange={async (e) => {
                if (!e.target.files || e.target.files.length === 0) return;
                const file = e.target.files[0];
                fileRef.current = file;

                if (file.size > MUX_AUDIO_MAX_SIZE) {
                  alert("Audio file cannot be larger than 100 MiB!");
                  return;
                }

                const _url = await server$(async function () {
                  return await fetch("https://api.mux.com/video/v1/uploads/", {
                    method: "POST",
                    headers: {
                      Authorization: `Basic ${btoa(
                        this.env.get("MUX_PRODUCTION_ID")! +
                          ":" +
                          this.env.get("MUX_PRODUCTION_SECRET")!
                      )}`,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      cors_origin: "*",
                      new_asset_settings: {
                        playback_policy: ["public"],
                        mp4_support: "none",
                      },
                    }),
                  })
                    .then((res) => res.json())
                    .catch((e) => console.error(e));
                })();

                const url = _url.data.url as string;
                if (!url) {
                  alert("Cannot upload audio file to Mux!");
                  return;
                }

                urlRef.current = url;

                ws.send(
                  JSON.stringify({
                    type: "initCreate",
                    url,
                    userId,
                  })
                );
              }}
              type="file"
              className="hidden"
              id="uploadImage"
              accept="audio/*"
            ></input>
          </label>
        </div>
      </div>
    </div>
  );
};

export default () => {
  const duration = 189; // seconds
  const [timeStamp, setTimeStamp] = useState(0);
  const [hasAudio, setHasAudio] = useState(false);
  return (
    <div className="absolute bottom-0 left-0 z-50 grid h-[10vh] w-full grid-cols-1 border-t border-sea bg-light-sea px-8">
      {hasAudio ? (
        <>
          <div className="mx-auto flex w-[70%] items-center">
            <div className="w-full">
              <div className="mx-auto mb-1 flex items-center justify-center">
                <button
                  data-tooltip-target="tooltip-pause"
                  type="button"
                  className="group mx-2 inline-flex items-center justify-center rounded-full bg-sea p-2.5 font-medium focus:outline-none"
                >
                  <Play color="white" size={20} className="translate-x-[2px]" />
                </button>
              </div>
              <div className="flex items-center justify-between space-x-2 rtl:space-x-reverse">
                <span className="text-sm font-medium text-primary-dark-gray dark:text-gray-400">
                  {Math.floor(timeStamp / 60)}:{(timeStamp % 60).toString().padStart(2, "0")}
                </span>
                <label
                  htmlFor="audioRange"
                  className="relative flex w-full items-center justify-center"
                >
                  <input
                    id="audioRange"
                    type="range"
                    value={timeStamp}
                    onChange={(e) => {
                      setTimeStamp(Number(e.target.value));
                    }}
                    min="0"
                    max={duration}
                    style={{
                      background: `linear-gradient(90deg,rgb(114,202,218) ${
                        (timeStamp / duration) * 100
                      }%,rgb(229,231,235) ${(timeStamp / duration) * 100}%)`,
                    }}
                    className={`m-0 h-1.5 w-full cursor-pointer appearance-none rounded-full
               bg-background-light-gray p-0 accent-sea`}
                  />
                </label>
                {/* <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-800">
            <div className="h-1.5 rounded-full bg-sea" style={{ width: "65%" }}></div>
          </div> */}
                <span className="text-sm font-medium text-primary-dark-gray dark:text-gray-400">
                  {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
          <button className="absolute right-8 top-[50%] -translate-y-[50%] rounded-md bg-tomato p-2">
            <Trash2 className="text-background-light-gray" size={20} />
          </button>
        </>
      ) : (
        <div className="flex items-center justify-center">
          <button className="rounded-lg bg-lilac px-6 py-3 text-background-light-gray shadow-lg">
            Choose Audio File
          </button>
        </div>
      )}
    </div>
  );
};
