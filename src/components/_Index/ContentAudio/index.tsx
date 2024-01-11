import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

import { AudioPlayer } from "~/components/audioPlayer/audioPlayer";

const texts = [
  "React is a JavaScript framework that helps build interactive and",
  "reusable user interfaces. It simplifies UI development by breaking it",
  "down into smaller components that update efficiently.",
];

const timeIntervals = [
  { from: 2.7, to: 3.5 },
  { from: 3.6, to: 5 },
  { from: 10, to: 11.136 },
];

export default component$(() => {
  const el;
  const playButtonClicked = useSignal(false);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {});

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
                  <p key="text1" class={"text-xl leading-[2.5rem] tracking-wide"}>
                    <strong>React</strong> is a JavaScript framework that helps build{" "}
                    <span id="highlight-1" class="border-b-8 border-light-yellow">
                      interactive and reusable user interfaces
                    </span>
                    . It simplifies UI development by breaking it down into smaller components that{" "}
                    <span class="highlight-pink">update efficiently</span>.
                  </p>
                </div>
                <AudioPlayer startPlay={playButtonClicked} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
