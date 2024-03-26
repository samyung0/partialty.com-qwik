import { component$ } from '@builder.io/qwik';
import { Link, useLocation, type DocumentHead } from '@builder.io/qwik-city';
import { inlineTranslate } from 'qwik-speak';

export const head: DocumentHead = () => {
  const t = inlineTranslate();
  return {
    title: t('app.pageUnauth.head.title@@401'),
    meta: [{ name: 'description', content: t('app.pageUnauth.head.description@@Unauthorized!') }],
  };
};

export default component$(() => {
  const t = inlineTranslate();
  const search = useLocation().url.search;
  return (
    <section class="flex h-[100vh] flex-col items-center justify-center bg-tomato/20">
      <h1 class="font-mosk text-[2rem] font-bold tracking-wide lg:text-[3em]">401</h1>
      <p class="p-4 text-center text-base tracking-wide lg:text-lg">
        {t('pageUnauth.body@@You have wandered into a private territory without permission. Please return to safety.')}
      </p>
      <Link
        href={'/login/' + search}
        class="p-4 pt-0 text-center text-base tracking-wide underline decoration-wavy underline-offset-8 lg:text-lg"
      >
        {t('pageUnauth.login@@Please login or signup first.')}
      </Link>
    </section>
  );
});
