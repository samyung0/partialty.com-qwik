import { type RequestHandler } from '@builder.io/qwik-city';
import { config } from '~/speak-config';

export const onRequest: RequestHandler = ({ request, locale, params, cookie }) => {
  const langCookie = cookie.get('lang');
  const acceptLanguage = request.headers.get('accept-language');

  let lang: string | undefined = undefined;

  // if (params.lang && validateLocale(params.lang)) {
  //   lang = config.supportedLocales.find((value) => value.lang === params.lang)?.lang;
  //   // if (!lang) throw error(404, "Not Found");
  // }
  // else
  if (langCookie) lang = langCookie.value;
  // else
  else if (acceptLanguage) lang = acceptLanguage.split(';')[0]?.split(',')[0];

  lang = config.supportedLocales.find((value) => value.lang === lang)?.lang || config.defaultLocale.lang;

  locale(lang);
};
