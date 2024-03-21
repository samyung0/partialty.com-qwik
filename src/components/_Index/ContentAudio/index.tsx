import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

import { AudioPlayer } from "~/components/_Index/audioPlayer/audioPlayer";

export default component$(() => {
  const playButtonClicked = useSignal(false);
  const elapsedTime = useSignal<number>(0); // length of the audio bar
  const instantTime = useSignal([
    { from: 2.7, highlight: false },
    { from: 3.3, highlight: false },
    { from: 9.8, highlight: false },
  ]);

  useVisibleTask$(({ track }) => {
    track(() => elapsedTime.value);

    instantTime.value = instantTime.value.map((instant) =>
      elapsedTime.value >= instant.from
        ? { ...instant, highlight: true }
        : { ...instant, highlight: false }
    );
  });

  return (
    <section class="min-h-[100vh] bg-pink py-8">
      <div class="flex min-h-[100vh]  flex-col items-center justify-center gap-12">
        <div class="flex  items-center justify-center">
          <h1 class="p-2 text-center font-mosk text-2xl font-[900] md:text-3xl lg:text-[2rem] lg:leading-[3rem] xl:text-[2.5rem] xl:leading-[3.5rem]">
            We have audio-guided courses which highlight content
            <br />
            according to the audio
          </h1>
        </div>
        <div class=" relative flex  items-start">
          <div class="relative max-w-[95vw] md:w-[500px] lg:w-[900px]">
            {/* <img
              src={CursorIcon}
              width={20}
              height={20}
              class={`absolute bottom-[125px] right-[200px] ${moveCursor.value && styles.cursor}`}
            /> */}
            <div class="flex h-full w-full flex-col items-center justify-center  rounded-lg border-2 border-black bg-background-light-gray py-5 md:py-7 lg:py-14">
              <div class="gap relative flex   w-[90%] flex-col gap-3 md:gap-6  lg:h-[70%] lg:w-[80%] lg:gap-12">
                <p class="font bold text-lg font-bold md:text-xl lg:text-3xl">Welcome to React</p>
                <div class="w-full">
                  <div
                    class={
                      "text-sm leading-[1.5rem] md:text-lg lg:text-xl lg:leading-[2.5rem] lg:first-letter:tracking-wide"
                    }
                  >
                    <span key="row-1">
                      <strong>React</strong> is a JavaScript framework that helps build{" "}
                      <span
                        // data-text="interactive and"
                        // class={`${instantTime.value[0].highlight && styles.highlight_word}`}
                        class="relative whitespace-nowrap"
                      >
                        <span
                          class={`${
                            instantTime.value[0].highlight && "highlight-underline"
                          } absolute z-10 w-full whitespace-nowrap border-b-4 border-background-light-gray bg-background-light-gray`}
                        >
                          interactive and
                        </span>
                        <span class="relative whitespace-nowrap border-b-4 border-bright-yellow lg:border-b-8">
                          interactive and
                        </span>
                      </span>
                    </span>{" "}
                    <span key="row-2">
                      <span class="relative whitespace-nowrap">
                        <span
                          class={`${
                            instantTime.value[1].highlight && "highlight-underline"
                          } absolute z-10 w-full whitespace-nowrap border-b-4 border-background-light-gray bg-background-light-gray`}
                        >
                          reusable user interfaces.&lrm;
                        </span>
                        <span class="relative  whitespace-nowrap border-b-4 border-mint lg:border-b-8">
                          reusable user interfaces.
                        </span>
                      </span>{" "}
                      It simplifies UI development by breaking it
                    </span>{" "}
                    <span key="row-3">
                      down into smaller components that{" "}
                      <span class="relative whitespace-nowrap">
                        <span
                          class={`${
                            instantTime.value[2].highlight && "highlight-underline"
                          } absolute z-10 w-full whitespace-nowrap  bg-background-light-gray`}
                        >
                          update efficiently.&lrm;
                        </span>
                        <span class="highlight-pink-audio relative whitespace-nowrap ">
                          update efficiently.
                        </span>
                      </span>
                    </span>
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
