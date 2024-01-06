import { server$ } from "@builder.io/qwik-city";
import { getHighlighterCore } from "shikiji/core";
import oneDarkPro from "shikiji/themes/one-dark-pro.mjs";
import { getWasmInlined } from "shikiji/wasm";

const highlighter = getHighlighterCore({
  themes: [oneDarkPro],
  langs: [import("shikiji/langs/tsx.mjs")],
  loadWasm: getWasmInlined,
});
export default server$(async () => {
  return await highlighter;
});
