import { component$ } from "@builder.io/qwik";

import TypeScriptIcon from "~/assets/svg/typescript.svg";

export default component$(() => {
  // const typeWriter = useStore<TypeWriter>({
  //   displayIndex: 0, // which code snippet to display
  //   displayCode: codeBlock[displayCodeOrder[0]], // raw code snippet
  //   blankCharArr: blankChar[`${displayCodeOrder[0]}BlankChar`], // counts number of lines and number of chars per line
  //   revealedCharArr: Array(blankChar[`${displayCodeOrder[0]}BlankChar`].length).fill(0), // stores the number of blank chars that are NOT displayed per row, used for rendering
  //   currentChar: 0, // total displayed char in the current snippet
  //   currentRow: 0, // corresponds to the revealedCharArr
  //   totalChar: codeBlock[displayCodeOrder[0]].length, // static sum of the total char of snippet
  //   instance: null, // timer
  //   appearStart: 0, // used in requestAnimationFrame
  //   disappearStart: 0, // used in requestAnimationFrame
  //   timeAfterLastChar: 0, // used in requestAnimationFrame
  //   timeAfterAnimationFinished: 0, // used in requestAnimationFrame, records the delay after finishing displaying a whole code snippet
  //   previousTimeStamp: 0, // used in requestAnimationFrame
  //   smallestIntervalBetweenCharAppear: 30, // used to calculate the speed of showing the char, the smaller, the faster the speed will eventually get
  //   largestIntervalBetweenCharAppear: 30, // initial speed
  //   smallestIntervalBetweenCharDisappear: 15, // used to calculate the speed of hiding the char, the smaller, the faster the speed will eventually get
  //   largestIntervalBetweenCharDisappear: 60, // initial speed
  //   appearDurationUntilFullSpeed: 2000,
  //   disppearDurationUntilFullSpeed: 2000,
  //   disappearDelay: 2000, // how long the animation pauses until it shows the next snippet
  //   appearDelay: 2000, // how long the animation pauses until the char disappears
  //   initialDelay: 0, // initial delay on animation when window loads
  // });

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
        <div class="relative flex h-[60%] items-start gap-16">
          <div class="flex h-[400px] w-[600px] flex-1 overflow-hidden rounded-xl bg-code-editor-one-dark-pro">
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
              <div>Editor</div>
            </div>
          </div>
          <div class="h-[400px] w-[600px] flex-1 rounded-lg border-2 border-black bg-background-light-gray ">
            Output
          </div>
        </div>
      </div>
    </section>
  );
});
