const code = `export default function MyApp() {
  return (
    <div class="flex h-[100%] w-full">
      <div class="w-[30%] bg-white"/>
      <div class="flex w-[70%] items-center bg-yellow">
        <p class="m-8 font-mosk text-[1.5em]">
          Let's learn web development
        </p>
      </div>
    </div>
  );
}`;

// export const reactCodeRendered = renderIndexCodeBlock({ code });
const _reactCode2BlankChar = [0];
Array.from(code).forEach((char: string) => {
  if (char === "\n") _reactCode2BlankChar.push(0);
  else _reactCode2BlankChar[_reactCode2BlankChar.length - 1]++;
});
export const reactCode2BlankChar = _reactCode2BlankChar;
export default code;
