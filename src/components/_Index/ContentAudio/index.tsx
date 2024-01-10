import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

import styles from "./index.module.css";

import CursorIcon from "~/assets/svg/arrow-selector-tool.svg";
import PauseIcon from "~/assets/svg/pause.svg";
import PlayIcon from "~/assets/svg/play-arrow-rounded.svg";
import AudioIcon from "~/assets/svg/speaker-2-fill.svg";

const texts = [
  "React is a JavaScript framework that helps build interactive and",
  "reusable user interfaces. It simplifies UI development by breaking it",
  "down into smaller components that update efficiently.",
];

export default component$(() => {
  const moveCursor = useSignal(false);
  const playButtonClicked = useSignal(false);
  const textTrue = useSignal([false, false, false]);
  const textIndex = useSignal(0);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const loop = () => {
      const scanText = () => {
        if (textIndex.value === texts.length) {
          textIndex.value = 0;
          moveCursor.value = false;
          playButtonClicked.value = false;
          textTrue.value = textTrue.value.map(() => false);
          setTimeout(loop, 1000);
          return;
        }
        textTrue.value = textTrue.value.map((txt, idx) => (idx === textIndex.value ? true : txt));
        textIndex.value = textIndex.value + 1;
        setTimeout(scanText, 3500);
      };

      const delay = (time: number) => {
        return new Promise((res) => setTimeout(res, time));
      };

      moveCursor.value = true;
      delay(1000).then(() => {
        playButtonClicked.value = true;
        scanText();
      });
    };

    loop();
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
            <img
              src={CursorIcon}
              width={20}
              height={20}
              class={`absolute bottom-[125px] right-[200px] ${moveCursor.value && styles.cursor}`}
            />
            <div class="flex h-full w-full flex-col items-center justify-center  rounded-lg border-2 border-black bg-background-light-gray">
              <div class="gap relative flex   h-[70%] w-[80%]   flex-col gap-12">
                <p class="font bold text-3xl font-bold">Welcome to React</p>
                <div class="w-full pb-6">
                  {texts.map((text, idx) => (
                    <div key={idx} class="relative text-xl leading-[2.5em]">
                      <p class="">{text}</p>
                      <p
                        class={`absolute bottom-[0px] ${
                          textTrue.value[idx] && styles.karaoke_text
                        }`}
                      >
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
                <div class="border-1 flex w-[60%]  items-center self-center  rounded-xl border-2 border-black p-4 ">
                  <img
                    src={!playButtonClicked.value ? PlayIcon : PauseIcon}
                    alt="playIcon"
                    width={24}
                    height={24}
                    class="text-black"
                  />
                  <div class="relative -top-[2px] ml-5 mr-7 w-[70%] ">
                    <div class="absolute w-full border-t-4 border-gray-300"></div>
                    <div class={`absolute  ${playButtonClicked.value && styles.play_bar}  `}></div>
                    <div
                      class={`absolute -left-1 -top-[4px] h-[12px] w-[12px] rounded-full bg-lilac ${
                        playButtonClicked.value && styles.play_dot
                      }`}
                    ></div>
                  </div>
                  <img src={AudioIcon} alt="playIcon" width={18} height={18} class="text-black" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
