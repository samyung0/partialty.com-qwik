/** @jsxImportSource react */

import { qwikify$ } from "@builder.io/qwik-react";
import MuxPlayer from "@mux/mux-player-react";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const audioTrack = ({
  audioTrack,
}: {
  audioTrack:
    | { id: string; duration: number; filename: string; playback_ids: { id: string }[] }
    | undefined;
}) => {
  const dataSync = useRef<NodeListOf<Element> | undefined>();
  const [timeStamp, setTimeStamp] = useState(0);
  const [paused, setPaused] = useState(true);
  const muxRef = useRef<any>();
  const sync = () => {
    console.log("syncing");
    if (!dataSync.current) return;
    for (let i = 0; i < dataSync.current.length; i++) {
      const timeStampToActivate =
        Number(dataSync.current[i].getAttribute("data-synctimestamp")) || 0;
      if (timeStamp >= timeStampToActivate) {
        if (dataSync.current[i].getAttribute("data-syncactivated") === "1") continue;
        let enter: any = {};
        try {
          enter = JSON.parse(dataSync.current[i].getAttribute("data-syncenter") || "{}");
        } catch (_) {
          /* empty */
        }
        for (const j in enter) (dataSync.current[i] as HTMLElement).style[j as any] = enter[j];
        dataSync.current[i].setAttribute("data-syncactivated", "1");
      } else {
        if (dataSync.current[i].getAttribute("data-syncactivated") !== "1") continue;
        let enter: any = {};
        let leave: any = {};
        try {
          enter = JSON.parse(dataSync.current[i].getAttribute("data-syncenter") || "{}");
          leave = JSON.parse(dataSync.current[i].getAttribute("data-syncleave") || "{}");
        } catch (_) {
          /* empty */
        }
        for (const j in enter) delete (dataSync.current[i] as HTMLElement).style[j as any];
        for (const j in leave) (dataSync.current![i] as HTMLElement).style[j as any] = leave[j];
        dataSync.current[i].setAttribute("data-syncactivated", "0");
      }
    }
  };
  useEffect(() => {
    dataSync.current = document.querySelectorAll("#sectionProse [data-sync='1']");
    sync();
  }, []);
  return (
    audioTrack && (
      <div className="mt-auto grid h-[10vh] w-full grid-cols-1 bg-background-light-gray px-8 shadow shadow-slate-200/80 ring-1 ring-slate-900/5 backdrop-blur-sm">
        <MuxPlayer
          ref={muxRef}
          className="hidden"
          streamType="on-demand"
          playbackId={audioTrack.playback_ids[0].id}
          paused={paused}
          onTimeUpdate={(e) => {
            if (!e.target) return;
            setTimeStamp((e.target as HTMLVideoElement).currentTime);
            sync();
          }}
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
                className="group mx-2 inline-flex items-center justify-center rounded-full bg-primary-dark-gray p-2.5 font-medium focus:outline-none"
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
                    if (muxRef.current) muxRef.current.currentTime = e.target.value;
                    sync();
                  }}
                  min="0"
                  max={audioTrack.duration}
                  style={{
                    background: `linear-gradient(90deg,#1f2937 ${
                      (timeStamp / audioTrack.duration) * 100
                    }%,rgb(229,231,235) ${(timeStamp / audioTrack.duration) * 100}%)`,
                  }}
                  className={`m-0 h-1.5 w-full cursor-pointer appearance-none rounded-full
           bg-background-light-gray p-0 accent-primary-dark-gray`}
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
      </div>
    )
  );
};

export default audioTrack;
export const QwikAudioTrack = qwikify$(audioTrack, { eagerness: "load" });
