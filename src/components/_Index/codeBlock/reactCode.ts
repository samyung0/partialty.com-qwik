import renderIndexCodeBlock from "~/utils/shikiji/renderIndexCodeBlock";

// make sure there are no blank lines at the start and end of the string !!!
const code = `export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
    </div>
  );
}`;

export const reactCodeRendered = renderIndexCodeBlock({ code });
const _reactCodeBlankChar = [0];
Array.from(code).forEach((char: string) => {
  if (char === "\n") _reactCodeBlankChar.push(0);
  else _reactCodeBlankChar[_reactCodeBlankChar.length - 1]++;
});
export const reactCodeBlankChar = _reactCodeBlankChar;
export default code;
