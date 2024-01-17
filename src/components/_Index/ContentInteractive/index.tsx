import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

import displayCodeOrderInteractive from "../codeAnimation/displayCodeOrderInteractive";
import blankChar from "../codeBlock/blankChar";
import rendered from "../codeBlock/rendered";

import TypeScriptIcon from "~/assets/svg/typescript.svg";

import styles from "./index.module.css";

const codeSnippets = [
  <div key="snippet-1" class="flex h-[100%] w-full">
    <div class="w-[30%] bg-white" />
    <div class="flex w-[70%] items-center bg-yellow">
      <p class="m-8 text-[1.5em]">Let's learn web development</p>
    </div>
  </div>,
  <div key="snippet-2" class="flex h-[100%] w-full">
    <div class="w-[30%] bg-white" />
    <div class="flex w-[70%] items-center bg-red-400">
      <p class="m-8 text-[1.5em]">Let's learn web development</p>
    </div>
  </div>,
  <div key="snippet-3" class="flex h-[100%] w-full">
    <div class="w-[30%] bg-white" />
    <div class="flex w-[70%] items-center bg-red-400">
      <p class="m-8 text-[2.5em]">Let's learn web development</p>
    </div>
  </div>,
  <div key="snippet-4" class="flex h-[100%] w-full">
    <div class="w-[30%] bg-white" />
    <div class="flex w-[70%] items-center bg-red-400">
      <p class="m-8 text-[1.5em]">Let's learn web development</p>
    </div>
  </div>,
];

const replaceStringArr = [
  { from: "bg-yellow-400", to: "bg-red-400", row: 4, pos: 56 },
  { from: "text-[1.5em]", to: "text-[2.5em]", row: 5, pos: 33 },
  { from: "text-[2.5em]", to: "text-[1.5em]", row: 5, pos: 33 },
  { from: "bg-red-400", to: "bg-yellow-400", row: 4, pos: 53 },
];

export default component$(() => {
  const codeDisplay = useSignal(rendered[`${displayCodeOrderInteractive[1]}Rendered`]);
  const replaceStringIdx = useSignal(0);
  const codeOutputIdx = useSignal(0);

  const blankCharArr = useSignal(blankChar["reactCode2BlankChar"]);
  const cursorRow = useSignal(replaceStringArr[0].row);
  const cursorPos = useSignal(replaceStringArr[0].pos);

  useVisibleTask$(() => {
    let stringToRemove = replaceStringArr[replaceStringIdx.value].from;
    let stringToAdd = replaceStringArr[replaceStringIdx.value].to;
    let stringStartIdx = codeDisplay.value.indexOf(stringToRemove);

    let replaceStringRange = Array(2)
      .fill(0)
      .map((_, idx) =>
        idx === 0
          ? [stringStartIdx, stringStartIdx + stringToRemove.length - 1]
          : [stringStartIdx, stringStartIdx + stringToAdd.length - 1]
      );

    let countDown = replaceStringArr[replaceStringIdx.value].from.length - 1;
    let startRemoveIdx = replaceStringRange[0][1];

    const showChar = () => {
      codeDisplay.value =
        codeDisplay.value.substring(0, startRemoveIdx) +
        stringToAdd[stringToAdd.length - countDown - 1] +
        codeDisplay.value.substring(startRemoveIdx, codeDisplay.value.length);
      cursorPos.value += 1;

      if (countDown === 0) {
        replaceStringIdx.value = (replaceStringIdx.value + 1) % replaceStringArr.length;
        stringToRemove = replaceStringArr[replaceStringIdx.value].from;
        stringToAdd = replaceStringArr[replaceStringIdx.value].to;
        stringStartIdx = codeDisplay.value.indexOf(stringToRemove);

        replaceStringRange = Array(2)
          .fill(0)
          .map((_, idx) =>
            idx === 0
              ? [stringStartIdx, stringStartIdx + stringToRemove.length - 1]
              : [stringStartIdx, stringStartIdx + stringToAdd.length - 1]
          );

        countDown = replaceStringArr[replaceStringIdx.value].from.length - 1;
        startRemoveIdx = replaceStringRange[0][1];

        cursorRow.value = replaceStringArr[replaceStringIdx.value].row;
        cursorPos.value = replaceStringArr[replaceStringIdx.value].pos;

        setTimeout(hideChar, 1000);
        codeOutputIdx.value = (codeOutputIdx.value + 1) % codeSnippets.length;
        return;
      }
      countDown -= 1;
      startRemoveIdx += 1;

      setTimeout(showChar, 30);
    };

    const hideChar = () => {
      codeDisplay.value =
        codeDisplay.value.substring(0, startRemoveIdx) +
        codeDisplay.value.substring(startRemoveIdx + 1, codeDisplay.value.length);
      cursorPos.value -= 1;

      if (countDown === 0) {
        countDown = stringToAdd.length - 1;

        setTimeout(showChar, 1000);
        return;
      }
      countDown -= 1;
      startRemoveIdx -= 1;

      setTimeout(hideChar, 30);
    };
    setTimeout(hideChar, 1000);
  });

  return (
    <section class="h-[100vh] bg-mint">
      <div class="flex h-[100vh] flex-col items-center justify-center overflow-hidden">
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
                    {blankCharArr.value.map((blankCount, row) => [
                      <span key={`blankline-${row}`}>
                        {Array.from(Array(blankCount)).map((char, charIdx) => (
                          <span
                            key={`blankline-${row}-char-${charIdx}`}
                            class={
                              row === cursorRow.value &&
                              charIdx === cursorPos.value &&
                              styles.blinkingCursorEmptyCode
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
          </div>
          <div class="h-[500px] w-[800px] overflow-hidden rounded-lg border-2 border-black bg-background-light-gray">
            {codeSnippets[codeOutputIdx.value]}
          </div>
        </div>
      </div>
    </section>
  );
});
