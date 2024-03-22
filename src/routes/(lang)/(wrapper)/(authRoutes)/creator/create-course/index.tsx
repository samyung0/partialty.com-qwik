import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

import CreateCourse from "~/components/_Creator/CreateCourse";

export default component$(() => {
  return <CreateCourse />;
});

export const head: DocumentHead = {
  title: "Create Course",
  meta: [
    {
      name: "description",
      content: "Add your own courses!",
    },
  ],
};
