import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

import ChapterPage from '~/components/_Courses/Chapter';
import { useCourseLoader } from '~/routes/(lang)/(wrapper)/courses/[courseSlug]/layout';

export default component$(() => {
  return <ChapterPage />;
});

export const head: DocumentHead = ({ resolveValue }) => {
  const { course } = resolveValue(useCourseLoader);
  return {
    title: `${course.content_index.name}`,
    meta: [
      {
        name: 'description',
        content: `${course.content_index.short_description} - ${course.content_index.description}`,
      },
    ],
  };
};

// export const onStaticGenerate: StaticGenerateHandler = async () => {
//   return {
//     params: [
//       {
//         courseSlug: 'setting-up-a-local-server',
//         chapterSlug: 'setting-up-a-local-server',
//       },
//     ],
//   };
// };
