import { component$, useSignal, useStore, useVisibleTask$ } from "@builder.io/qwik";
import type { TypeWriter } from "~/components/_Index/codeAnimation/TypeWriter";
import animateShow from "~/components/_Index/codeAnimation/animateShow";
import displayCodeOrder from "~/components/_Index/codeAnimation/displayCodeOrder";
import rendered from "~/components/_Index/codeBlock/rendered";

import codeBlock from "~/components/_Index/codeBlock";
import blankChar from "~/components/_Index/codeBlock/blankChar";

export default component$(() => {
  const codeDisplay = useSignal(rendered[`${displayCodeOrder[0]}Rendered`]);

  // requestAnimationFrame calls every 1000/60 = 16.667
  const typeWriter = useStore<TypeWriter>({
    displayIndex: 0,
    displayCode: codeBlock[displayCodeOrder[0]],
    blankCharArr: blankChar[`${displayCodeOrder[0]}BlankChar`],
    revealedCharArr: Array(blankChar[`${displayCodeOrder[0]}BlankChar`].length).fill(0),
    currentChar: 0,
    currentRow: 0,
    totalChar: codeBlock[displayCodeOrder[0]].length,
    instance: null,
    appearStart: 0,
    disappearStart: 0,
    timeAfterLastChar: 0,
    timeAfterAnimationFinished: 0,
    previousTimeStamp: 0,
    smallestIntervalBetweenCharAppear: 30,
    largestIntervalBetweenCharAppear: 30,
    smallestIntervalBetweenCharDisappear: 15,
    largestIntervalBetweenCharDisappear: 60,
    appearDurationUntilFullSpeed: 2000,
    disppearDurationUntilFullSpeed: 2000,
    disappearDelay: 1000,
    appearDelay: 300,
    initialDelay: 300,
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    if (!typeWriter.instance) {
      typeWriter.instance = setTimeout(async () => {
        window.requestAnimationFrame(animateShow.bind(null, typeWriter, codeDisplay, rendered));
      }, typeWriter.initialDelay);
    }
  });
  return (
    <section class="relative h-[100vh] bg-background-light-gray after:absolute after:right-0 after:top-0 after:z-0 after:h-[100%] after:w-[70%] after:bg-sea">
      <div class="relative z-10 flex h-[100vh] justify-center">
        <div class="flex flex-1 items-center justify-end">
          <div class="relative flex h-[400px] w-[600px] items-start justify-stretch overflow-hidden bg-code-editor-one-dark-pro p-8 shadow-2xl">
            <div dangerouslySetInnerHTML={codeDisplay.value}></div>
            <div class="absolute left-0 top-0 flex items-start justify-stretch overflow-hidden p-8 ">
              <pre class="text-lg font-bold leading-8">
                {typeWriter.blankCharArr.map((blankCount, index) => [
                  <span
                    key={`typeWriterBlankLine${displayCodeOrder[typeWriter.displayIndex]}${index}`}
                  >
                    {Array.from(Array(blankCount)).map((_, index2) => (
                      <span
                        key={`typeWriterBlankChar${
                          displayCodeOrder[typeWriter.displayIndex]
                        }${index}-${index2}`}
                        class={
                          typeWriter.revealedCharArr[index] > index2
                            ? "bg-transparent"
                            : "bg-code-editor-one-dark-pro"
                        }
                      >
                        &nbsp;
                      </span>
                    ))}
                  </span>,
                  "\n",
                ])}
              </pre>
            </div>
          </div>
        </div>
        <div class="flex flex-1 flex-col items-start justify-center pl-[8vw] ">
          <h1 class="max-w-[500px] pb-16 font-mosk text-[2.5rem] font-[900] leading-[3rem]">
            Learn Web Development like you have <i>never </i>before.
          </h1>
          <button class="rounded-lg bg-primary-dark-gray px-8 py-4 text-background-light-gray">
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
});
