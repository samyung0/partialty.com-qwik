import { component$ } from '@builder.io/qwik';
import { LuTerminal } from '@qwikest/icons/lucide';

import FireDark from "~/assets/img/fire-dark.png"
import SparkleDark from "~/assets/img/sparkle-dark.png"

export default component$(() => {
  return (
    <div class="flex flex-col items-center justify-center gap-6">
      <div class="text-lg">
        <LuTerminal />
      </div>
      <h1 class="font-mosk text-4xl tracking-wide relative">
        <span class="block absolute top-[20px] left-[-50px] -rotate-12">
          <img src={SparkleDark} alt="" width="30" height="30" class="object-contain" />
        </span>
        Learn Front-end in a <span class="highlight-light-lilac dark:highlight-dark-lilac">painless</span> way.
      </h1>
      <p class="text-bold whitespace-nowrap text-center leading-6 tracking-wider relative">
        We got audio courses with <span class="border-b-4 border-custom-yellow">beautiful</span> highlights.
        <br />
        No more digging around docs and opening twenty tabs just to learn the basics.
        <br />
        Dive into our free courses and give us your opinions! (づ ◕‿◕ )づ
        <span class="block absolute bottom-[0px] right-[-50px] rotate-12">
          <img src={FireDark} alt="" width="30" height="30" class="object-contain" />
        </span>
      </p>
      <a
        href="/members/dashboard/"
        class="cursor-none rounded-[2rem] bg-primary-dark-gray dark:bg-highlight-dark px-6 py-3 text-sm text-background-light-gray shadow-xl"
      >
        Lesssgo
      </a>
    </div>
  );
});
