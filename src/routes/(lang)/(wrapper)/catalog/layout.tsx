import { component$, Slot } from '@builder.io/qwik';
import type { RequestHandler } from '@builder.io/qwik-city';
import { routeLoader$ } from '@builder.io/qwik-city';
import { and, eq } from 'drizzle-orm';
import drizzleClient, { initDrizzleIfNeeded } from '~/utils/drizzleClient';
import { initTursoIfNeeded } from '~/utils/tursoClient';
import { content_category } from '../../../../../drizzle_turso/schema/content_category';
import { content_index } from '../../../../../drizzle_turso/schema/content_index';
import { course_approval } from '../../../../../drizzle_turso/schema/course_approval';
import { tag } from '../../../../../drizzle_turso/schema/tag';

export const onRequest: RequestHandler = ({ env, cacheControl }) => {
  initTursoIfNeeded(env, import.meta.env.VITE_USE_PROD_DB === '1');
  initDrizzleIfNeeded(env, import.meta.env.VITE_USE_PROD_DB === '1');
};

export const useCourseLoader = routeLoader$(async (event) => {
  return await drizzleClient(event.env, import.meta.env.VITE_USE_PROD_DB === '1')
    .select()
    .from(content_index)
    .innerJoin(course_approval, eq(course_approval.course_id, content_index.id))
    .where(
      and(
        eq(content_index.is_deleted, false),
        eq(content_index.is_private, false),
        eq(course_approval.status, 'approved')
      )
    );
});

export const useCategories = routeLoader$(async (event) => {
  return await drizzleClient(event.env, import.meta.env.VITE_USE_PROD_DB === '1')
    .select()
    .from(content_category)
    .where(eq(content_category.approved, true));
});

export const useTags = routeLoader$(async (event) => {
  return await drizzleClient(event.env, import.meta.env.VITE_USE_PROD_DB === '1')
    .select()
    .from(tag)
    .where(eq(tag.approved, true));
});

export default component$(() => <Slot />);
