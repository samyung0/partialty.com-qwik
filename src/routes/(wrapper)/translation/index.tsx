import { component$ } from "@builder.io/qwik";
import { inlineTranslate, useFormatDate, useFormatNumber, useSpeak } from "qwik-speak";

import { $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { server$ } from "@builder.io/qwik-city";
import type { SpeakLocale } from "qwik-speak";
import { useSpeakConfig } from "qwik-speak";

export const storeLocaleCookie = server$(function (lang: string) {
  this.cookie.set("lang", lang, {
    path: "/",
    maxAge: [7, "days"],
    httpOnly: false,
    sameSite: "lax",
    secure: true,
  });
});

export const head: DocumentHead = () => {
  const t = inlineTranslate();
  return {
    title: t("app.page1.head.title@@Translation"),
    meta: [{ name: "description", content: t("app.page1.head.description@@Description") }],
  };
};

export default component$(() => {
  const t = inlineTranslate();
  const fd = useFormatDate();
  const fn = useFormatNumber();
  const config = useSpeakConfig();

  useSpeak({ assets: ["page1"] });

  const navigateByLocale$ = $((newLocale: SpeakLocale) => {
    const url = new URL(window.location.href);
    url.searchParams.delete("lang");
    storeLocaleCookie(newLocale.lang).then(() => (location.href = url.href));
  });

  return (
    <>
      <div>
        <h2>{t("page1.changeLocale@@Change locale")}</h2>
        {config.supportedLocales.map((value) => (
          <button
            style={{
              border: "2px solid black",
              padding: "10px",
              margin: "10px",
            }}
            key={value.lang}
            onClick$={async () => await navigateByLocale$(value)}
          >
            {value.lang}
          </button>
        ))}
      </div>
      <h1>{t("page1.title@@{{name}} demo", { name: "Qwik Speak" })}</h1>
      <p>
        ???
        {fd(Date.now(), {
          dateStyle: "full",
          timeStyle: "short",
          timeZone: "hongkong",
        })}
      </p>

      <h3>{t("page1.dates@@Dates")}</h3>
      <p>{fd(Date.now(), { dateStyle: "full", timeStyle: "short" })}</p>

      <h3>{t("page1.numbers@@Numbers")}</h3>
      <p>{fn(1000000, { style: "currency" })}</p>
    </>
  );
});
