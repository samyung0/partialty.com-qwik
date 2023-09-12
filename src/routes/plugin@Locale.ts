import { type RequestHandler } from "@builder.io/qwik-city";
import { config } from "~/speak-config";

export const onRequest: RequestHandler = ({ request, locale, query, cookie }) => {
  const langCookie = cookie.get("lang");
  const acceptLanguage = request.headers.get("accept-language");

  let lang: string | null = null;
  // priority: searchParams > cookie > header > default
  if (query.has("lang")) lang = query.get("lang");
  else if (langCookie) lang = langCookie.value;
  else if (acceptLanguage) lang = acceptLanguage.split(";")[0]?.split(",")[0];

  lang =
    config.supportedLocales.find((value) => value.lang === lang)?.lang || config.defaultLocale.lang;

  cookie.set("lang", lang, {
    path: "/",
    maxAge: [7, "days"],
    httpOnly: false,
    sameSite: "lax",
    secure: true,
  });

  locale(lang);
};
