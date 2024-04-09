/** @jsxImportSource react */

import { qwikify$ } from '@builder.io/qwik-react';
import { useEffect } from 'react';

const QuizHydrate = ({
  isPreview,
  saveToDB,
}: {
  isPreview: boolean;
  saveToDB: (isCorrect: boolean) => any;
}) => {
  useEffect(() => {
    console.log("Hydrate Quiz");
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
  }, []);
  return <></>;
};

export default QuizHydrate;

export const QwikQuizHydrate = qwikify$(QuizHydrate, { eagerness: 'load' });
