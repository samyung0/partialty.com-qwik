import { Slot, component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { eq } from "drizzle-orm";
import { useUserLoader } from "~/routes/(lang)/(wrapper)/(authRoutes)/layout";
import drizzleClient from "~/utils/drizzleClient";
import { content_index } from "../../../../../../../../drizzle_turso/schema/content_index";
import { course_approval } from "../../../../../../../../drizzle_turso/schema/course_approval";

export const useLoader = routeLoader$(async (event) => {
  const id = event.params.id;
  const user = await event.resolveValue(useUserLoader);
  let accessible_courses: string[];
  try {
    accessible_courses = JSON.parse(user.accessible_courses || "[]");
  } catch (e) {
    console.error(e);
    accessible_courses = [];
  }
  if (!accessible_courses.includes(id) && user.role !== "admin")
    throw event.redirect(302, "/unauth/");
  try {
    const course = await drizzleClient(event.env, import.meta.env.VITE_USE_PROD_DB === "1")
      .select()
      .from(content_index)
      .where(eq(content_index.id, id));
    if (!course[0]) throw event.redirect(302, "/notfound/");
    const approval = await drizzleClient(event.env, import.meta.env.VITE_USE_PROD_DB === "1")
      .select()
      .from(course_approval)
      .where(eq(course_approval.course_id, course[0].id));
    if (!approval[0]) throw event.redirect(302, "/notfound/");
    if (course[0].is_locked && course[0].author !== user.userId && user.role !== "admin")
      throw event.redirect(302, "/unauth/");
    return { course, approval };
  } catch (e) {
    console.error(e);
    throw event.redirect(302, "/unauth/");
  }
});

export default component$(() => {
  return <Slot />;
});
