import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';

import displayCodeOrderInteractive from '../codeAnimation/displayCodeOrderInteractive';
import blankChar from '../codeBlock/blankChar';
import rendered from '../codeBlock/rendered';

import TypeScriptIcon from '~/assets/svg/typescript.svg';

import styles from './index.module.css';

const codeSnippets = [
  <div key="snippet-1" class="flex h-[100%] w-full">
    <div class="w-[30%] bg-white" />
    <div class="flex w-[70%] items-center bg-custom-yellow">
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
  { from: 'bg-custom-yellow-400', to: 'bg-red-400', row: 4, pos: 56 },
  { from: 'text-[1.5em]', to: 'text-[2.5em]', row: 5, pos: 33 },
  { from: 'text-[2.5em]', to: 'text-[1.5em]', row: 5, pos: 33 },
  { from: 'bg-red-400', to: 'bg-custom-yellow-400', row: 4, pos: 53 },
];

export default component$(() => {
  const codeDisplay = useSignal(rendered[`${displayCodeOrderInteractive[1]}Rendered`]);
  const replaceStringIdx = useSignal(0);
  const codeOutputIdx = useSignal(0);

  const blankCharArr = useSignal(blankChar['reactCode2BlankChar']);
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
    <section class="min-h-[100vh] bg-mint py-8">
      <div class="flex min-h-[100vh] flex-col items-center justify-center gap-6 overflow-hidden md:gap-12">
        <div class="flex items-center justify-center">
          <h1 class="p-2 text-center font-mosk text-lg font-[900] md:text-3xl lg:text-[2rem] lg:leading-[3rem] xl:text-[2.5rem] xl:leading-[3.5rem]">
            Enhance your learning experience with the help of the
            <br />
            built-in interactive code playground.
          </h1>
        </div>
        <div class="relative flex w-full flex-col items-center justify-evenly gap-2 lg:flex-row lg:gap-6 lg:p-6">
          <div class=" flex max-h-[40vh] w-[500px] max-w-[95vw] overflow-auto rounded-xl bg-code-editor-one-dark-pro lg:h-[500px] lg:max-h-[100vh] lg:w-[650px] lg:max-w-[50vw] xl:h-[500px]">
            <div class=" flex flex-col gap-2 bg-primary-dark-gray px-2 pt-2">
              <div class="h-[15px] w-[15px] rounded-full bg-red-500"></div>
              <div class="h-[15px] w-[15px] rounded-full bg-custom-yellow"></div>
              <div class="h-[15px] w-[15px] rounded-full bg-green-600"></div>
            </div>
            <div class="flex flex-col">
              <div class="flex items-start gap-1 p-2">
                <img src={TypeScriptIcon} alt="typescript-icon" width={14} height={14} />
                <p class="text-xs text-background-light-gray">file.tsx</p>
              </div>
              <div class="relative flex h-full w-full items-start justify-stretch bg-code-editor-one-dark-pro p-3 xl:p-8 ">
                <div dangerouslySetInnerHTML={codeDisplay.value}></div>
                <div class="absolute left-0 top-0 flex items-start justify-stretch p-3 xl:p-8">
                  <pre class="text-base font-bold leading-6 lg:text-lg lg:leading-8">
                    {blankCharArr.value.map((blankCount, row) => [
                      <span key={`blankline-${row}`}>
                        {Array.from(Array(blankCount)).map((char, charIdx) => (
                          <span
                            key={`blankline-${row}-char-${charIdx}`}
                            class={
                              row === cursorRow.value && charIdx === cursorPos.value && styles.blinkingCursorEmptyCode
                            }
                          >
                            &nbsp;
                          </span>
                        ))}
                      </span>,
                      '\n',
                    ])}
                  </pre>
                </div>
              </div>
            </div>
          </div>
          <div class="max-h-[40vh] max-w-[95vw] overflow-auto rounded-lg  border-2 border-black bg-background-light-gray lg:max-h-[100vh] lg:max-w-[50vw]">
            <div class="h-[300px] w-[500px] lg:h-[500px] lg:w-[600px] xl:h-[500px] xl:w-[800px]">
              {codeSnippets[codeOutputIdx.value]}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
