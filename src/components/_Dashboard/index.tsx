import { component$ } from '@builder.io/qwik';
import Footer from '~/components/Footer';
import Nav from '~/components/Nav';
import Courses from '~/components/_Dashboard/Courses';
import GettingStarted from '~/components/_Dashboard/GettingStarted';
import type { LuciaSession } from '~/types/LuciaSession';

export default component$(({ user }: { user: LuciaSession['user'] }) => {
  return (
    <section class="min-h-[100dvh] bg-light-yellow dark:bg-primary-dark-gray dark:text-background-light-gray">
      <Nav user={user} />
      <div class="min-h-[100dvh]">
        <GettingStarted />
        <Courses />
      </div>
      {/* <Projects /> */}
      <Footer />
    </section>
  );
});
