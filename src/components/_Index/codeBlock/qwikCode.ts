// import renderIndexCodeBlock from "~/utils/shikiji/renderIndexCodeBlock";

// make sure there are no blank lines at the start and end of the string !!!
const code = `import { component$ } from '@builder.io/qwik';
 
export default component$(() => {
  return <section>A Joke!</section>;
});`;

// export const qwikCodeRendered = renderIndexCodeBlock({ code });
const _qwikCodeBlankChar = [0];
Array.from(code).forEach((char: string) => {
  if (char === '\n') _qwikCodeBlankChar.push(0);
  else _qwikCodeBlankChar[_qwikCodeBlankChar.length - 1]++;
});
export const qwikCodeBlankChar = _qwikCodeBlankChar;
export default code;
