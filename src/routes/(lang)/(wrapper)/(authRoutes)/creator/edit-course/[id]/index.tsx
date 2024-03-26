import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import EditCourse from '~/components/_Creator/EditCourse';

export default component$(() => {
  return <EditCourse />;
});

export const head: DocumentHead = {
  title: 'Edit Course',
  meta: [
    {
      name: 'description',
      content: 'Edit your own courses!',
    },
  ],
};
