import { Slot, component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { and, eq, or } from "drizzle-orm";
import { useUserLoader } from "~/routes/[lang.]/(wrapper)/(authRoutes)/layout";
import drizzleClient from "~/utils/drizzleClient";
import { content } from "../../../../../../../drizzle_turso/schema/content";
import { content_category } from "../../../../../../../drizzle_turso/schema/content_category";
import { content_index } from "../../../../../../../drizzle_turso/schema/content_index";
import { content_user_progress } from "../../../../../../../drizzle_turso/schema/content_user_progress";
import { tag } from "../../../../../../../drizzle_turso/schema/tag";

export const useTagLoader = routeLoader$(async (event) => {
  return await drizzleClient(event.env).select().from(tag);
});

export const useCategoryLoader = routeLoader$(async (event) => {
  return await drizzleClient(event.env).select().from(content_category);
});

export const useDBLoader = routeLoader$(async (event) => {
  const user = await event.resolveValue(useUserLoader);

  const data = await drizzleClient(event.env)
    .select()
    .from(content_user_progress)
    .where(eq(content_user_progress.user_id, user.userId))
    .innerJoin(
      content_index,
      and(eq(content_index.id, content_user_progress.index_id), eq(content_index.is_deleted, false))
    );

  const chapters = await drizzleClient(event.env)
    .select({ id: content.id, slug: content.slug, name: content.name, link: content.link })
    .from(content)
    .where(
      and(
        or(...data.map((x) => eq(content.index_id, x.content_index.id))),
        eq(content.is_deleted, false)
      )
    );

  return { data, chapters };
});

export default component$(() => <Slot />);
