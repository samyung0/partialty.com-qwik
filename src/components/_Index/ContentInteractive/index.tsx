import { component$, useSignal, useStore, useVisibleTask$ } from "@builder.io/qwik";

import type { TypeWriter } from "../codeAnimation/TypeWriter";
import animateShow from "../codeAnimation/animateShow";
import displayCodeOrderInteractive from "../codeAnimation/displayCodeOrderInteractive";
import codeBlock from "../codeBlock";
import blankChar from "../codeBlock/blankChar";
import rendered from "../codeBlock/rendered";

import TypeScriptIcon from "~/assets/svg/typescript.svg";

import styles from "./index.module.css";

const codeSnippets = [
  <div key="snippet-1"></div>,
  <div key="snippet-2" class="p-1">
    <h1>Welcome to my app</h1>
  </div>,
  <div key="snippet-3" class="flex h-[100%] w-full">
    <div class="w-[30%] bg-white"></div>
    <div class="flex w-[70%] items-center bg-yellow ">
      <p class="m-8 text-[1.5em] font-bold">Let's learn web development</p>
    </div>
  </div>,
];

export default component$(() => {
  const codeDisplay = useSignal(rendered[`${displayCodeOrderInteractive[0]}Rendered`]);

  const typeWriter = useStore<TypeWriter>({
    displayIndex: 0, // which code snippet to display
    displayCodeOrder: displayCodeOrderInteractive,
    displayCode: codeBlock[displayCodeOrderInteractive[0]], // raw code snippet
    codeOutputIndex: 0,
    blankCharArr: blankChar[`${displayCodeOrderInteractive[0]}BlankChar`], // counts number of lines and number of chars per line
    revealedCharArr: Array(blankChar[`${displayCodeOrderInteractive[0]}BlankChar`].length).fill(0), // stores the number of blank chars that are NOT displayed per row, used for rendering
    currentChar: 0, // total displayed char in the current snippet
    currentRow: 0, // corresponds to the revealedCharArr
    rollbackTo: 49, //
    totalChar: codeBlock[displayCodeOrderInteractive[0]].length, // static sum of the total char of snippet
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
    disappearDelay: 1000, // how long the animation pauses until it shows the next snippet
    appearDelay: 1000, // how long the animation pauses until the char disappears
    initialDelay: 0, // initial delay on animation when window loads
  });

  useVisibleTask$(() => {
    if (!typeWriter.instance) {
      typeWriter.instance = setTimeout(() =>
        window.requestAnimationFrame(animateShow.bind(null, typeWriter, codeDisplay, rendered))
      );
    }
  });

  let blankCharSum = 0,
    currentCharWithoutNewLine = typeWriter.currentChar + 1;

  return (
    <section class="h-[100vh] bg-mint">
      <div class="flex h-[100vh] flex-col items-center justify-center">
        <div class="flex h-[40%] items-center justify-center">
          <h1 class="text-center font-mosk text-[2.5rem] font-[900] leading-[3.5rem]">
            Enhance your learning experience with the help of the
            <br />
            built-in interactive code playground.
          </h1>
        </div>
        <div class="relative flex h-[60%] items-start justify-between gap-[8em]">
          <div class=" flex h-[500px] w-[650px] overflow-hidden rounded-xl bg-code-editor-one-dark-pro">
            <div class=" flex flex-col gap-2 bg-primary-dark-gray px-2 pt-2">
              <div class="h-[15px] w-[15px] rounded-full bg-red-500"></div>
              <div class="h-[15px] w-[15px] rounded-full bg-yellow"></div>
              <div class="h-[15px] w-[15px] rounded-full bg-green-600"></div>
            </div>
            <div class="flex flex-col">
              <div class="flex items-start gap-1 p-2">
                <img src={TypeScriptIcon} alt="typescript-icon" width={14} height={14} />
                <p class="text-xs text-background-light-gray">file.tsx</p>
              </div>
              <div class="relative flex h-full w-full items-start justify-stretch overflow-hidden bg-code-editor-one-dark-pro p-8 ">
                <div dangerouslySetInnerHTML={codeDisplay.value}></div>
                <div class="absolute left-0 top-0 flex items-start justify-stretch overflow-hidden p-8 ">
                  <pre class="text-lg font-bold leading-8">
                    {typeWriter.blankCharArr.map((blankCount, index) => {
                      currentCharWithoutNewLine--;
                      return [
                        <span
                          key={`typeWriterBlankLine${
                            displayCodeOrderInteractive[typeWriter.displayIndex]
                          }${index}`}
                        >
                          {Array.from(Array(blankCount)).map((_, index2) => {
                            blankCharSum++;
                            return (
                              <span
                                key={`typeWriterBlankChar${
                                  displayCodeOrderInteractive[typeWriter.displayIndex]
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
          </div>
          <div class="h-[500px] w-[800px] overflow-hidden rounded-lg border-2 border-black bg-background-light-gray">
            {codeSnippets[typeWriter.codeOutputIndex]}
          </div>
        </div>
      </div>
    </section>
  );
});
