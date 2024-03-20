import { component$, Slot } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { and, eq } from "drizzle-orm";
import drizzleClient from "~/utils/drizzleClient";
import { content_category } from "../../../../../drizzle_turso/schema/content_category";
import { content_index } from "../../../../../drizzle_turso/schema/content_index";
import { course_approval } from "../../../../../drizzle_turso/schema/course_approval";
import { tag } from "../../../../../drizzle_turso/schema/tag";

export const useCourseLoader = routeLoader$(async () => {
  return await drizzleClient()
    .select()
    .from(content_index)
    .innerJoin(course_approval, eq(course_approval.course_id, content_index.id))
    .where(
      and(
        eq(content_index.is_deleted, false),
        eq(content_index.is_private, false)
        // eq(course_approval.status, "approved")
      )
    );
});

export const useCategories = routeLoader$(async () => {
  return await drizzleClient().select().from(content_category);
  // .where(eq(content_category.approved, true));
});

export const useTags = routeLoader$(async () => {
  return await drizzleClient().select().from(tag);
  // .where(eq(tag.approved, true));
});

export default component$(() => <Slot />);
