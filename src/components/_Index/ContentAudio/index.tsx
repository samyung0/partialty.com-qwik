import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

import { AudioPlayer } from "~/components/audioPlayer/audioPlayer";

import styles from "./index.module.css";

export default component$(() => {
  const playButtonClicked = useSignal(false);
  const elapsedTime = useSignal<number>(0); // length of the audio bar
  const instantTime = useSignal([
    { from: 2.7, highlight: false },
    { from: 3.3, highlight: false },
    { from: 9.8, highlight: false },
  ]);

  // eslint-disable-next-line qwik/no-use-visible-task

  useVisibleTask$(({ track }) => {
    track(() => elapsedTime.value);

    instantTime.value = instantTime.value.map((instant) =>
      elapsedTime.value >= instant.from
        ? { ...instant, highlight: true }
        : { ...instant, highlight: false }
    );
    console.log(elapsedTime.value);
    console.log(instantTime.value);
  });

  return (
    <section class="h-[100vh] bg-pink">
      <div class="flex h-[100vh] flex-col items-center justify-center">
        <div class="flex h-[40%] items-center justify-center">
          <h1 class="text-center font-mosk text-[2.5rem] font-[900] leading-[3.5rem]">
            Audio-word highlighting to synchronize audio playback <br /> with corresponding text
          </h1>
        </div>
        <div class=" relative flex h-[60%] items-start">
          <div class="relative h-[500px] w-[900px] ">
            {/* <img
              src={CursorIcon}
              width={20}
              height={20}
              class={`absolute bottom-[125px] right-[200px] ${moveCursor.value && styles.cursor}`}
            /> */}
            <div class="flex h-full w-full flex-col items-center justify-center  rounded-lg border-2 border-black bg-background-light-gray">
              <div class="gap relative flex   h-[70%] w-[80%]   flex-col gap-12">
                <p class="font bold text-3xl font-bold">Welcome to React</p>
                <div class="w-full pb-6">
                  <div class={"text-xl leading-[2.5rem] tracking-wide"}>
                    <p key="row-1">
                      <strong>React</strong> is a JavaScript framework that helps build{" "}
                      <span
                        data-text="interactive and"
                        class={`${instantTime.value[0].highlight && styles.highlight_word}`}
                      >
                        interactive and
                      </span>
                    </p>
                    <p key="row-2">
                      <span
                        data-text="reusable user interfaces"
                        class={`${instantTime.value[1].highlight && styles.highlight_word}`}
                      >
                        reusable user interfaces
                      </span>
                      . It simplifies UI development by breaking it
                    </p>
                    <p key="row-3">
                      down into smaller components that{" "}
                      <span
                        data-text=".update efficiently"
                        class={` ${instantTime.value[2].highlight && styles.highlight_word_2}`}
                      >
                        update efficiently.
                      </span>
                    </p>
                  </div>
                </div>
                <AudioPlayer startPlay={playButtonClicked} elapsedTime={elapsedTime} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
