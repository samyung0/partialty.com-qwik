import { getHighlighterCore } from 'shikiji/core';
import oneDarkPro from 'shikiji/themes/one-dark-pro.mjs';
import { getWasmInlined } from 'shikiji/wasm';

const highlighter = getHighlighterCore({
  themes: [oneDarkPro],
  langs: [import('shikiji/langs/tsx.mjs')],
  loadWasm: getWasmInlined,
});
export default async () => {
  return await highlighter;
};

const contentEditorHighlighter = getHighlighterCore({
  themes: [oneDarkPro],
  langs: [
    import('shikiji/langs/tsx.mjs'),
    import('shikiji/langs/jsx.mjs'),
    import('shikiji/langs/typescript.mjs'),
    import('shikiji/langs/javascript.mjs'),
    import('shikiji/langs/json.mjs'),
    import('shikiji/langs/markdown.mjs'),
    import('shikiji/langs/c.mjs'),
    import('shikiji/langs/cpp.mjs'),
    import('shikiji/langs/csharp.mjs'),
    import('shikiji/langs/go.mjs'),
    import('shikiji/langs/java.mjs'),
    import('shikiji/langs/php.mjs'),
    import('shikiji/langs/python.mjs'),
    import('shikiji/langs/ruby.mjs'),
    import('shikiji/langs/rust.mjs'),
    import('shikiji/langs/sql.mjs'),
    import('shikiji/langs/css.mjs'),
    import('shikiji/langs/html.mjs'),
  ],
  loadWasm: getWasmInlined,
});

export const getContentEditorHighlighter = async () => {
  return await contentEditorHighlighter;
};
