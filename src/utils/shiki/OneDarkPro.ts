import { server$ } from "@builder.io/qwik-city";
import { getHighlighterCore } from "shikiji/core";
import oneDarkPro from "shikiji/themes/one-dark-pro.mjs";
import { getWasmInlined } from "shikiji/wasm";

export default server$(async () => {
  const highlighter = await getHighlighterCore({
    themes: [oneDarkPro],
    langs: [import("shikiji/langs/tsx.mjs")],
    loadWasm: getWasmInlined,
  });

  // optionally, load themes and languages after creation
  // await highlighter.loadTheme(import("shikiji/themes/vitesse-light.mjs"));
  return highlighter;
});
