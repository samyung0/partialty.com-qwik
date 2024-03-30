import { $ } from '@builder.io/qwik';
import type { RequestEventLoader } from '@builder.io/qwik-city';
import { and, eq, or } from 'drizzle-orm';
import { useUserLoader } from '~/routes/(lang)/(wrapper)/(authRoutes)/layout';
import drizzleClient from '~/utils/drizzleClient';
import { content } from '../../../drizzle_turso/schema/content';
import { content_index } from '../../../drizzle_turso/schema/content_index';
import { course_approval } from '../../../drizzle_turso/schema/course_approval';
import { profiles } from '../../../drizzle_turso/schema/profiles';

export const adminCourseApprovalLoader = $(async (event: RequestEventLoader) => {
  const user = await event.resolveValue(useUserLoader);
  if (user.role !== 'admin') return [];
  const courses = await drizzleClient(event.env, import.meta.env.VITE_USE_PROD_DB === '1')
    .select()
    .from(content_index)
    .where(
      and(
        eq(content_index.is_deleted, false),
        eq(course_approval.ready_for_approval, true),
        eq(course_approval.status, 'pending')
      )
    )
    .innerJoin(profiles, eq(profiles.id, content_index.author))
    .innerJoin(course_approval, eq(course_approval.course_id, content_index.id));
  const chapters = await drizzleClient(event.env, import.meta.env.VITE_USE_PROD_DB === '1')
    .select({
      name: content.name,
      id: content.id,
      is_locked: content.is_locked,
      is_premium: content.is_premium,
      is_checkpoint: content.is_checkpoint,
      index_id: content.index_id,
      link: content.link,
    })
    .from(content)
    .where(
      and(eq(content.is_deleted, false), or(...courses.map((entry) => eq(content.index_id, entry.content_index.id))))
    );

  return courses.map((entry) => ({
    ...entry,
    chapters: chapters.filter((chapter) => chapter.index_id === entry.content_index.id),
  }));
});
