/** @jsxImportSource react */
import { qwikify$ } from "@builder.io/qwik-react";
import MuxPlayer from "@mux/mux-player-react";
import { useRef } from "react";
export const MuxAudio = ({
  id,
  paused,
  setTimeStamp,
  sync,
  currentTime,
  playbackRate,
  muted,
}: {
  id: string;
  paused: boolean;
  setTimeStamp: (t: number) => any;
  sync: () => any;
  currentTime: number;
  playbackRate: number;
  muted: boolean;
}) => {
  const interval = useRef<any>();
  return (
    <MuxPlayer
      className="hidden"
      streamType="on-demand"
      playbackId={id}
      paused={paused}
      currentTime={currentTime}
      playbackRate={playbackRate}
      muted={muted}
      onTimeUpdate={(e) => {
        if (!e.target) return;
        setTimeStamp((e.target as HTMLVideoElement).currentTime);
        console.log("hello");
        sync();
      }}
    />
  );
};

export const QwikMuxAudio = qwikify$(MuxAudio, { eagerness: "load" });
