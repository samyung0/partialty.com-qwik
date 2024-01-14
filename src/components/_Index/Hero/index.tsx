import { component$, useSignal, useStore, useVisibleTask$ } from "@builder.io/qwik";
import type { TypeWriter } from "~/components/_Index/codeAnimation/TypeWriter";
import animateShow from "~/components/_Index/codeAnimation/animateShow";
import displayCodeOrder from "~/components/_Index/codeAnimation/displayCodeOrder";
import rendered from "~/components/_Index/codeBlock/rendered";

import codeBlock from "~/components/_Index/codeBlock";
import blankChar from "~/components/_Index/codeBlock/blankChar";

import styles from "./index.module.css";

export default component$(() => {
  // rendered (syntax highlighted) codes at COMPILE TIME
  // no wasm file shipped to client
  const codeDisplay = useSignal(rendered[`${displayCodeOrder[0]}Rendered`]);

  // requestAnimationFrame calls every 1000/60 = 16.667
  const typeWriter = useStore<TypeWriter>({
    displayIndex: 0, // which code snippet to display
    displayCode: codeBlock[displayCodeOrder[0]], // raw code snippet
    blankCharArr: blankChar[`${displayCodeOrder[0]}BlankChar`], // counts number of lines and number of chars per line
    revealedCharArr: Array(blankChar[`${displayCodeOrder[0]}BlankChar`].length).fill(0), // stores the number of blank chars that are NOT displayed per row, used for rendering
    currentChar: 0, // total displayed char in the current snippet
    currentRow: 0, // corresponds to the revealedCharArr
    totalChar: codeBlock[displayCodeOrder[0]].length, // static sum of the total char of snippet
    instance: null, // timer
    appearStart: 0, // used in requestAnimationFrame
    disappearStart: 0, // used in requestAnimationFrame
    timeAfterLastChar: 0, // used in requestAnimationFrame
    timeAfterAnimationFinished: 0, // used in requestAnimationFrame, records the delay after finishing displaying a whole code snippet
    previousTimeStamp: 0, // used in requestAnimationFrame
    smallestIntervalBetweenCharAppear: 30, // used to calculate the speed of showing the char, the smaller, the faster the speed will eventually get
    largestIntervalBetweenCharAppear: 30, // initial speed
    smallestIntervalBetweenCharDisappear: 15, // used to calculate the speed of hiding the char, the smaller, the faster the speed will eventually get
    largestIntervalBetweenCharDisappear: 60, // initial speed
    appearDurationUntilFullSpeed: 2000,
    disppearDurationUntilFullSpeed: 2000,
    disappearDelay: 2000, // how long the animation pauses until it shows the next snippet
    appearDelay: 2000, // how long the animation pauses until the char disappears
    initialDelay: 0, // initial delay on animation when window loads
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    if (!typeWriter.instance) {
      typeWriter.instance = setTimeout(async () => {
        window.requestAnimationFrame(animateShow.bind(null, typeWriter, codeDisplay, rendered));
      }, typeWriter.initialDelay);
    }
  });
  let blankCharSum = 0,
    currentCharWithoutNewLine = typeWriter.currentChar + 1;
  return (
    <section class="relative h-[100vh] bg-background-light-gray after:absolute after:right-0 after:top-0 after:z-0 after:h-[100%] after:w-[70%] after:bg-sea">
      <div class="relative z-10 flex h-[100vh] justify-center">
        <div class="flex w-[50%] items-center justify-end pr-[6vw]">
          <div class="relative flex h-[400px] w-[600px] items-start justify-stretch overflow-hidden bg-code-editor-one-dark-pro p-8 shadow-2xl">
            <div dangerouslySetInnerHTML={codeDisplay.value}></div>
            <div class="absolute left-0 top-0 flex items-start justify-stretch overflow-hidden p-8 ">
              <pre class="text-lg font-bold leading-8">
                {typeWriter.blankCharArr.map((blankCount, index) => {
                  currentCharWithoutNewLine--;
                  return [
                    <span
                      key={`typeWriterBlankLine${
                        displayCodeOrder[typeWriter.displayIndex]
                      }${index}`}
                    >
                      {Array.from(Array(blankCount)).map((_, index2) => {
                        blankCharSum++;
                        return (
                          <span
                            key={`typeWriterBlankChar${
                              displayCodeOrder[typeWriter.displayIndex]
                            }${index}-${index2}`}
                            class={
                              (typeWriter.revealedCharArr[index] > index2
                                ? "bg-transparent "
                                : "bg-code-editor-one-dark-pro ") +
                              (currentCharWithoutNewLine === blankCharSum
                                ? typeWriter.appearStart === 0
                                  ? styles.blinkingCursorDisappearing
                                  : styles.blinkingCursorAppearing
                                : currentCharWithoutNewLine === -1 && blankCharSum === 1
                                ? styles.blinkingCursorEmptyCode
                                : "")
                            }
                          >
                            &nbsp;
                          </span>
                        );
                      })}
                    </span>,
                    "\n",
                  ];
                })}
              </pre>
            </div>
          </div>
        </div>
        <div class="flex w-[50%] flex-col items-start justify-center ">
          <h1 class="max-w-[600px] pb-16 font-mosk text-[2.5rem] font-[900] leading-[3.5rem]">
            Learn{" "}
            <span class="relative inline-block p-1">
              <span
                class={
                  "-z-1 test absolute left-0 top-[50%] inline-block h-[100%] w-full translate-y-[-50%] bg-light-yellow " +
                  styles.animateInitialText
                }
              ></span>
              <span class="relative z-10">Web Development</span>
            </span>{" "}
            like you have <i>never</i> before.
          </h1>
          <button class="rounded-lg bg-primary-dark-gray px-8 py-4 text-background-light-gray shadow-2xl">
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
});
