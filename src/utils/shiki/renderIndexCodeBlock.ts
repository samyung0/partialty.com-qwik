import { server$ } from "@builder.io/qwik-city";
import { addClassToHast, codeToHtml, type BundledLanguage } from "shikiji";

export default server$(async ({ code, language }: { code: string; language?: BundledLanguage }) => {
  const html = codeToHtml(code, {
    lang: language ?? "tsx",
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
