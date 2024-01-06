import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import codeBlock from "~/components/_Index/codeBlock";
import Hero from "~/components/_Index/hero/index";
import Nav from "~/components/_Index/nav/index";
import renderIndexCodeBlock from "~/utils/shiki/renderIndexCodeBlock";

export const useRenderedCode = routeLoader$(async () => {
  const renderedCode: Record<string, string> = {};
  Object.entries(codeBlock).forEach(async ([key, code]) => {
    renderedCode[`${key}Rendered`] = await renderIndexCodeBlock({ code });
  });
  return renderedCode as Record<`${keyof typeof codeBlock}Rendered`, string>;
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
