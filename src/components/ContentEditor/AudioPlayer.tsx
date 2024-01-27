/** @jsxImportSource react */

import { server$ } from "@builder.io/qwik-city";
import MuxPlayer from "@mux/mux-player-react";
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
  setAudioTrack,
}: {
  ws: WebSocket;
  userId: string;
  setShowAudioChooser: React.Dispatch<React.SetStateAction<boolean>>;
  userAudiosWithName: [Mux["data"][0], string][];
  setAudioTrack: React.Dispatch<
    React.SetStateAction<
      | {
          id: string;
          duration: number;
          filename: string;
        }
      | undefined
    >
  >;
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle");
  const [newAudio, setNewAudio] = useState<
    [{ id: string; duration: number; created_at: string }, string][]
  >([]);
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
          upload.on("success", async (details) => {
            console.log("Wrap it up, we're done here. 👋");
          });
          setIsUploading(true);
          setStatus("Uploading...");
          return;
        }
        if (d.type === "assetSuccess") {
          console.log("asset uploaded");
          setStatus("Uploaded. Preparing...");
        }
        if (d.type === "assetReady") {
          const filename = d.message.filename as string;
          const duration = d.message.duration as number;
          const id = d.message.id as string;
          const created_at = d.message.created_at as string;
          !filename || !duration || !id || !created_at;
          if (!filename || !duration || !id || !created_at) {
            setStatus("Errored");
            setTimeout(() => {
              setIsUploading(false);
            }, 1000);
            return;
          }
          console.log("asset ready");
          setStatus("Finished");
          setTimeout(() => {
            setIsUploading(false);
            setNewAudio([[{ id, duration, created_at }, filename], ...newAudio]);
          }, 1000);
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
        {(newAudio.length > 0 || userAudiosWithName.length > 0) && (
          <ul className="flex max-h-[500px] w-full flex-col gap-2 overflow-auto pr-2">
            {newAudio.map(([audioTrack, name]) => (
              <li
                onClick={() => {
                  setAudioTrack({
                    id: audioTrack.id,
                    filename: name,
                    duration: audioTrack.duration,
                  });
                  setShowAudioChooser(false);
                }}
                key={`AudioChooser${audioTrack.id}`}
                className="flex cursor-pointer justify-between rounded-xl border-2 border-primary-dark-gray bg-background-light-gray px-6 py-3"
              >
                <div className="flex cursor-pointer flex-col items-start justify-center">
                  <h3 className="text-lg tracking-wide">{name}</h3>
                  <p className="text-xs tracking-wide text-gray-400">
                    {new Date(Number(audioTrack.created_at) * 1000).toDateString()}
                  </p>
                </div>
                <p className="flex items-center gap-1">
                  {Math.floor(audioTrack.duration / 60)}:
                  {Math.floor(audioTrack.duration % 60)
                    .toString()
                    .padStart(2, "0")}
                </p>
              </li>
            ))}
            {userAudiosWithName.map(([audioTrack, name]) => (
              <li
                onClick={() => {
                  setAudioTrack({
                    id: audioTrack.id,
                    filename: name,
                    duration: audioTrack.duration,
                  });
                  setShowAudioChooser(false);
                }}
                key={`AudioChooser${audioTrack.id}`}
                className="flex cursor-pointer justify-between rounded-xl border-2 border-primary-dark-gray bg-background-light-gray px-6 py-3"
              >
                <div className="flex cursor-pointer flex-col items-start justify-center">
                  <h3 className="text-lg tracking-wide">{name}</h3>
                  <p className="text-xs tracking-wide text-gray-400">
                    {new Date(Number(audioTrack.created_at) * 1000).toDateString()}
                  </p>
                </div>
                <p className="flex items-center gap-1">
                  {Math.floor(audioTrack.duration / 60)}:
                  {Math.floor(audioTrack.duration % 60)
                    .toString()
                    .padStart(2, "0")}
                </p>
              </li>
            ))}
          </ul>
        )}
        <div className="flex w-full items-center justify-center pt-8">
          {!isUploading ? (
            <label htmlFor="uploadImage">
              <p className="cursor-pointer text-lg underline decoration-wavy underline-offset-8">
                {userAudiosWithName.length === 0 && newAudio.length === 0
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
              <div className="mb-1 ml-[10%] text-base font-medium">{status}</div>
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

export default ({
  audioTrack,
  setShowAudioChooser,
  setAudioTrack,
}: {
  audioTrack: { id: string; duration: number; filename: string } | undefined;
  setShowAudioChooser: React.Dispatch<React.SetStateAction<boolean>>;
  setAudioTrack: React.Dispatch<
    React.SetStateAction<
      | {
          id: string;
          duration: number;
          filename: string;
        }
      | undefined
    >
  >;
}) => {
  const [timeStamp, setTimeStamp] = useState(0);
  return (
    <div className="absolute bottom-0 left-0 z-50 grid h-[10vh] w-full grid-cols-1 border-t border-sea bg-light-sea px-8">
      {audioTrack ? (
        <>
          <MuxPlayer
            className="hidden"
            streamType="on-demand"
            playbackId="Ej4WvGO6jIW2AuYFMjKv82l8HxEieUfRpBfM7Ezek48"
            crossOrigin="*"
            autoPlay
          />
          <div className="mx-auto flex w-[80%] items-center">
            <div className="w-full">
              <div className="mx-auto mb-1 flex items-center justify-between">
                <p className="block w-[300px] overflow-auto truncate text-base tracking-wide ">
                  {audioTrack.filename}
                </p>
                <button
                  data-tooltip-target="tooltip-pause"
                  type="button"
                  className="group mx-2 inline-flex items-center justify-center rounded-full bg-sea p-2.5 font-medium focus:outline-none"
                >
                  <Play color="white" size={20} className="translate-x-[2px]" />
                </button>
                <div className="w-[300px]"></div>
              </div>
              <div className="flex items-center justify-between space-x-2 rtl:space-x-reverse">
                <span className="text-sm font-medium text-primary-dark-gray dark:text-gray-400">
                  {Math.floor(timeStamp / 60)}:
                  {Math.floor(timeStamp % 60)
                    .toString()
                    .padStart(2, "0")}
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
                    max={audioTrack.duration}
                    style={{
                      background: `linear-gradient(90deg,rgb(114,202,218) ${
                        (timeStamp / audioTrack.duration) * 100
                      }%,rgb(229,231,235) ${(timeStamp / audioTrack.duration) * 100}%)`,
                    }}
                    className={`m-0 h-1.5 w-full cursor-pointer appearance-none rounded-full
               bg-background-light-gray p-0 accent-sea`}
                  />
                </label>
                <span className="text-sm font-medium text-primary-dark-gray dark:text-gray-400">
                  {Math.floor(audioTrack.duration / 60)}:
                  {Math.floor(audioTrack.duration % 60)
                    .toString()
                    .padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
          <button
            className="absolute right-8 top-[50%] -translate-y-[50%] rounded-md bg-tomato p-2"
            onClick={() => {
              setAudioTrack(undefined);
            }}
          >
            <Trash2 className="text-background-light-gray" size={20} />
          </button>
        </>
      ) : (
        <div className="flex items-center justify-center">
          <button
            onClick={() => setShowAudioChooser(true)}
            className="rounded-lg bg-sea px-6 py-3 text-background-light-gray shadow-lg"
          >
            Choose Audio File
          </button>
        </div>
      )}
    </div>
  );
};
