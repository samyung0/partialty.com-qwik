import { $ } from "@builder.io/qwik";
import { addClassToHast } from "shikiji";
import OneDarkPro from "~/utils/shiki/OneDarkPro";

export default $(async ({ code }: { code: string }) => {
  const highlighter = await OneDarkPro();
  const html = highlighter.codeToHtml(code, {
    lang: "tsx",
    theme: "one-dark-pro",
    transformers: [
      {
        pre(node) {
          addClassToHast(node, `w-[100%] text-lg`);
        },
        line(node) {
          addClassToHast(node, `font-bold leading-8`);
        },
      },
    ],
  });
  return html;
});
