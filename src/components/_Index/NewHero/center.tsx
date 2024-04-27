import { $, component$, useOnDocument, useSignal } from '@builder.io/qwik';
import { LuTerminal } from '@qwikest/icons/lucide';

import FireDark from '~/assets/img/fire-dark.png';
import SparkleDark from '~/assets/img/sparkle-dark.png';

import { cn } from '~/utils/cn';
import './index.css';

export default component$(() => {
  const stage = useSignal('enterFrom');
  // const { stage, shouldMount } = useCSSTransition(onOff, {
  //   timeout: 0,
  //   transitionOnAppear: true,
  // });
  useOnDocument(
    'qinit',
    $(() => {
      stage.value = 'enterTo';
    })
  );

  return (
    <section
      class={cn(
        'swup-main flex w-[90dvw] flex-col items-center  justify-center gap-6  lg:w-[600px] lg:max-w-[600px]',
        stage.value === 'enterFrom' && 'is-animating',
        stage.value === 'enterTo' && 'is-animating to-left'
      )}
    >
      <div class="text-lg">
        <LuTerminal />
      </div>
      <h1 class="relative text-center font-mosk text-2xl tracking-wide md:text-3xl lg:text-4xl">
        <span class="absolute left-[-50px] top-[20px] block -rotate-12">
          <img src={SparkleDark} alt="" width="30" height="30" class="object-contain" />
        </span>
        Learn Front-end in a{' '}
        <span class="whitespace-nowrap">
          <span class="highlight-light-lilac dark:highlight-dark-lilac">painless</span> way
        </span>
        .
      </h1>
      <p class="text-bold relative text-center text-sm md:leading-5 md:tracking-wider lg:text-base lg:leading-6">
        We got audio courses with <span class="border-b-4 border-custom-yellow">beautiful</span> highlights.
        <br />
        <span class="hidden md:inline">
          No more digging around docs and opening twenty tabs just to learn the basics.
          <br />
        </span>
        Dive into our free courses and give us your opinions! <span class="whitespace-nowrap">(づ ◕‿◕ )づ</span>
        <span class="absolute bottom-[0px] right-[-50px] block rotate-12">
          <img src={FireDark} alt="" width="30" height="30" class="object-contain" />
        </span>
      </p>
      <a
        href="/members/dashboard/"
        class="cursor-none rounded-[2rem] bg-primary-dark-gray px-5 py-2 text-sm text-background-light-gray shadow-xl dark:bg-highlight-dark lg:px-6 lg:py-3"
      >
        I'm Locked in
      </a>
    </section>
  );
});
