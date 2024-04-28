import { component$ } from '@builder.io/qwik';

import FAQ from '~/components/_Index/FAQ';
import Nav from '~/components/_Index/NewHero/nav';
import Footer from '~/components/Footer';

export default component$(() => {
  return (
    <main class="bg-background-light-gray dark:bg-primary-dark-gray dark:text-background-light-gray">
      <Nav />
      <FAQ topButton={false} />
      <Footer />
    </main>
  );
});
