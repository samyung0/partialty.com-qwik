import { component$, useVisibleTask$ } from '@builder.io/qwik';
import type { DocumentHead, RequestHandler } from '@builder.io/qwik-city';
import { useLocation } from '@builder.io/qwik-city';

import UnderConstruction from '~/assets/img/under_construction.png';
import Footer from '~/components/Footer';
import ContentAudio from '~/components/_Index/ContentAudio';
import ContentVarieties from '~/components/_Index/ContentVarieties';
import Hero from '~/components/_Index/Hero';
import IndexNav from '~/components/_Index/Nav';

// REMOVE
export const onRequest: RequestHandler = ({ env, cacheControl }) => {
  cacheControl({
    maxAge: 0,
    sMaxAge: 0,
    noStore: true,
    noCache: true,
  });
};

export default component$(() => {
  const params = useLocation().url.searchParams;

  useVisibleTask$(() => {
    if (params.get('errMessage')) alert(params.get('errMessage'));
  });

  // useVisibleTask$(() => {
  //   bunApp.mirror.post({
  //     id: 123,
  //     name: "dsadsa"
  //   })
  // })
  // useVisibleTask$(() => {
  //   setTimeout(async () => {
  //     const a = await loadClientData(new URL("http://localhost:5173/login"), null);
  //     console.log(a);
  //   }, 1000);
  // });
  return import.meta.env.MODE === 'production' && !params.get('preview') ? (
    <main class="flex h-[100vh] items-center justify-center overflow-hidden">
      <img src={UnderConstruction} width={500} height={500} class="hidden h-full w-auto object-contain xl:block" />
      <div class="flex h-full w-full items-center justify-center bg-light-yellow xl:hidden">
        <div class="flex flex-col items-center justify-center gap-8 text-center">
          <h1 class="font-mosk text-[3rem]">! Under Construction !</h1>
          <p class="max-w-[500px] text-lg tracking-wide">
            We are building an e-learning platform that teaches web development, such as React, Vue and Next JS. The
            biggest difference is that there will be audio tracks that explain everything. Want to know more? Send an
            email to{' '}
            <a href="mailto:yungchinpang999@gmail.com" class="underline decoration-wavy underline-offset-[6px]">
              yungchinpang999@gmail.com
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  ) : (
    <main class="relative min-h-[100vh] bg-background-light-gray">
      <div class="hidden 2xl:block">
        <IndexNav />
      </div>
      <Hero />
      <ContentVarieties />
      {/* <ContentInteractive /> */}
      <ContentAudio />
      <Footer />
    </main>
  );
});

export const head: DocumentHead = {
  title: 'Partialty',
  meta: [
    {
      name: 'description',
      content: `Partialty is an e-learning platform that teaches web development in simple words and includes frameworks such as React, Vue, Next JS and much more. The biggest difference that sets aside us and the other learning platform is the addition of audio that explains alongside the text.`,
    },
  ],
};
