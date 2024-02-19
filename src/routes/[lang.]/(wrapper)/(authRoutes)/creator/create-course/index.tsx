import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";

import CreateCourse from "~/components/_Creator/CreateCourse";

import drizzleClient from "~/utils/drizzleClient";
import { content_category } from "../../../../../../../drizzle_turso/schema/content_category";
import { tag } from "../../../../../../../drizzle_turso/schema/tag";

export const useTags = routeLoader$(async () => {
  return await drizzleClient().select().from(tag);
});

export const useCategories = routeLoader$(async () => {
  return await drizzleClient().select().from(content_category);
});

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
