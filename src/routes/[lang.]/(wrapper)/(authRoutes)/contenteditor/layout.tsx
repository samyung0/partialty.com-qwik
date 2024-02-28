import { routeLoader$, type RequestHandler } from "@builder.io/qwik-city";
import { eq } from "drizzle-orm";
import { useUserLoader } from "~/routes/[lang.]/(wrapper)/(authRoutes)/layout";
import drizzleClient from "~/utils/drizzleClient";
import { content } from "../../../../../../drizzle_turso/schema/content";
import { content_index } from "../../../../../../drizzle_turso/schema/content_index";

export const onRequest: RequestHandler = (request) => {
  if (import.meta.env.MODE !== "production" && import.meta.env.VITE_USE_PROD_DB !== "1")
    throw new Error("You must enable the use of prod DB first! Set VITE_USE_PROD_DB to 1.");
};

export const useVerifyChapter = routeLoader$(async (event) => {
  const courseId = event.url.searchParams.get("courseId");
  const chapterId = event.url.searchParams.get("chapterId");
  if (!courseId || !chapterId) return;
  const user = await event.resolveValue(useUserLoader);
  let accessible_courses: string[];
  try {
    accessible_courses =
      user.role === "admin" ? ["*"] : JSON.parse(user.accessible_courses || "[]");
  } catch (e) {
    accessible_courses = [];
  }
  const isLocked = (
    await drizzleClient()
      .select({
        is_locked: content.is_locked,
        author: content_index.author,
        index_id: content.index_id,
      })
      .from(content)
      .where(eq(content.id, chapterId))
      .innerJoin(content_index, eq(content_index.id, content.index_id))
  )[0];
  if (!isLocked) {
    return false;
  }
  if (
    courseId !== isLocked.index_id ||
    (accessible_courses[0] !== "*" && !accessible_courses.includes(courseId)) ||
    (isLocked.is_locked && user.userId !== isLocked.author && user.role !== "admin")
  ) {
    throw event.redirect(302, "/unauth/");
  }
  return true;
});
