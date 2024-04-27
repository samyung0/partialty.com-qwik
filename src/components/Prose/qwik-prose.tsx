import type { QRL } from '@builder.io/qwik';
import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { EMBED_URL } from '~/const';

import astCompare from '~/components/_ContentEditor/astCompare';
import astParse from '~/components/_ContentEditor/astParse';

export default component$(
  ({
    innerHTML,
    isPreview,
    saveToDB,
  }: {
    innerHTML: string;
    isPreview: boolean;
    saveToDB: QRL<(isCorrect: boolean) => any>;
  }) => {
    const interval = useSignal<any>();
    const isDark = useSignal<boolean>(false);
    useVisibleTask$(({ cleanup }) => {
      console.log('hydrate embed');
      const darkThemeDiv = document.getElementById('darkThemeDiv');
      if (!darkThemeDiv) return;
      clearInterval(interval.value);
      interval.value = setInterval(() => {
        const dark = darkThemeDiv.className;
        const shouldGoDark = dark.includes('dark') && !isDark.value;
        const shouldGoLight = !dark.includes('dark') && isDark.value;
        const iframeEmbed = Array.from(document.getElementsByClassName('iframeEmbed'));
        iframeEmbed.forEach((iframe) => {
          const iframeSrc = iframe.getAttribute('src');
          if (iframeSrc && iframeSrc.startsWith(EMBED_URL)) {
            if (shouldGoDark) {
              isDark.value = true;
              const url = new URL(iframeSrc);
              url.searchParams.set('dark', '1');
              (iframe as HTMLIFrameElement).src = url.toString();
            } else if (shouldGoLight) {
              isDark.value = false;
              const url = new URL(iframeSrc);
              url.searchParams.delete('dark');
              (iframe as HTMLIFrameElement).src = url.toString();
            }
          }
        });
      }, 100);
      cleanup(() => {
        clearInterval(interval.value);
        isDark.value = false;
      });
    });

    useVisibleTask$(() => {
      console.log('Hydrate Quiz');
      (Array.from(document.getElementsByClassName('quizOptionButton')) as HTMLElement[]).forEach((button) => {
        button.addEventListener('click', (e) => {
          const name = button.getAttribute('data-formname');
          if (!name) return;
          const formInputs = Array.from(document.querySelectorAll(`input[name=${name}]`));
          formInputs.forEach((el) => {
            (el as HTMLInputElement).checked = false;
            const quizOption = (el as HTMLInputElement).parentElement?.getElementsByClassName('quizOption')[0] as
              | HTMLElement
              | undefined;
            if (!quizOption) return;
            quizOption.style.width = '12px';
            quizOption.style.height = '12px';
          });
          const inputEl = button.getElementsByTagName('input')[0] as HTMLInputElement | undefined;
          if (!inputEl) return;
          inputEl.checked = true;
          const quizOption = button.getElementsByClassName('quizOption')[0] as HTMLElement | undefined;
          if (!quizOption) return;
          quizOption.style.width = '8px';
          quizOption.style.height = '8px';
        });
      });
      (Array.from(document.getElementsByClassName('quizBlock')) as HTMLFormElement[]).forEach((form) =>
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const val = Object.fromEntries(new FormData(form).entries());
          const ans = form.getAttribute('data-ans');
          const formname = form.getAttribute('data-formname');
          if (!ans || !formname) return;
          let correctAns = false;
          if (val[formname] === ans) correctAns = true;

          const check = form.getElementsByClassName('formCheck')[0] as HTMLElement | undefined;
          const correct = form.getElementsByClassName('formCorrect')[0] as HTMLElement | undefined;
          const wrong = form.getElementsByClassName('formWrong')[0] as HTMLElement | undefined;
          if (!check || !correct || !wrong) return;
          check.style.display = 'none';
          if (correctAns) correct.style.display = 'block';
          else {
            wrong.style.display = 'block';
            const correctAns = form
              .querySelector(`input[value="${ans}"]`)
              ?.parentElement?.getElementsByClassName('optionText')[0];
            if (correctAns) {
              const p = wrong.getElementsByTagName('p')[0];
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              if (p) p.innerHTML = 'Correct answer: ' + correctAns.innerHTML;
            }
          }

          if (isPreview) return;

          saveToDB(correctAns);
        })
      );
    });

    useVisibleTask$(() => {
      console.log('Hydrate Quiz Code');
      (Array.from(document.getElementsByClassName('quizCodeBlock')) as HTMLFormElement[]).forEach((form) => {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const val = Object.fromEntries(new FormData(form).entries());
          let ans: any = {};
          try {
            ans = JSON.parse(decodeURIComponent(form.getAttribute('data-ans') || ''));
          } catch (e) {
            /* empty */
          }

          const formname = form.getAttribute('data-formname');
          const isCode = form.getAttribute('data-iscode');
          let correctAns = false;
          if (!ans || !formname) return;
          if (isCode === '0' || ans.type === 'matchInput') {
            correctAns = JSON.stringify(ans.matchInput) === JSON.stringify(val);
          } else {
            let combinedText: string = '';
            const astLang = form.getAttribute('data-astlang');
            try {
              combinedText = JSON.parse(decodeURIComponent(form.getAttribute('data-combinedtext') || '[]'))
                .map((x: any) => {
                  return Object.prototype.hasOwnProperty.call(x, 'isCodeQuizInput')
                    ? { text: val[x.isCodeQuizInput] || '' }
                    : x;
                })
                .reduce((acc: string, cur: any) => acc + cur.text, '');
              if (combinedText && astLang && Object.prototype.hasOwnProperty.call(astParse, astLang)) {
                const parsed = JSON.parse(JSON.stringify(astParse[astLang](combinedText)));
                correctAns = astCompare(parsed, JSON.parse(ans.ast));
              }
            } catch (e) {
              /* empty */
            }
          }

          const check = form.getElementsByClassName('formCheck')[0] as HTMLElement | undefined;
          const correct = form.getElementsByClassName('formCorrect')[0] as HTMLElement | undefined;
          const wrong = form.getElementsByClassName('formWrong')[0] as HTMLElement | undefined;
          if (!check || !correct || !wrong) return;
          check.style.display = 'none';
          if (correctAns) correct.style.display = 'inline-block';
          else {
            wrong.style.display = 'inline-block';
            const correctAns = form
              .querySelector(`input[value="${ans}"]`)
              ?.parentElement?.getElementsByClassName('optionText')[0];
            if (correctAns) {
              const p = wrong.getElementsByTagName('p')[0];
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              if (p) p.innerHTML = 'Correct answer: ' + correctAns.innerHTML;
            }
          }

          if (isPreview) return;

          saveToDB(correctAns);
        });
        const showAnsButton = form.getElementsByClassName('formShow')[0] as HTMLButtonElement;
        const showAnsContainer = form.getElementsByClassName('answerContainer')[0] as HTMLParagraphElement;
        showAnsButton.addEventListener('click', () => {
          showAnsContainer.innerText = decodeURIComponent(form.getAttribute('data-codeans') || '');
          showAnsContainer.style.display = 'block';
        });
      });
    });
    return (
      <article
        // SHOULD add a background
        id="sectionProse"
        class="prose mx-auto w-[90%] max-w-[unset] bg-background-light-gray px-0 pt-6 text-sm leading-6 prose-a:underline prose-a:underline-offset-4 prose-blockquote:pr-[1em]
    prose-figcaption:mt-0 prose-figcaption:text-xs prose-figcaption:italic
    prose-strong:tracking-wider prose-pre:bg-code-editor-one-dark-pro prose-pre:font-cascadiaCode prose-pre:text-xs  prose-pre:leading-5 prose-img:m-0 dark:bg-primary-dark-gray
    dark:text-background-light-gray
     dark:prose-figcaption:text-gray-300 md:w-[80%] md:pt-12 lg:w-full
    lg:px-12
     lg:text-base lg:leading-7 lg:prose-figcaption:text-sm lg:prose-pre:text-sm lg:prose-pre:leading-6
    2xl:mx-0
    2xl:max-w-[1200px] 2xl:px-20 [&_code:not(pre_code)]:rounded-md
    [&_code:not(pre_code)]:bg-gray-300/70 [&_code:not(pre_code)]:p-[2px] [&_code:not(pre_code)]:text-[unset] [&_code:not(pre_code)]:before:content-none [&_code:not(pre_code)]:after:content-none dark:[&_code:not(pre_code)]:bg-gray-600/70"
        dangerouslySetInnerHTML={innerHTML}
      ></article>
    );
  }
);
