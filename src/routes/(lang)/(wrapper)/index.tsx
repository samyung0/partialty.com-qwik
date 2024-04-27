import { $, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import type { DocumentHead, RequestHandler } from '@builder.io/qwik-city';
import { useLocation } from '@builder.io/qwik-city';

// import ZingTouch from 'zingtouch';

import Footer from '~/components/Footer';
import FAQ from '~/components/_Index/FAQ';

import NewHero from '~/components/_Index/NewHero';
import Creator from '~/components/_Index/NewHero/Creator';

import { cn } from '~/utils/cn';
import './index.css';

import readCookie from '~/utils/readCookie';

import { useContext } from '@builder.io/qwik';
import type theme from '~/const/theme';
import { themeContext } from '~/context/themeContext';

const getTheme = $(async () => {
  return readCookie('theme', document.cookie);
  // return await fetch('/api/courses/chapters/getThemeCookie/', {
  //   credentials: 'include',
  // }).then((x) => x.json());
});

export default component$(() => {
  const params = useLocation().url.searchParams;
  const stage = useSignal('enterFrom');
  const page = useSignal(0);
  const page2 = useSignal<HTMLDivElement>();
  const container = useSignal<HTMLDivElement>();

  const themeStore = useContext<{ value: (typeof theme)[number] }>(themeContext);

  useVisibleTask$(() => {
    if (params.get('errMessage')) alert(params.get('errMessage'));
  });

  useVisibleTask$(async () => {
    const theme = await getTheme();
    if (theme === 'light') {
      themeStore.value = 'light';
    } else if (theme === 'dark') {
      themeStore.value = 'dark';
    }
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
  // return
  // import.meta.env.MODE === 'production' && !params.get('preview') ? (
  //   <main class="flex h-[100vh] items-center justify-center overflow-hidden">
  //     <img src={UnderConstruction} width={500} height={500} class="hidden h-full w-auto object-contain xl:block" />
  //     <div class="flex h-full w-full items-center justify-center bg-background-light-gray xl:hidden">
  //       <div class="flex flex-col items-center justify-center gap-8 text-center">
  //         <h1 class="font-mosk text-[3rem]">! Under Construction !</h1>
  //         <p class="max-w-[500px] text-lg tracking-wide">
  //           We are building an e-learning platform that teaches web development, such as React and Next JS. The
  //           biggest difference is that there will be audio tracks that explain everything. Want to know more? Send an
  //           email to{' '}
  //           <a href="mailto:yungchinpang999@gmail.com" class="underline decoration-wavy underline-offset-[6px]">
  //             yungchinpang999@gmail.com
  //           </a>
  //           .
  //         </p>
  //       </div>
  //     </div>
  //   </main>
  // ) : (
  const initialX = useSignal<number | null>(null);
  const initialY = useSignal<number | null>(null);

  const startTouch = $((e: TouchEvent) => {
    initialX.value = e.touches[0].clientX;
    initialY.value = e.touches[0].clientY;

    setTimeout(() => {
      initialX.value = null;
      initialY.value = null;
    }, 250);
  });

  const logic = $((deltaY: number) => {
    if (page.value === 0 && deltaY > 0) {
      stage.value = 'enterTo';
      page.value = 1;
    } else if (page.value === 1 && page2.value && page2.value.scrollTop === 0 && deltaY < 0) {
      stage.value = 'enterFrom';
      page.value = 0;
    }
  });

  const moveTouch = $((e: TouchEvent) => {
    if (initialX.value === null) {
      return;
    }

    if (initialY.value === null) {
      return;
    }

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;

    const diffX = initialX.value - currentX;
    const diffY = initialY.value - currentY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // sliding horizontally
      if (diffX > 50) {
        // swiped left
        console.log('swiped left');
      } else {
        // swiped right
        console.log('swiped right');
      }
    } else {
      // sliding vertically
      if (diffY > 10 || diffY < -10) {
        logic(diffY);
      }
    }

    initialX.value = null;
    initialY.value = null;

    e.preventDefault();
  });
  // useVisibleTask$(({ track }) => {
  //   track(() => container.value);
  //   if (!container.value) return;

  // const zt = new ZingTouch.Region(document.body);
  // zt.bind(
  //   container.value,
  //   'swipe',
  //   (e) => {
  //     console.log(e);
  //   },
  //   false
  // );
  // });
  return (
    <main class="relative max-h-[100dvh] overflow-hidden bg-background-light-gray text-primary-dark-gray dark:bg-primary-dark-gray dark:text-background-light-gray">
      <div
        class={cn(
          'swup-slide relative min-h-[200dvh] -translate-y-[100dvh]',
          stage.value === 'enterFrom' && 'from',
          stage.value === 'enterTo' && 'to'
        )}
        ref={container}
        onwheel$={(e: WheelEvent) => {
          logic(e.deltaY);
        }}
        ontouchstart$={startTouch}
        onTouchMove$={moveTouch}
      >
        <div class="absolute inset-0 h-[100dvh] max-h-[100dvh] w-full overflow-hidden">
          <NewHero />
        </div>
        <div
          ref={page2}
          class="absolute inset-0 top-[100dvh] min-h-[100dvh] overflow-auto"
          // onWheel$={(e: WheelEvent) => {
          //   if ((window as any).smoothScroll.scrolling()) {
          //     (window as any).smoothScroll.stopAll();
          //   }
          // }}
        >
          <FAQ logic={logic} client:load />
          <Creator />
          <Footer />
        </div>
      </div>
      {/* <div class="hidden 2xl:block">
        <IndexNav />
      </div> */}
      {/* <Hero /> */}
      {/* <ContentVarieties /> */}
      {/* <ContentInteractive /> */}
      {/* <ContentAudio /> */}
    </main>
  );
});

export const head: DocumentHead = {
  title: 'Partialty',
  meta: [
    {
      name: 'og:title',
      content: 'Partialty',
    },
    {
      name: 'twitter:title',
      content: 'Partialty',
    },
    {
      name: "og:image",
      content: "https://i.ibb.co/RjHKTwf/thumbnail.png",
    },
    {
      name: "twitter:image",
      content: "https://i.ibb.co/RjHKTwf/thumbnail.png"
    },
    {
      name: 'description',
      content: `Partialty is an e-learning platform that teaches web development in the most simplest words possible and we mostly target beginners and intermediate developers. The courses are voice overed and there are beautiful highlights alongside. The most important part? They are free!`,
    },
    {
      name: 'og:description',
      content: `Partialty is an e-learning platform that teaches web development in the most simplest words possible and we mostly target beginners and intermediate developers. The courses are voice overed and there are beautiful highlights alongside. The most important part? They are free!`,
    },
    {
      name: 'twitter:description',
      content: `Partialty is an e-learning platform that teaches web development in the most simplest words possible and we mostly target beginners and intermediate developers. The courses are voice overed and there are beautiful highlights alongside. The most important part? They are free!`,
    },
  ],
  links: [
    {
      rel: 'canonical',
      href: 'https://www.partialty.com',
    },
  ],
};
