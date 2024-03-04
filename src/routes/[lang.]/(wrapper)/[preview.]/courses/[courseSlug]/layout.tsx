import { Slot, component$ } from "@builder.io/qwik";
import { routeLoader$, type RequestHandler } from "@builder.io/qwik-city";
import { and, eq } from "drizzle-orm";
import { auth, initLuciaIfNeeded } from "~/auth/lucia";
import type { LuciaSession } from "~/types/LuciaSession";
import drizzleClient, { initDrizzleIfNeeded } from "~/utils/drizzleClient";
import { initTursoIfNeeded } from "~/utils/tursoClient";
import { content_index } from "../../../../../../../drizzle_turso/schema/content_index";
import { course_approval } from "../../../../../../../drizzle_turso/schema/course_approval";

export const onRequest: RequestHandler = ({ env, cacheControl }) => {
  initTursoIfNeeded(env, import.meta.env.VITE_USE_PROD_DB === "1");
  initDrizzleIfNeeded(import.meta.env.VITE_USE_PROD_DB === "1");
  initLuciaIfNeeded(env, import.meta.env.VITE_USE_PROD_DB === "1");
};

export const useUserLoaderPreview = routeLoader$(async (event) => {
  const preview = event.params.preview;
  const courseSlug = event.params.courseSlug;
  if (!courseSlug) throw event.redirect(302, "/");

  const authRequest = auth().handleRequest(event);

  let session: LuciaSession | null = null;
  try {
    session = await authRequest.validate();
  } catch (e) {
    console.error(e);
    throw event.redirect(302, "/");
  }

  if (preview && (!session || session.user.role !== "admin")) throw event.redirect(302, "/");

  return session?.user as LuciaSession["user"] | undefined;
});

export const useCourseLoader = routeLoader$(async (event) => {
  const _user = await event.resolveValue(useUserLoaderPreview);

  const preview = event.params.preview;
  const courseSlug = event.params.courseSlug;
  const course = (
    await drizzleClient()
      .select()
      .from(content_index)
      .where(and(eq(content_index.slug, courseSlug), eq(content_index.is_deleted, false)))
      .limit(1)
      .innerJoin(course_approval, eq(course_approval.course_id, content_index.id))
  )[0];
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!course) throw event.redirect(302, "/");

  if (!preview && course.course_approval.status !== "approved")
    throw event.redirect(302, "/notfound/");

  if (preview && _user?.role !== "admin") throw event.redirect(302, "/");

  return course;
});

export default component$(() => <Slot />);
