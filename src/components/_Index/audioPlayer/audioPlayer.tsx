import type { Signal } from "@builder.io/qwik";
import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

import Song from "~/assets/audio/landing-page-audio.mp3";
import PauseIcon from "~/assets/svg/pause.svg";
import PlayIcon from "~/assets/svg/play-arrow-rounded.svg";

interface AudioPlayerProps {
  startPlay: Signal<boolean>;
  elapsedTime: Signal<number>;
}

export const AudioPlayer = component$<AudioPlayerProps>(({ startPlay, elapsedTime }) => {
  const isPlaying = useSignal<boolean>(false);
  const duration = useSignal<number>();

  const playerTime = useSignal<number>(0); // updated time the audio is playing
  const jumpTo = useSignal<number>();
  const audioRef = useSignal<HTMLAudioElement | undefined>();

  useVisibleTask$(({ track }) => {
    track(() => isPlaying.value);

    if (isPlaying.value) audioRef.value?.play();
    else audioRef.value?.pause();
  });

  useVisibleTask$(({ track }) => {
    track(() => jumpTo.value);

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
        onInput$={(e: Event, currentTarget: HTMLInputElement) => {
          jumpTo.value = Number(currentTarget.value);
        }}
        class=" mx-6 h-1 w-96 rounded-lg"
      />

      <audio
        ref={audioRef}
        src={Song}
        onTimeUpdate$={(e: Event, currentTarget: HTMLAudioElement) => {
          if (!duration.value) duration.value = currentTarget.duration;
          elapsedTime.value = currentTarget.currentTime;
        }}
      />
    </div>
  );
});
