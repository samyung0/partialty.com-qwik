import { addClassToHast } from "shikiji";
import OneDarkPro, { getContentEditorHighlighter } from "~/utils/shikiji/OneDarkPro";

export default async ({ code }: { code: string }) => {
  const highlighter = await OneDarkPro();
  const html = highlighter.codeToHtml(code, {
    lang: "tsx",
    theme: "one-dark-pro",
    transformers: [
      {
        pre(node) {
          addClassToHast(node, `w-[100%] lg:text-lg text-base`);
        },
        line(node) {
          addClassToHast(node, `font-bold lg:leading-8 leading-6`);
        },
      },
    ],
  });
  return html;
};

export const highlightShikiji = async ({ code, lang }: { code: string; lang: string }) => {
  const highlighter = await getContentEditorHighlighter();
  const html = highlighter.codeToHtml(code, {
    lang: lang,
    theme: "one-dark-pro",
  });
  return html;
};
