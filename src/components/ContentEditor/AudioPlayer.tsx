/** @jsxImportSource react */

import { server$ } from "@builder.io/qwik-city";
import MuxPlayer from "@mux/mux-player-react";
import * as UpChunk from "@mux/upchunk";
import { Pause, Play, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MUX_AUDIO_MAX_SIZE } from "~/const/mux";

import type Mux from "~/types/Mux";

export const CenterAudioChooser = ({
  timeStamp,
  contentWS,
  userId,
  setShowAudioChooser,
  userAudiosWithName,
  setAudioTrack,
}: {
  timeStamp: string;
  contentWS: WebSocket;
  userId: string;
  setShowAudioChooser: React.Dispatch<React.SetStateAction<boolean>>;
  userAudiosWithName: [Mux["data"][0], string][];
  setAudioTrack: (
    props:
      | {
          id: string;
          duration: number;
          filename: string;
          playback_ids: { id: string }[];
        }
      | undefined
  ) => any;
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle");
  const [newAudio, setNewAudio] = useState<
    [{ id: string; duration: number; created_at: string; playback_ids: { id: string }[] }, string][]
  >([]);
  const fileRef = useRef<File>();
  const urlRef = useRef<string>();

  useEffect(() => {
    contentWS.addEventListener("message", ({ data }) => {
      try {
        const d = JSON.parse(data);
        if (d.type === "error") return alert("WS ERROR: " + d.message);
        if (d.type === "initCreateSuccess") {
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
          const playbackId = d.message.playbackId as string;
          console.log(filename, duration, id, created_at, playbackId);
          if (!filename || !duration || !id || !created_at || !playbackId) {
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
            setNewAudio([
              [{ id, duration, created_at, playback_ids: [{ id: playbackId }] }, filename],
              ...newAudio,
            ]);
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
        {userAudiosWithName.length === 0 && newAudio.length === 0 && (
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
                    playback_ids: [{ id: audioTrack.playback_ids[0].id }],
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
                    playback_ids: [{ id: audioTrack.playback_ids[0].id }],
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

                  contentWS.send(
                    JSON.stringify({
                      type: "initCreate",
                      url,
                      userId: userId + "###" + timeStamp,
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
  audioTimeStamp,
  isLoadingAudio,
}: {
  audioTrack:
    | { id: string; duration: number; filename: string; playback_ids: { id: string }[] }
    | undefined;
  setShowAudioChooser: React.Dispatch<React.SetStateAction<boolean>>;
  setAudioTrack: (
    props:
      | {
          id: string;
          duration: number;
          filename: string;
          playback_ids: { id: string }[];
        }
      | undefined
  ) => any;
  audioTimeStamp: React.MutableRefObject<number>;
  isLoadingAudio: boolean;
}) => {
  const [timeStamp, setTimeStamp] = useState(0);
  const [paused, setPaused] = useState(true);
  const muxRef = useRef<any>();
  return (
    <div className="absolute bottom-0 left-0 z-50 grid h-[10vh] w-full grid-cols-1 border-t-2 border-sea bg-light-sea px-8">
      <MuxPlayer
        ref={muxRef}
        className="hidden"
        streamType="on-demand"
        playbackId={audioTrack && audioTrack.playback_ids[0].id}
        // crossOrigin="*"
        paused={paused}
        onTimeUpdate={(e) => {
          if (!e.target) return;
          setTimeStamp((e.target as HTMLVideoElement).currentTime);
          audioTimeStamp.current = (e.target as HTMLVideoElement).currentTime;
        }}
      />
      {!isLoadingAudio ? (
        audioTrack ? (
          <>
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
                    onClick={() => setPaused(!paused)}
                  >
                    {paused ? (
                      <Play color="white" size={20} className="translate-x-[2px]" />
                    ) : (
                      <Pause color="white" size={20} />
                    )}
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
                        audioTimeStamp.current = Number(e.target.value);
                        if (muxRef.current) muxRef.current.currentTime = e.target.value;
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
        )
      ) : (
        <div className="flex items-center justify-center">
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
        </div>
      )}
    </div>
  );
};
