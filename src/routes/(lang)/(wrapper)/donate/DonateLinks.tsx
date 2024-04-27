import { component$ } from '@builder.io/qwik';

import BuyMeCoffee from '~/assets/img/buy_me_a_coffee.png';
// import OpenCollective from '~/assets/img/open_collective.png';
import Stripe from '~/assets/img/stripe.webp';

export default component$(() => {
  return (
    <section class="mx-auto mt-16 grid max-w-xl sm:mt-20 lg:mt-24 lg:max-w-2xl">
      <ul role="list" class="divide-y dark:divide-gray-700">
        <li class="flex justify-between gap-x-6 py-5">
          <a
            target="_blank"
            href="https://buy.stripe.com/6oEdU9gz21Vd0co145"
            class="flex w-full items-center justify-center gap-4"
          >
            <img src={Stripe} alt="Stripe" width="30" height="30" class="size-[30px] object-contain" />
            <span>Stripe</span>
          </a>
        </li>
        <li class="flex justify-between gap-x-6 py-5">
          <a
            target="_blank"
            href="https://buymeacoffee.com/partialty"
            class="flex w-full items-center justify-center gap-4"
          >
            <span class="rounded-xl bg-background-light-gray dark:p-2">
              <img src={BuyMeCoffee} alt="Buy Me a Coffee" width="30" height="30" class="size-[30px] object-contain" />
            </span>
            <span>Buy Me a Coffee</span>
          </a>
        </li>
      </ul>
    </section>
  );
});
