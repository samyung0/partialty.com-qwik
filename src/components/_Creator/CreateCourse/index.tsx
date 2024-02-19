import { $, component$, useSignal, useStore, useTask$ } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";
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
import type { ContentCategory } from "../../../../drizzle_turso/schema/content_category";
import type { NewContentIndex } from "../../../../drizzle_turso/schema/content_index";
import { content_index } from "../../../../drizzle_turso/schema/content_index";
import type { NewCourseApproval } from "../../../../drizzle_turso/schema/course_approval";
import { course_approval } from "../../../../drizzle_turso/schema/course_approval";
import type { Tag } from "../../../../drizzle_turso/schema/tag";

const insertCourseApproval = server$(async (courseApproval: NewCourseApproval) => {
  await drizzleClient().insert(course_approval).values(courseApproval);
});

const insertCourse = server$(async (course: NewContentIndex) => {
  await drizzleClient().insert(content_index).values(course);
});

export default component$(() => {
  const user = useUserLoader().value;
  const formSteps = useSignal(0);
  const createdTags = useSignal<Tag[]>([]);
  const createdCategory = useSignal<ContentCategory>();
  const courseApproval = useStore<NewCourseApproval>({
    id: uuidv4(),
    link: "",
    ready_for_approval: false,
    added_tags: [],
    added_categories: "",
    status: "pending",
    description: "Default description generated from adding a new course.",
  });
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
    approval_id: null,
  });
  const courseDataError = useStore({
    name: "",
    chapter_order: "",
    description: "",
  });
  useTask$(({ track }) => {
    track(() => courseData.slug);
    courseData.link = `/courses/${courseData.slug}`;
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
      if (!courseData.is_private) {
        courseData.approval_id = courseApproval.id;
        await insertCourseApproval(courseApproval);
      }
      await insertCourse(courseData);
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
