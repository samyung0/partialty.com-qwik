import { $, component$, useSignal, useStore, useTask$ } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import Step1 from "~/components/_Creator/CreateCourse/step1";
import Step2 from "~/components/_Creator/CreateCourse/step2";
import Step3 from "~/components/_Creator/CreateCourse/step3";
import Step4 from "~/components/_Creator/CreateCourse/step4";
import Step5 from "~/components/_Creator/CreateCourse/step5";
import Step6 from "~/components/_Creator/CreateCourse/step6";
import Step7 from "~/components/_Creator/CreateCourse/step7";
import { useUserLoader } from "~/routes/[lang.]/(wrapper)/(authRoutes)/layout";
import drizzleClient from "~/utils/drizzleClient";
import useWS from "~/utils/useWS";
import type { NewContent } from "../../../../drizzle_turso/schema/content";
import { content } from "../../../../drizzle_turso/schema/content";
import type { ContentCategory } from "../../../../drizzle_turso/schema/content_category";
import type { NewContentIndex } from "../../../../drizzle_turso/schema/content_index";
import { content_index } from "../../../../drizzle_turso/schema/content_index";
import type { NewCourseApproval } from "../../../../drizzle_turso/schema/course_approval";
import { course_approval } from "../../../../drizzle_turso/schema/course_approval";
import { profiles } from "../../../../drizzle_turso/schema/profiles";
import type { Tag } from "../../../../drizzle_turso/schema/tag";

const insertCourseApproval = server$(async (courseApproval: NewCourseApproval) => {
  await drizzleClient().insert(course_approval).values(courseApproval);
});

const insertCourse = server$(async (course: NewContentIndex) => {
  await drizzleClient().insert(content_index).values(course);
});

const insertChapter = server$(async (chapter: NewContent) => {
  await drizzleClient().insert(content).values(chapter);
});

const setCourseServer = server$(
  async (accessible_courses: string, accessible_courses_read: string, userId: string) => {
    await drizzleClient()
      .update(profiles)
      .set({
        accessible_courses: accessible_courses,
        accessible_courses_read: accessible_courses_read,
      })
      .where(eq(profiles.id, userId));
  }
);

export default component$(() => {
  const user = useUserLoader().value;
  const ws = useWS(user);
  const formSteps = useSignal(0);
  const createdTags = useSignal<Tag[]>([]);
  const createdCategory = useSignal<ContentCategory>();
  const courseData = useStore<NewContentIndex>({
    id: uuidv4(),
    name: "",
    slug: "",
    chapter_order: [],
    link: "",
    is_premium: false,
    is_locked: false,
    is_private: false,
    is_single_page: true,
    author: user.userId,
    tags: [],
    category: "",
    created_by_admin: user.role === "admin",
    lang: "en-US",
    supported_lang: ["en-US"],
    description: "",
    is_deleted: false,
  });
  const courseApproval = useStore<NewCourseApproval>({
    id: uuidv4(),
    course_id: courseData.id,
    link: "",
    ready_for_approval: false,
    added_tags: [],
    added_categories: "",
    status: "pending",
    description: "Default description generated from adding a new course.",
  });
  const courseDataError = useStore({
    name: "",
    chapter_order: "",
    description: "",
  });
  useTask$(({ track }) => {
    track(() => courseData.slug);
    courseData.link = `/courses/${courseData.slug}/`;
  });
  useTask$(({ track }) => {
    track(createdTags);
    courseApproval.added_tags = createdTags.value.map((tag) => tag.id);
  });
  useTask$(({ track }) => {
    track(createdCategory);
    if (createdCategory.value) courseApproval.added_categories = createdCategory.value.id;
  });

  const handleSubmit = $(async () => {
    try {
      const newContent = {
        id: uuidv4(),
        name: courseData.name,
        slug: courseData.slug,
        link: `/courses/${courseData.slug}/chapters/${courseData.slug}/`,
        index_id: courseData.id,
        renderedHTML: null,
        content_slate: null,
        is_locked: false,
        is_premium: false,
        audio_track_playback_id: null,
        audio_track_asset_id: null,
      } as NewContent;

      if (courseData.is_single_page) {
        courseData.chapter_order.push(newContent.id);
      }
      await insertCourse(courseData);
      await insertCourseApproval(courseApproval); // insert after course due to fk constraint
      if (courseData.is_single_page) await insertChapter(newContent); // insert after course due to fk constraint

      let accessible_courses: string[];
      try {
        accessible_courses = JSON.parse(user.accessible_courses || "[]");
      } catch (e) {
        console.error(e);
        accessible_courses = [];
      }
      accessible_courses.push(courseData.id);
      let accessible_courses_read: string[];
      try {
        accessible_courses_read = JSON.parse(user.accessible_courses_read || "[]");
      } catch (e) {
        console.error(e);
        accessible_courses_read = [];
      }
      accessible_courses_read.push(courseData.id);
      await setCourseServer(
        JSON.stringify(accessible_courses),
        JSON.stringify(accessible_courses_read),
        user.userId
      );
      console.log(ws.value);
      ws.value?.send(
        JSON.stringify({
          type: "createContent",
          courseId: courseData.id,
          details: courseData,
        })
      );
      // window.close();
    } catch (e) {
      console.error(e);
      alert("Something went wrong! Please try again later or contact support.");
    }
  });

  return (
    <main class="flex h-[100vh] items-center justify-center overflow-hidden bg-sherbet dark:bg-primary-dark-gray dark:text-background-light-gray">
      <div class="w-[80vw] overflow-hidden">
        <div>
          <div
            class="flex w-[560vw] transition-transform"
            style={{ transform: `translate3d(-${formSteps.value * 80}vw, 0, 0)` }}
          >
            <Step1
              courseData={courseData}
              courseDataError={courseDataError}
              formSteps={formSteps}
            />
            <Step2
              courseData={courseData}
              courseDataError={courseDataError}
              formSteps={formSteps}
            />
            <Step3
              courseData={courseData}
              courseDataError={courseDataError}
              formSteps={formSteps}
              createdCategory={createdCategory}
            />
            <Step4 courseData={courseData} formSteps={formSteps} createdTags={createdTags} />
            <Step5 courseData={courseData} formSteps={formSteps} />
            <Step6 courseData={courseData} formSteps={formSteps} />
            <Step7
              courseData={courseData}
              formSteps={formSteps}
              handleSubmit={handleSubmit}
              createdTags={createdTags}
              createdCategory={createdCategory}
            />
          </div>
        </div>
      </div>
    </main>
  );
});
