import renderIndexCodeBlock from "~/utils/shiki/renderIndexCodeBlock";

// make sure there are no blank lines at the start and end of the string !!!
const code = `---
import Button from './Button.astro';
---
<div>
  <Button title="Button 1" />
  <Button title="Button 2" />
  <Button title="Button 3" />
</div>`;

export const astroCodeRendered = renderIndexCodeBlock({ code, language: "tsx" });
const _astroCodeBlankChar = [0];
Array.from(code).forEach((char: string) => {
  if (char === "\n") _astroCodeBlankChar.push(0);
  else _astroCodeBlankChar[_astroCodeBlankChar.length - 1]++;
});
export const astroCodeBlankChar = _astroCodeBlankChar;
export default code;
