import type { Signal } from "@builder.io/qwik";
import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

import Song from "~/assets/audio/landing-page-audio.mp3";
import PauseIcon from "~/assets/svg/pause.svg";
import PlayIcon from "~/assets/svg/play-arrow-rounded.svg";

interface AudioPlayerProps {
  startPlay: Signal<boolean>;
}

export const AudioPlayer = component$(({ startPlay }) => {
  const isPlaying = useSignal<boolean>(false);
  const duration = useSignal<number>();
  const elapsedTime = useSignal<number>(0);
  const jumpTo = useSignal<number>();
  const audioRef = useSignal<HTMLAudioElement | undefined>();

  useVisibleTask$(({ track }) => {
    track(() => isPlaying.value);

    if (isPlaying.value) audioRef.value?.play();
    else audioRef.value?.pause();
  });

  useVisibleTask$(({ track }) => {
    track(() => jumpTo.value);
    console.log(duration.value);
    console.log(jumpTo.value);
    if (jumpTo.value && audioRef.value) audioRef.value.currentTime = jumpTo.value;
  });

  return (
    <div class="border-1 flex w-[60%]  items-center self-center  rounded-xl border-2 border-black p-3 ">
      <button
        onClick$={() => {
          isPlaying.value = !isPlaying.value;
        }}
      >
        <img
          src={!isPlaying.value ? PlayIcon : PauseIcon}
          alt="playIcon"
          width={40}
          height={40}
          class="rounded-full p-1 hover:bg-primary-dark-gray/10 "
        />
      </button>
      <input
        type="range"
        step="any"
        min={0}
        max={duration.value}
        value={elapsedTime.value}
        onInput$={(e) => {
          jumpTo.value = e.target.value;
        }}
        class=" mx-6 h-1 w-96 rounded-lg"
      />

      <audio
        ref={audioRef}
        src={Song}
        onTimeUpdate$={(e) => {
          if (!duration.value) duration.value = e.target.duration;
          elapsedTime.value = e.target.currentTime;
        }}
      />
    </div>
  );
});
