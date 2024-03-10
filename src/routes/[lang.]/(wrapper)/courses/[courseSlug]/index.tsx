import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";

import CoursePage from "~/components/_Courses";
import { useCourseLoader } from "~/routes/[lang.]/(wrapper)/courses/[courseSlug]/layout";

export default component$(() => {
  return <CoursePage />;
});

export const head: DocumentHead = ({ resolveValue }) => {
  const {course} = resolveValue(useCourseLoader);
  return {
    title: `Course ${course.content_index.name}`,
    meta: [
      {
        name: "description",
        content: `${course.content_index.short_description} - ${course.content_index.description}`,
      },
    ],
  };
};
