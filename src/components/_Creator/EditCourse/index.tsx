import { $, component$, useSignal, useStore, useTask$ } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";
import { eq } from "drizzle-orm";
import Step1 from "~/components/_Creator/CreateCourse/step1";
import Step2 from "~/components/_Creator/CreateCourse/step2";
import Step3 from "~/components/_Creator/CreateCourse/step3";
import Step4 from "~/components/_Creator/CreateCourse/step4";
import Step5 from "~/components/_Creator/CreateCourse/step5";
import Step6 from "~/components/_Creator/CreateCourse/step6";
import Step7 from "~/components/_Creator/CreateCourse/step7";
import { useLoader } from "~/routes/[lang.]/(wrapper)/(authRoutes)/creator/edit-course/[id]/layout";
import { useUserLoader } from "~/routes/[lang.]/(wrapper)/(authRoutes)/layout";
import drizzleClient from "~/utils/drizzleClient";
import useWS from "~/utils/useWS";
import type { ContentCategory } from "../../../../drizzle_turso/schema/content_category";
import type { NewContentIndex } from "../../../../drizzle_turso/schema/content_index";
import { content_index } from "../../../../drizzle_turso/schema/content_index";
import type { NewCourseApproval } from "../../../../drizzle_turso/schema/course_approval";
import { course_approval } from "../../../../drizzle_turso/schema/course_approval";
import type { Tag } from "../../../../drizzle_turso/schema/tag";

const insertCourseApproval = server$(async (courseApproval: NewCourseApproval) => {
  await drizzleClient().insert(course_approval).values(courseApproval);
});

const updateCourseApproval = server$(async (courseApproval: NewCourseApproval) => {
  await drizzleClient()
    .update(course_approval)
    .set(courseApproval)
    .where(eq(course_approval.id, courseApproval.id));
});

const updateCourse = server$(async (course: NewContentIndex) => {
  await drizzleClient().update(content_index).set(course).where(eq(content_index.id, course.id));
});

const deleteCourseApproval = server$(async (courseApproval: NewCourseApproval) => {
  await drizzleClient().delete(course_approval).where(eq(course_approval.id, courseApproval.id));
});

export default component$(() => {
  const user = useUserLoader().value;
  const ws = useWS(user);
  const { course, approval } = useLoader().value;
  const formSteps = useSignal(0);
  const createdTags = useSignal<Tag[]>([]);
  const createdCategory = useSignal<ContentCategory>();
  const courseApproval = useStore<NewCourseApproval>(() => approval[0]);
  const prevCourseApproval = useSignal(!!approval);
  const courseData = useStore<NewContentIndex>(() => course[0]);
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
        if (!prevCourseApproval.value) await insertCourseApproval(courseApproval);
        else await updateCourseApproval(courseApproval);
      } else if (prevCourseApproval.value) await deleteCourseApproval(courseApproval);
      await updateCourse(courseData);
    } catch (e) {
      console.error(e);
      alert("Something went wrong! Please try again later or contact support.");
    }
    ws.value?.send(
      JSON.stringify({
        type: "editContentIndexDetails",
        courseId: courseData.id,
        details: courseData,
      })
    );
    window.close();
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
              isEditing={true}
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
            <Step6 courseData={courseData} formSteps={formSteps} isEditing={true} />
            <Step7
              courseData={courseData}
              formSteps={formSteps}
              handleSubmit={handleSubmit}
              createdTags={createdTags}
              createdCategory={createdCategory}
              isEditing={true}
            />
          </div>
        </div>
      </div>
    </main>
  );
});
