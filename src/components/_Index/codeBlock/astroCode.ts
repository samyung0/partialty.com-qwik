// import renderIndexCodeBlock from "~/utils/shikiji/renderIndexCodeBlock";

// make sure there are no blank lines at the start and end of the string !!!
const code = `---
import Button from './Button.astro';
import MyReactButton from './MyReactButton.jsx';
import MySvelteButton from './MySvelteButton.svelte';
---
<div>
  <Button />
  <MyReactButton client:idle />
  <MySvelteButton client:load />
</div>`;

// export const astroCodeRendered = renderIndexCodeBlock({ code });
const _astroCodeBlankChar = [0];
Array.from(code).forEach((char: string) => {
  if (char === '\n') _astroCodeBlankChar.push(0);
  else _astroCodeBlankChar[_astroCodeBlankChar.length - 1]++;
});
export const astroCodeBlankChar = _astroCodeBlankChar;
export default code;
