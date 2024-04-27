import { $, component$ } from '@builder.io/qwik';
import Footer from '~/components/Footer';
import Nav from '~/components/_Index/NewHero/nav';

import ContactLinks from './ContactLinks';

export default component$(() => {
  return (
    <div class="bg-background-light-gray dark:bg-primary-dark-gray dark:text-background-light-gray">
      <Nav />
      <main class="py-24 sm:py-32">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto max-w-2xl lg:text-center">
            <p class="mt-2 font-mosk text-3xl font-bold tracking-wide sm:text-4xl">Contact Me</p>
            <p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Here are my social links. Feel free to contact me about anything, but please don't spam my inbox D: If the
              community grows, I will remember to replace the links with the community ones.
            </p>
          </div>
          <ContactLinks />
        </div>
      </main>
      <Footer />
    </div>
  );
});
