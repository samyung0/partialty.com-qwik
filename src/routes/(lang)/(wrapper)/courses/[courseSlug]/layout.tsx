import { Slot, component$ } from '@builder.io/qwik';
import { routeLoader$, type RequestHandler } from '@builder.io/qwik-city';
import { and, eq } from 'drizzle-orm';
import { auth, initLuciaIfNeeded } from '~/auth/lucia';
import type { LuciaSession } from '~/types/LuciaSession';
import drizzleClient, { initDrizzleIfNeeded } from '~/utils/drizzleClient';
import { initTursoIfNeeded } from '~/utils/tursoClient';
import { content } from '../../../../../../drizzle_turso/schema/content';
import { content_category } from '../../../../../../drizzle_turso/schema/content_category';
import { content_index } from '../../../../../../drizzle_turso/schema/content_index';
import { content_user_progress } from '../../../../../../drizzle_turso/schema/content_user_progress';
import { course_approval } from '../../../../../../drizzle_turso/schema/course_approval';
import { profiles } from '../../../../../../drizzle_turso/schema/profiles';
import { tag } from '../../../../../../drizzle_turso/schema/tag';

export const onRequest: RequestHandler = ({ env, cacheControl }) => {
  cacheControl({
    maxAge: 0,
    sMaxAge: 0,
    noStore: true,
    noCache: true,
  });
  initTursoIfNeeded(env, import.meta.env.VITE_USE_PROD_DB === '1');
  initDrizzleIfNeeded(env, import.meta.env.VITE_USE_PROD_DB === '1');
  initLuciaIfNeeded(env, import.meta.env.VITE_USE_PROD_DB === '1');
};

export const useUserLoaderNullable = routeLoader$(async (event) => {
  const courseSlug = event.params.courseSlug;
  if (!courseSlug) throw event.redirect(302, '/notfound/');

  const authRequest = auth(event.env, import.meta.env.VITE_USE_PROD_DB === '1').handleRequest(event);

  let session: LuciaSession | null = null;
  try {
    session = await authRequest.validate();
  } catch (e) {
    console.error(e);
    throw event.redirect(302, '/');
  }

  return session?.user as LuciaSession['user'] | undefined;
});

export const useTagLoader = routeLoader$(async (event) => {
  return await drizzleClient(event.env, import.meta.env.VITE_USE_PROD_DB === '1')
    .select()
    .from(tag);
});

export const useCategoryLoader = routeLoader$(async (event) => {
  return await drizzleClient(event.env, import.meta.env.VITE_USE_PROD_DB === '1')
    .select()
    .from(content_category);
});

export const useCourseLoader = routeLoader$(async (event) => {
  const _user = await event.resolveValue(useUserLoaderNullable);

  let accessible_courses_read: string[] = [];
  let accessible_courses: string[] = [];
  if (_user) {
    try {
      accessible_courses = JSON.parse(_user.accessible_courses || '[]');
      accessible_courses_read = JSON.parse(_user.accessible_courses_read || '[]');
    } catch (e) {
      console.error(e);
      throw event.redirect(302, '/notfound/');
    }
  }

  const courseSlug = event.params.courseSlug;
  const course = (
    await drizzleClient(event.env, import.meta.env.VITE_USE_PROD_DB === '1')
      .select()
      .from(content_index)
      .where(and(eq(content_index.slug, courseSlug), eq(content_index.is_deleted, false)))
      .limit(1)
      .innerJoin(course_approval, eq(course_approval.course_id, content_index.id))
      .innerJoin(profiles, eq(profiles.id, content_index.author))
      .leftJoin(
        content_user_progress,
        and(eq(content_user_progress.index_id, content_index.id), eq(profiles.id, content_user_progress.user_id))
      )
  )[0];
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!course) throw event.redirect(302, '/notfound/');
  const chapters = await drizzleClient(event.env, import.meta.env.VITE_USE_PROD_DB === '1')
    .select({
      id: content.id,
      name: content.name,
      is_premium: content.is_premium,
      slug: content.slug,
      link: content.link,
      is_checkpoint: content.is_checkpoint,
    })
    .from(content)
    .where(and(eq(content.index_id, course.content_index.id), eq(content.is_deleted, false)));

  if (
    course.course_approval.status !== 'approved' &&
    (!_user ||
      (_user.userId !== course.content_index.author &&
        _user.role !== 'admin' &&
        !accessible_courses.includes(course.content_index.id) &&
        !accessible_courses_read.includes(course.content_index.id)))
  )
    throw event.redirect(302, '/unauth/');

  if (!_user && course.content_index.is_private) throw event.redirect(302, '/unauth/');

  if (_user && course.content_index.is_private) {
    if (!accessible_courses_read.includes(course.content_index.id)) throw event.redirect(302, '/unauth/');
  }

  // fetched client side
  // const isFavourited = event.cookie.get('favourite' + course.content_index.id) !== null;

  return { course, preview: course.course_approval.status !== 'approved', chapters };
});

export default component$(() => <Slot />);
