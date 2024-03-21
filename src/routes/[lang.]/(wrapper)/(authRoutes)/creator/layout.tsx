import { Slot, component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";

import drizzleClient from "~/utils/drizzleClient";
import { content_category } from "../../../../../../drizzle_turso/schema/content_category";
import { tag } from "../../../../../../drizzle_turso/schema/tag";

export const useTags = routeLoader$(async (event) => {
  return await drizzleClient(event.env).select().from(tag);
});

export const useCategories = routeLoader$(async (event) => {
  return await drizzleClient(event.env).select().from(content_category);
});

export default component$(() => {
  return <Slot />;
});
