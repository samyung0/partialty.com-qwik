import { component$ } from "@builder.io/qwik";
import QwikProse from "~/components/Prose/qwik-prose";
import { QwikAudioTrack } from "~/components/Prose/react-syncAudio";

export default component$(
  ({
    innerHTML,
    audioTrack,
  }: {
    innerHTML: string | undefined;
    audioTrack: {
      id: string;
      duration: number;
      filename: string;
      playback_ids: { id: string }[];
    };
  }) => (
    <div class="flex h-full w-[80vw] flex-col overflow-auto">
      <QwikProse innerHTML={innerHTML || ""} />
      <QwikAudioTrack audioTrack={audioTrack} />
    </div>
  )
);
