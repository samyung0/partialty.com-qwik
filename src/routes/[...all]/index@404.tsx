import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { inlineTranslate } from "qwik-speak";

export const head: DocumentHead = () => {
  const t = inlineTranslate();
  return {
    title: t("app.page404.head.title@@404"),
    meta: [{ name: "description", content: t("app.page404.head.description@@Not Found") }],
  };
};

export default component$(() => {
  const t = inlineTranslate();
  return (
    <section class="flex h-[100vh] flex-col items-center justify-center bg-tomato/20">
      <h1 class="font-mosk text-[3em] font-bold tracking-wide">404</h1>
      <p class="pt-4 text-lg tracking-wide">
        {t("page404.body@@You have wandered into an unkown territory. Please return to safety.")}
      </p>
    </section>
  );
});
