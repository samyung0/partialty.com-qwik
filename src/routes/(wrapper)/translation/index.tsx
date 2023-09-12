import { component$ } from "@builder.io/qwik";
import { useFormatDate, useFormatNumber, useTranslate } from "qwik-speak";

import { $ } from "@builder.io/qwik";
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

export default component$(() => {
  const t = useTranslate();
  const fd = useFormatDate();
  const fn = useFormatNumber();
  const config = useSpeakConfig();

  const navigateByLocale$ = $((newLocale: SpeakLocale) => {
    storeLocaleCookie(newLocale.lang).then(() => location.reload());
  });

  return (
    <>
      <div>
        <h2>{t("app.changeLocale@@Change locale")}</h2>
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
      <h1>{t("app.title@@{{name}} demo", { name: "Qwik Speak" })}</h1>
      <p>
        ???
        {fd(Date.now(), {
          dateStyle: "full",
          timeStyle: "short",
          timeZone: "hongkong",
        })}
      </p>

      <h3>{t("main.dates@@Dates")}</h3>
      <p>{fd(Date.now(), { dateStyle: "full", timeStyle: "short" })}</p>

      <h3>{t("main.numbers@@Numbers")}</h3>
      <p>{fn(1000000, { style: "currency" })}</p>
    </>
  );
});
