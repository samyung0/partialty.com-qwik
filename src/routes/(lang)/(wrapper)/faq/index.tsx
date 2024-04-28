import { component$ } from '@builder.io/qwik';

import FAQ from '~/components/_Index/FAQ';
import Nav from '~/components/_Index/NewHero/nav';
import Footer from '~/components/Footer';

export default component$(() => {
  return (
    <main>
      <Nav />
      <FAQ topButton={false} />
      <Footer />
    </main>
  );
});
