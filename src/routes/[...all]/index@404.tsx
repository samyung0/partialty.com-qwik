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
  return <div>{t("page404.body@@not found")}</div>;
});
