/** @jsxImportSource react */

import { qwikify$ } from "@builder.io/qwik-react";
import { useEffect } from "react";
import astCompare from "~/components/_ContentEditor/astCompare";
import astParse from "~/components/_ContentEditor/astParse";

const QuizCodeHydrate = ({
  isPreview,
  saveToDB,
}: {
  isPreview: boolean;
  saveToDB: (isCorrect: boolean) => any;
}) => {
  useEffect(() => {
    (Array.from(document.getElementsByClassName("quizCodeBlock")) as HTMLFormElement[]).forEach(
      (form) =>
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const val = Object.fromEntries(new FormData(form).entries());
          let ans: any = {};
          try {
            ans = JSON.parse(decodeURIComponent(form.getAttribute("data-ans") || ""));
          } catch (e) {
            /* empty */
          }

          const formname = form.getAttribute("data-formname");
          let correctAns = false;
          if (!ans || !formname) return;
          if (ans.type === "matchInput") {
            correctAns = JSON.stringify(ans.matchInput) === JSON.stringify(val);
          } else {
            let combinedText: string = "";
            const astLang = form.getAttribute("data-astlang");
            try {
              combinedText = JSON.parse(
                decodeURIComponent(form.getAttribute("data-combinedtext") || "[]")
              )
                .map((x: any) => {
                  return Object.prototype.hasOwnProperty.call(x, "isCodeQuizInput")
                    ? { text: val[x.isCodeQuizInput] || "" }
                    : x;
                })
                .reduce((acc: string, cur: any) => acc + cur.text, "");
              if (
                combinedText &&
                astLang &&
                Object.prototype.hasOwnProperty.call(astParse, astLang)
              ) {
                const parsed = JSON.parse(JSON.stringify(astParse[astLang](combinedText)));
                correctAns = astCompare(parsed, JSON.parse(ans.ast));
              }
            } catch (e) {
              /* empty */
            }
          }

          const check = form.getElementsByClassName("formCheck")[0] as HTMLElement | undefined;
          const correct = form.getElementsByClassName("formCorrect")[0] as HTMLElement | undefined;
          const wrong = form.getElementsByClassName("formWrong")[0] as HTMLElement | undefined;
          if (!check || !correct || !wrong) return;
          check.style.display = "none";
          if (correctAns) correct.style.display = "block";
          else {
            wrong.style.display = "block";
            const correctAns = form
              .querySelector(`input[value="${ans}"]`)
              ?.parentElement?.getElementsByClassName("optionText")[0];
            if (correctAns) {
              const p = wrong.getElementsByTagName("p")[0];
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              if (p) p.innerHTML = "Correct answer: " + correctAns.innerHTML;
            }
          }

          if (isPreview) return;

          saveToDB(correctAns);
        })
    );
  }, []);
  return <></>;
};

export default QuizCodeHydrate;

export const QwikQuizCodeHydrate = qwikify$(QuizCodeHydrate, { eagerness: "load" });
