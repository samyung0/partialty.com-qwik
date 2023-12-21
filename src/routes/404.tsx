import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { inlineTranslate } from "qwik-speak";

// export const onGet: RequestHandler = ({ status }) => {
//   status(404);
// };

// export const onStaticGenerate: StaticGenerateHandler = () => {
//   return {
//     params: config.supportedLocales.map(locale => {
//       return { lang: locale.lang !== config.defaultLocale.lang ? locale.lang : '.' };
//     })
//   };
// };

export const head: DocumentHead = () => {
  const t = inlineTranslate();
  return {
    title: t("app.404page.head.title@@Not Found"),
    meta: [
      {
        name: "description",
        content: t(
          "app.404page.head.description@@Cannot retrive page content! Please check if the url is valid!"
        ),
      },
    ],
  };
};

export default component$(() => {
  const t = inlineTranslate();
  return <div>{t("404page.body@@not found")}</div>;
});
