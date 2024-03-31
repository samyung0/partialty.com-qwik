import { component$, useSignal, useStore, useVisibleTask$ } from '@builder.io/qwik';
import type { TypeWriter } from '~/components/_Index/codeAnimation/TypeWriter';
import animateShow from '~/components/_Index/codeAnimation/animateShow';
import displayCodeOrder from '~/components/_Index/codeAnimation/displayCodeOrder';
import rendered from '~/components/_Index/codeBlock/rendered';

import codeBlock from '~/components/_Index/codeBlock';
import blankChar from '~/components/_Index/codeBlock/blankChar';

import { Link } from '@builder.io/qwik-city';
import Nav from '~/components/Nav';
import styles from './index.module.css';

export default component$(() => {
  // rendered (syntax highlighted) codes at COMPILE TIME
  // no wasm file shipped to client
  const codeDisplay = useSignal(rendered[`${displayCodeOrder[0]}Rendered`]);

  // requestAnimationFrame calls every 1000/60 = 16.667
  const typeWriter = useStore<TypeWriter>({
    displayIndex: 0, // which code snippet to display
    displayCodeOrder: displayCodeOrder,
    displayCode: codeBlock[displayCodeOrder[0]], // raw code snippet
    codeOutputIndex: -1,
    blankCharArr: blankChar[`${displayCodeOrder[0]}BlankChar`], // counts number of lines and number of chars per line
    revealedCharArr: Array(blankChar[`${displayCodeOrder[0]}BlankChar`].length).fill(0), // stores the number of blank chars that are NOT displayed per row, used for rendering
    currentChar: 0, // total displayed char in the current snippet
    currentRow: 0, // corresponds to the revealedCharArr
    rollbackTo: 0, //
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
    <section class="relative flex min-h-[100vh] flex-col bg-sea 2xl:bg-background-light-gray 2xl:after:absolute 2xl:after:right-0 2xl:after:top-0 2xl:after:z-0 2xl:after:h-[100%] 2xl:after:w-[70%] 2xl:after:bg-sea">
      <div class=" z-[100] block w-full 2xl:hidden">
        <Nav disableTheme />
      </div>
      <div class="flex flex-auto items-center justify-stretch">
        <div class="relative z-10 flex h-full w-full flex-col items-center justify-center pb-12 md:pt-0 2xl:flex-row">
          <div class=" flex items-center justify-center overflow-auto [order:1] xl:w-[50%] 2xl:justify-end 2xl:pr-[6vw] 2xl:[order:0]">
            <div class="relative flex h-[300px] w-[500px] max-w-[95vw] items-start justify-stretch overflow-auto bg-code-editor-one-dark-pro p-4 shadow-2xl lg:h-[400px] lg:w-[600px] lg:p-8">
              <div dangerouslySetInnerHTML={codeDisplay.value}></div>
              <div class="absolute left-0 top-0 flex items-start justify-stretch overflow-hidden p-4 lg:p-8">
                <pre class="text-base font-bold leading-6 lg:text-lg lg:leading-8">
                  {typeWriter.blankCharArr.map((blankCount, index) => {
                    currentCharWithoutNewLine--;
                    return [
                      <span key={`typeWriterBlankLine${displayCodeOrder[typeWriter.displayIndex]}${index}`}>
                        {Array.from(Array(blankCount)).map((_, index2) => {
                          blankCharSum++;
                          return (
                            <span
                              key={`typeWriterBlankChar${displayCodeOrder[typeWriter.displayIndex]}${index}-${index2}`}
                              class={
                                (typeWriter.revealedCharArr[index] > index2
                                  ? 'bg-transparent '
                                  : 'bg-code-editor-one-dark-pro ') +
                                (currentCharWithoutNewLine === blankCharSum
                                  ? typeWriter.appearStart === 0
                                    ? styles.blinkingCursorDisappearing
                                    : styles.blinkingCursorAppearing
                                  : currentCharWithoutNewLine === -1 && blankCharSum === 1
                                  ? styles.blinkingCursorEmptyCode
                                  : '')
                              }
                            >
                              &nbsp;
                            </span>
                          );
                        })}
                      </span>,
                      '\n',
                    ];
                  })}
                </pre>
              </div>
            </div>
          </div>
          <div class="flex flex-col items-center justify-center px-2 pt-0 [order:0] xl:w-[50%]  xl:pt-0 2xl:items-start 2xl:[order:1]">
            <h1>
              <Link
                href="/"
                class="font-mosk text-[1.5rem] font-[900] leading-[3rem] 2xl:text-[2rem] 2xl:leading-[3.5rem]"
              >
                Partialty.com
              </Link>
            </h1>
            <h2 class="max-w-[600px] pb-4 text-center font-mosk text-[1.5rem] font-[900] leading-[2rem] md:text-[2rem] md:leading-[3rem] 2xl:pb-8 2xl:text-left 2xl:text-[2.5rem] 2xl:leading-[3.5rem]">
              Learn{' '}
              <span class="relative inline-block p-1">
                <span
                  class={
                    '-z-1 test absolute left-0 top-[50%] inline-block h-[100%] w-full translate-y-[-50%] bg-bright-yellow ' +
                    styles.animateInitialText
                  }
                ></span>
                <span class="relative z-10">Web Development</span>
              </span>{' '}
              like you have <i>never</i> before.
            </h2>
            <Link
              href="/signup/"
              prefetch
              class="mb-6 rounded-lg bg-primary-dark-gray px-6 py-3 text-[0.875rem] text-background-light-gray shadow-2xl lg:mb-8 lg:px-8 lg:py-4 lg:text-[1rem] 2xl:mb-0"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
});
