import * as shiki from "shiki";
import GithubDark from "./OneDarkPro";

export default ({ code, language }: { code: string; language?: string }) => {
  const tokens = GithubDark.codeToThemedTokens(code, language ?? "javascript");
  const html = shiki.renderToHtml(tokens, {
    fg: GithubDark.getForegroundColor("one-dark-pro"), // Set a specific foreground color.
    bg: GithubDark.getBackgroundColor("one-dark-pro"),
    elements: {
      pre({ className, style, children }) {
        return `<pre class="${className} w-[100%] text-lg" style="${style}" tabindex="0">${children}</pre>`;
      },
      line({ className, children, _index }) {
        return `<span class="${className} font-bold leading-8">${children}</span>`;
      },
    },
  });
  return html;
};
