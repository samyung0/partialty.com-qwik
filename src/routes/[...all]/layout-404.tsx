import { component$, Slot } from '@builder.io/qwik';
import { useSpeak } from 'qwik-speak';

import { type RequestHandler } from '@builder.io/qwik-city';
import { validateLocale } from 'qwik-speak';
import { config } from '~/speak-config';

export const onRequest: RequestHandler = ({ request, locale, params, status }) => {
  status(404);

  const acceptLanguage = request.headers.get('accept-language');
  const paramsLang = params.all.slice(0, params.all.indexOf('/'));
  let lang: string | undefined = undefined;

  if (validateLocale(paramsLang)) {
    lang = config.supportedLocales.find((value) => value.lang === paramsLang)?.lang;
  } else if (acceptLanguage) lang = acceptLanguage.split(';')[0]?.split(',')[0];

  lang = config.supportedLocales.find((value) => value.lang === lang)?.lang || config.defaultLocale.lang;

  locale(lang);
};

export default component$(() => {
  useSpeak({ assets: ['page404'] });

  return <Slot />;
});
