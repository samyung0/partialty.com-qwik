import { getHighlighterCore } from "shikiji/core";
import oneDarkPro from "shikiji/themes/one-dark-pro.mjs";
import { getWasmInlined } from "shikiji/wasm";

const highlighter = getHighlighterCore({
  themes: [oneDarkPro],
  langs: [import("shikiji/langs/tsx.mjs")],
  loadWasm: getWasmInlined,
});
export default async () => {
  return await highlighter;
};
