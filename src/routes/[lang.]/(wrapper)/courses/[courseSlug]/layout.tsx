import { Slot, component$ } from "@builder.io/qwik";
import { routeLoader$, type RequestHandler } from "@builder.io/qwik-city";
import { and, eq } from "drizzle-orm";
import { auth, initLuciaIfNeeded } from "~/auth/lucia";
import type { LuciaSession } from "~/types/LuciaSession";
import drizzleClient, { initDrizzleIfNeeded } from "~/utils/drizzleClient";
import { initTursoIfNeeded } from "~/utils/tursoClient";
import { content } from "../../../../../../drizzle_turso/schema/content";
import { content_category } from "../../../../../../drizzle_turso/schema/content_category";
import { content_index } from "../../../../../../drizzle_turso/schema/content_index";
import { course_approval } from "../../../../../../drizzle_turso/schema/course_approval";
import { profiles } from "../../../../../../drizzle_turso/schema/profiles";
import { tag } from "../../../../../../drizzle_turso/schema/tag";

export const onRequest: RequestHandler = ({ env, cacheControl }) => {
  cacheControl({
    maxAge: 0,
    sMaxAge: 0,
    noStore: true,
    noCache: true,
  });
  initTursoIfNeeded(env, import.meta.env.VITE_USE_PROD_DB === "1");
  initDrizzleIfNeeded(import.meta.env.VITE_USE_PROD_DB === "1");
  initLuciaIfNeeded(env, import.meta.env.VITE_USE_PROD_DB === "1");
};

export const useUserLoaderNullable = routeLoader$(async (event) => {
  const courseSlug = event.params.courseSlug;
  if (!courseSlug) throw event.redirect(302, "/notfound/");

  const authRequest = auth().handleRequest(event);

  let session: LuciaSession | null = null;
  try {
    session = await authRequest.validate();
  } catch (e) {
    console.error(e);
    throw event.redirect(302, "/");
  }

  return session?.user as LuciaSession["user"] | undefined;
});

export const useTagLoader = routeLoader$(async () => {
  return await drizzleClient().select().from(tag);
});

export const useCategoryLoader = routeLoader$(async () => {
  return await drizzleClient().select().from(content_category);
});

export const useCourseLoader = routeLoader$(async (event) => {
  const _user = await event.resolveValue(useUserLoaderNullable);

  const courseSlug = event.params.courseSlug;
  const course = (
    await drizzleClient()
      .select()
      .from(content_index)
      .where(and(eq(content_index.slug, courseSlug), eq(content_index.is_deleted, false)))
      .limit(1)
      .innerJoin(course_approval, eq(course_approval.course_id, content_index.id))
      .innerJoin(profiles, eq(profiles.id, content_index.author))
  )[0];
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!course) throw event.redirect(302, "/notfound/");
  const chapters = await drizzleClient()
    .select({
      id: content.id,
      name: content.name,
      is_premium: content.is_premium,
      slug: content.slug,
      link: content.link,
    })
    .from(content)
    .where(and(eq(content.index_id, course.content_index.id), eq(content.is_deleted, false)));
  // if (chapters.length < 1) throw event.redirect(302, "/notfound/");

  if (
    course.course_approval.status !== "approved" &&
    (!_user || (_user.userId !== course.content_index.author && _user.role !== "admin"))
  )
    throw event.redirect(302, "/notfound/");

  if (!_user && course.content_index.is_private) throw event.redirect(302, "/notfound/");

  try {
    if (_user && course.content_index.is_private) {
      const accessible_course_read: string[] = JSON.parse(_user.accessible_courses_read || "[]");
      if (!accessible_course_read.includes(course.content_index.id))
        throw event.redirect(302, "/notfound/");
    }
  } catch (e) {
    console.error(e);
    throw event.redirect(302, "/notfound/");
  }

  const isFavourited = event.cookie.get("favourite" + course.content_index.id) !== null;

  return { course, preview: course.course_approval.status !== "approved", chapters, isFavourited };
});

export default component$(() => <Slot />);
