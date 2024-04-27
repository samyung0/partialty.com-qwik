import { component$ } from '@builder.io/qwik';
import Footer from '~/components/Footer';
import Nav from '~/components/_Index/NewHero/nav';
import SuggestionLinks from '~/routes/(lang)/(wrapper)/suggestion/SuggestionLinks';

export default component$(() => {
  return (
    <div class="bg-background-light-gray dark:bg-primary-dark-gray dark:text-background-light-gray">
      <Nav />
      <main class="py-24 sm:py-32">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto max-w-2xl lg:text-center">
            <p class="mt-2 font-mosk text-3xl font-bold tracking-wide sm:text-4xl">Make Suggestions</p>
            <p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              What do you think about the website? What should be added or changed? Are there mistakes in the courses?
              Or is there something else you wanna let us know? Feel free to send me an email or fill in the Google Form
            </p>
          </div>
          <SuggestionLinks />
        </div>
      </main>
      <Footer />
    </div>
  );
});
