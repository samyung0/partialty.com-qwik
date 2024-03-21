import {
  $,
  component$,
  useOnWindow,
  useSignal,
  useStore,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";
import { and, eq } from "drizzle-orm";
import Step1 from "~/components/_Creator/CreateCourse/step1";
import Step1_2 from "~/components/_Creator/CreateCourse/step1_2";
import Step2 from "~/components/_Creator/CreateCourse/step2";
import Step3 from "~/components/_Creator/CreateCourse/step3";
import Step4 from "~/components/_Creator/CreateCourse/step4";
import Step5 from "~/components/_Creator/CreateCourse/step5";
import Step6 from "~/components/_Creator/CreateCourse/step6";
import Step7 from "~/components/_Creator/CreateCourse/step7";
import { useLoader } from "~/routes/[lang.]/(wrapper)/(authRoutes)/creator/edit-course/[id]/layout";
import { useCategories, useTags } from "~/routes/[lang.]/(wrapper)/(authRoutes)/creator/layout";
import { useUserLoader } from "~/routes/[lang.]/(wrapper)/(authRoutes)/layout";
import drizzleClient from "~/utils/drizzleClient";
import useWS from "~/utils/useWS";
import {
  content_category,
  type ContentCategory,
} from "../../../../drizzle_turso/schema/content_category";
import type { ContentIndex } from "../../../../drizzle_turso/schema/content_index";
import { content_index } from "../../../../drizzle_turso/schema/content_index";
import type { NewCourseApproval } from "../../../../drizzle_turso/schema/course_approval";
import { course_approval } from "../../../../drizzle_turso/schema/course_approval";
import { tag, type Tag } from "../../../../drizzle_turso/schema/tag";

import type { ResultSet } from "@libsql/client/.";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import type { SQLiteTransaction } from "drizzle-orm/sqlite-core";
import getSQLTimeStamp from "~/utils/getSQLTimeStamp";
import type schemaExport from "../../../../drizzle_turso/schemaExport";

type Tx = SQLiteTransaction<
  "async",
  ResultSet,
  typeof schemaExport,
  ExtractTablesWithRelations<typeof schemaExport>
>;

const updateCourseApproval = server$(async (tx: Tx, courseApproval: NewCourseApproval) => {
  await tx
    .update(course_approval)
    .set(courseApproval)
    .where(eq(course_approval.id, courseApproval.id));
});

const updateCourse = server$(async (tx: Tx, course: ContentIndex) => {
  await tx.update(content_index).set(course).where(eq(content_index.id, course.id));
});

const deleteTag = server$(async (tx: Tx, _tag: Tag) => {
  await tx.delete(tag).where(and(eq(tag.id, _tag.id), eq(tag.approved, false)));
});

const insertTag = server$(async (tx: Tx, _tag: Tag) => {
  await tx.insert(tag).values(_tag);
});

const deleteCategory = server$(async (tx: Tx, _category: ContentCategory) => {
  await tx
    .delete(content_category)
    .where(and(eq(content_category.id, _category.id), eq(content_category.approved, false)));
});

const addTagContentIndex = server$(async (tx: Tx, contentIndexId: string, tagId: string) => {
  const content_index_id = (
    await tx.select({ content_index_id: tag.content_index_id }).from(tag).where(eq(tag.id, tagId))
  )[0].content_index_id;
  content_index_id.push(contentIndexId);
  await tx.update(tag).set({ content_index_id: content_index_id }).where(eq(tag.id, tagId));
});

const removeTagContentIndex = server$(async (tx: Tx, contentIndexId: string, tagId: string) => {
  const content_index_id = (
    await tx.select({ content_index_id: tag.content_index_id }).from(tag).where(eq(tag.id, tagId))
  )[0].content_index_id;
  const index = content_index_id.indexOf(contentIndexId);
  if (index >= 0) content_index_id.splice(index, 1);
  await tx.update(tag).set({ content_index_id: content_index_id }).where(eq(tag.id, tagId));
});

const addCategoryContentIndex = server$(
  async (tx: Tx, contentIndexId: string, categoryId: string) => {
    const content_index_id = (
      await tx
        .select({ content_index_id: content_category.content_index_id })
        .from(content_category)
        .where(eq(content_category.id, categoryId))
    )[0].content_index_id;
    content_index_id.push(contentIndexId);
    await tx
      .update(content_category)
      .set({ content_index_id: content_index_id })
      .where(eq(content_category.id, categoryId));
  }
);

const removeCategoryContentIndex = server$(
  async (tx: Tx, contentIndexId: string, categoryId: string) => {
    const content_index_id = (
      await tx
        .select({ content_index_id: content_category.content_index_id })
        .from(content_category)
        .where(eq(content_category.id, categoryId))
    )[0].content_index_id;
    const index = content_index_id.indexOf(contentIndexId);
    if (index >= 0) content_index_id.splice(index, 1);
    await tx
      .update(content_category)
      .set({ content_index_id: content_index_id })
      .where(eq(content_category.id, categoryId));
  }
);

const handleCourseUpdate = server$(async function (
  courseApproval: NewCourseApproval,
  prevCourseApproval: NewCourseApproval,
  course: ContentIndex,
  prevCourse: ContentIndex,
  category: ContentCategory | undefined,
  tags: Tag[],
  prevCategory: ContentCategory | undefined,
  prevTags: Tag[]
) {
  return await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === "1").transaction(async (tx) => {
    if (category && course.category !== category.id) courseApproval.added_categories = null;
    if (course.tags && courseApproval.added_tags) {
      for (let i = courseApproval.added_tags!.length - 1; i >= 0; i--) {
        if (!course.tags!.includes(courseApproval.added_tags![i]))
          courseApproval.added_tags!.splice(i, 1);
      }
    }
    await updateCourseApproval(tx, { ...courseApproval, updated_at: getSQLTimeStamp() });
    if (prevCategory && prevCourseApproval.added_categories !== courseApproval.added_categories) {
      await deleteCategory(tx, prevCategory);
    }
    if (
      prevCourse.category &&
      prevCourse.category !== prevCourseApproval.added_categories &&
      prevCourse.category !== course.category
    ) {
      await removeCategoryContentIndex(tx, course.id, prevCourse.category);
    }
    if (
      category &&
      courseApproval.added_categories &&
      course.category === category.id &&
      prevCourseApproval.added_categories !== courseApproval.added_categories
    ) {
      await tx.insert(content_category).values(category);
    }
    if (
      course.category &&
      courseApproval.added_categories !== course.category &&
      prevCourse.category !== course.category
    ) {
      await addCategoryContentIndex(tx, course.id, course.category);
    }
    for (let i = 0; i < prevCourseApproval.added_tags!.length; i++) {
      if (
        !course.tags!.includes(prevCourseApproval.added_tags![i]) &&
        prevTags.find((t) => t.id === prevCourseApproval.added_tags![i])
      ) {
        await deleteTag(tx, prevTags.find((t) => t.id === prevCourseApproval.added_tags![i])!);
      }
    }
    for (let i = 0; i < courseApproval.added_tags!.length; i++) {
      if (
        !prevCourseApproval.added_tags!.includes(courseApproval.added_tags![i]) &&
        tags.find((t) => t.id === courseApproval.added_tags![i])
      ) {
        await insertTag(tx, tags.find((t) => t.id === courseApproval.added_tags![i])!);
      }
    }
    for (let i = 0; i < prevCourse.tags!.length; i++) {
      if (
        !course.tags!.includes(prevCourse.tags![i]) &&
        !prevTags.find((t) => t.id === prevCourse.tags![i]) &&
        !prevCourseApproval.added_tags!.find((t) => t === prevCourse.tags![i])
      ) {
        await removeTagContentIndex(tx, course.id, prevCourse.tags![i]);
      }
    }
    for (let i = 0; i < course.tags!.length; i++) {
      if (
        !prevCourse.tags!.includes(course.tags![i]) &&
        !tags.find((t) => t.id === course.tags![i]) &&
        !courseApproval.added_tags!.find((t) => t === course.tags![i])
      ) {
        await addTagContentIndex(tx, course.id, course.tags![i]);
      }
    }
    return await updateCourse(tx, { ...course, updated_at: getSQLTimeStamp() });
  });
});

export default component$(() => {
  const user = useUserLoader().value;
  const contentWS = useWS(user, {
    onOpen$: $((ws, useTimeStamp) => {
      ws.send(
        JSON.stringify({
          type: "init",
          userId: useTimeStamp,
          accessible_courses: [],
        })
      );
    }),
  });
  const ws = contentWS.contentWS;
  const { course, approval } = useLoader().value;
  const tags = useTags().value;
  const categories = useCategories().value;
  const formSteps = useSignal(0);
  const createdTags = useStore<Tag[]>(() =>
    approval[0].added_tags
      ? (approval[0].added_tags
          .map((tagId) => tags.find((t) => t.id === tagId))
          .filter((x) => x) as Tag[])
      : []
  );
  const prevCreatedTags = useSignal(JSON.parse(JSON.stringify(createdTags)));
  const createdCategory = useSignal<ContentCategory | undefined>(() =>
    approval[0].added_categories === course[0].category
      ? categories.find((tag) => tag.id === course[0].category)
      : undefined
  );
  const prevCreatedCategory = useSignal(createdCategory.value);
  const courseApproval = useStore<NewCourseApproval>(() => approval[0]);
  const prevCourseApproval = useSignal(JSON.parse(JSON.stringify(courseApproval)));
  const courseData = useStore<ContentIndex>(() => course[0]);
  const prevCourseData = useSignal(JSON.parse(JSON.stringify(courseData)));
  const courseDataError = useStore({
    name: "",
    chapter_order: "",
    description: "",
    short_description: "",
  });
  useTask$(({ track }) => {
    track(() => courseData.slug);
    courseData.link = `/courses/${courseData.slug}`;
  });
  useTask$(({ track }) => {
    track(createdTags);
    courseApproval.added_tags = createdTags.map((tag) => tag.id);
  });
  useTask$(({ track }) => {
    track(createdCategory);
    if (createdCategory.value) courseApproval.added_categories = createdCategory.value.id;
    else courseApproval.added_categories = null;
  });

  const handleSubmit = $(async () => {
    try {
      await handleCourseUpdate(
        courseApproval,
        prevCourseApproval.value,
        courseData,
        prevCourseData.value,
        createdCategory.value,
        createdTags,
        prevCreatedCategory.value,
        prevCreatedTags.value
      );
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
    // window.close();
  });
  const ref = useSignal<HTMLDivElement>();
  useVisibleTask$(({ track }) => {
    track(formSteps);
    track(ref);
    if (ref.value) {
      ref.value.style.transform = `translate3d(-${
        formSteps.value * (window.innerWidth < 768 ? 95 : 80)
      }vw, 0, 0)`;
    }
  });
  useOnWindow(
    "resize",
    $(() => {
      if (ref.value) {
        ref.value.style.transform = `translate3d(-${
          formSteps.value * (window.innerWidth < 768 ? 95 : 80)
        }vw, 0, 0)`;
      }
    })
  );

  return (
    <main class="flex h-[100vh] items-center justify-center overflow-hidden bg-sherbet dark:bg-primary-dark-gray dark:text-background-light-gray">
      <div class="w-[95vw] overflow-hidden md:w-[80vw]">
        <div>
          <div
            class="flex w-[760vw] transition-transform md:w-[640vw]"
            style={{
              transform: `translate3d(0, 0, 0)`,
            }}
            ref={ref}
          >
            <Step1
              courseData={courseData}
              courseDataError={courseDataError}
              formSteps={formSteps}
              isEditing={true}
            />
            <Step1_2
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
