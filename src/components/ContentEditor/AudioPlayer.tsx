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
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<File>();
  const urlRef = useRef<string>();

  useEffect(() => {
    ws.addEventListener("message", ({ data }) => {
      console.log(data);
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
          upload.on("error", (err) => {
            console.error("💥 🙀", err.detail);
          });
          upload.on("progress", (progress) => {
            setProgress(progress.detail as number);
            console.log("Uploaded", progress.detail, "percent of this file.");
          });
          // subscribe to events
          upload.on("success", async (details) => {
            console.log("Wrap it up, we're done here. 👋");
          });
          setIsUploading(true);
          return;
        }
        if (d.type === "assetSuccess") {
          console.log("asset uploaded");
        }
        if (d.type === "assetReady") {
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
        <div className="flex w-full items-center justify-center pt-8">
          {!isUploading ? (
            <label htmlFor="uploadImage">
              <p className="cursor-pointer text-lg underline decoration-wavy underline-offset-8">
                {userAudiosWithName.length === 0
                  ? "start by uploading an audio track"
                  : "or upload a new audio track"}
              </p>
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
                      filename: file.name,
                    })
                  );
                }}
                type="file"
                className="hidden"
                id="uploadImage"
                accept="audio/*"
              ></input>
            </label>
          ) : (
            <div className="flex flex-1 flex-col">
              <div className="mb-1 ml-[10%] text-base font-medium">Uploading...</div>
              <div className="mx-auto mb-4 h-1.5 w-[80%] rounded-full bg-gray-200">
                <div className="h-1.5 rounded-full bg-sea" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}
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
