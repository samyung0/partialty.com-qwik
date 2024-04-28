import { component$ } from '@builder.io/qwik';

import Dashboard from '~/components/_Dashboard';
import { useUserLoader } from '~/routes/(lang)/(wrapper)/(authRoutes)/layout';

import { documentHead } from '~/head';

export default component$(() => {
  const user = useUserLoader();

  return (
    <main class="">
      <Dashboard user={user.value}></Dashboard>
    </main>
  );
});

export const head = { ...documentHead, title: 'Dashboard' };
