import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import codeBlock from "~/components/_Index/codeBlock";
// import reactCode from "~/components/_Index/codeBlock/reactCode";
import Hero from "~/components/_Index/hero/index";
import Nav from "~/components/_Index/nav/index";
import renderIndexCodeBlock from "~/utils/shiki/renderIndexCodeBlock";

export const useCodeBlock = routeLoader$<Record<string, any>>(() => {
  const blankCharArr: Record<string, number[]> = {};
  const renderedArr: Record<string, string> = {};
  Object.entries(codeBlock).forEach(([key, val]) => {
    blankCharArr[`${key}BlankChar`] = [0];
    Array.from(val).forEach((char: string) => {
      if (char === "\n") blankCharArr[`${key}BlankChar`].push(0);
      else blankCharArr[`${key}BlankChar`][blankCharArr[`${key}BlankChar`].length - 1]++;
    });
    renderedArr[key] = renderIndexCodeBlock({ code: val, language: "tsx" });
  });
  return {
    ...renderedArr,
    ...blankCharArr,
  };
});

export default component$(() => {
  // useVisibleTask$(() => {
  //   setTimeout(async () => {
  //     const a = await loadClientData(new URL("http://localhost:5173/login"), null);
  //     console.log(a);
  //   }, 1000);
  // });
  return (
    <main class="min-h-[100vh] bg-background-light-gray">
      <Nav />
      <Hero />
    </main>
  );
});
