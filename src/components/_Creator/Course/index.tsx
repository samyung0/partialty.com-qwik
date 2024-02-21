import type { NoSerialize, QRL, Signal } from "@builder.io/qwik";
import { $, component$, useComputed$, useSignal, useStore, useTask$ } from "@builder.io/qwik";
import { Link, server$, z } from "@builder.io/qwik-city";
import { FaPenToSquareRegular, FaSlidersSolid, FaTrashSolid } from "@qwikest/icons/font-awesome";
import { IoCaretDown } from "@qwikest/icons/ionicons";
import { LuArrowRight, LuEye, LuEyeOff, LuGem, LuLock, LuUnlock, LuX } from "@qwikest/icons/lucide";
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

import LoadingSVG from "~/components/LoadingSVG";
import { useUserLoader } from "~/routes/[lang.]/(wrapper)/(authRoutes)/layout";
import drizzleClient from "~/utils/drizzleClient";
import getSQLTimeStamp from "~/utils/getSQLTimeStamp";
import type { Content, NewContent } from "../../../../drizzle_turso/schema/content";
import { content } from "../../../../drizzle_turso/schema/content";
import type { ContentCategory } from "../../../../drizzle_turso/schema/content_category";
import { content_index, type ContentIndex } from "../../../../drizzle_turso/schema/content_index";
import { type Profiles } from "../../../../drizzle_turso/schema/profiles";
import type { Tag } from "../../../../drizzle_turso/schema/tag";
import { displayNamesLang, listSupportedLang } from "../../../../lang";

const getChapters = server$(async (courseId: string) => {
  return await drizzleClient().select().from(content).where(eq(content.index_id, courseId));
});

const deleteCourse = server$(async (courseId: string) => {
  await drizzleClient().transaction(async (tx) => {
    await tx
      .update(content_index)
      .set({ is_deleted: true, updated_at: getSQLTimeStamp() })
      .where(eq(content_index.id, courseId));
    // DO NOT DELETE the course, it will fail due to foreign key constraints, instead set the delete flag
  });
});

const deleteChapter = server$(async (chapterId: string) => {
  await drizzleClient().transaction(async (tx) => {
    await tx
      .update(content)
      .set({ is_deleted: true, updated_at: getSQLTimeStamp() })
      .where(eq(content.id, chapterId));
    // DO NOT DELETE the course, it will fail due to foreign key constraints, instead set the delete flag
  });
});

const createChapter = server$(async (newChapter: NewContent, chapter_order: string[]) => {
  return await drizzleClient().transaction(async (tx) => {
    await tx
      .update(content_index)
      .set({ chapter_order, updated_at: getSQLTimeStamp() })
      .where(eq(content_index.id, newChapter.index_id));
    return await tx.insert(content).values(newChapter).returning();
  });
});

const checkExistingChapter = server$(async (slug: string, courseId: string) => {
  return await drizzleClient()
    .select({ id: content.id })
    .from(content)
    .where(and(eq(content.slug, slug), eq(content.index_id, courseId)));
});

const checkExistingChapterLink = server$(async (link: string) => {
  return await drizzleClient()
    .select({ id: content.id })
    .from(content)
    .where(eq(content.link, link));
});

const addCategorySchema = z.object({
  name: z.string().min(1, "A name is required").max(35, "Name is too long (max. 35 chars)"),
  slug: z
    .string()
    .min(1, "A slug is required")
    .regex(/^[a-za-z0-9]+.*[a-za-z0-9]+$/, "The slug must start and end with characters!")
    .regex(
      /^[a-za-z0-9]+[-a-za-z0-9]*[a-za-z0-9]+$/,
      "No special characters except hyphens are allowed"
    ),
  link: z
    .string()
    .min(1, "A link is required")
    .regex(/^\//, "The link needs to start with a slash")
    .regex(/^\/[a-za-z0-9]+[-/a-za-z0-9]*$/, "No special characters except -/ are allowed"),
});

export const AddChapter = component$(
  ({
    showAddChapter,
    courseId,
    courseChapters,
    courseSlug,
    callBackOnCreate,
  }: {
    showAddChapter: Signal<boolean>;
    courseId: Signal<string>;
    courseChapters: Signal<string[]>;
    courseSlug: Signal<string>;
    callBackOnCreate: QRL<(course: Content) => any>;
  }) => {
    const id = useSignal(uuidv4());
    const user = useUserLoader().value;
    const formData = useStore<NewContent>({
      id: id.value,
      name: "",
      slug: "",
      link: `/courses/${courseSlug.value}/chapters/`,
      index_id: courseId.value,
      renderedHTML: null,
      content_slate: null,
      is_locked: false,
      is_premium: false,
      audio_track_playback_id: null,
      audio_track_asset_id: null,
    });
    const formError = useStore({
      name: "",
      slug: "",
      link: "",
    });
    const ref = useSignal<HTMLInputElement>();
    const ref2 = useSignal<HTMLInputElement>();
    const loading = useSignal(false);

    const handleSubmit = $(async () => {
      if (loading.value) return;
      loading.value = true;
      formError.name = "";
      formError.slug = "";
      formError.link = "";
      const result = addCategorySchema.safeParse(formData);
      if (!result.success) {
        formError.name = result.error.formErrors.fieldErrors.name?.join("\n") || "";
        formError.slug = result.error.formErrors.fieldErrors.slug?.join("\n") || "";
        formError.link = result.error.formErrors.fieldErrors.link?.join("\n") || "";
        loading.value = false;
        return;
      }
      if (
        !formData.link!.startsWith("/courses") &&
        !window.confirm("Are you sure you want to use a custom link?")
      ) {
        loading.value = false;
        return;
      }
      const dup = await checkExistingChapter(formData.slug, courseId.value);
      if (dup.length > 0) {
        formError.slug = "Slug already exists!";
        loading.value = false;
        return;
      }
      const dup2 = await checkExistingChapterLink(formData.link!);
      if (dup2.length > 0) {
        formError.link = "Link already exists!";
        loading.value = false;
        return;
      }
      try {
        const chapter = await createChapter(formData, [...courseChapters.value, id.value]);
        await callBackOnCreate(chapter[0]);
        loading.value = false;
        showAddChapter.value = false;
      } catch (e) {
        console.error(e);
        loading.value = false;
        showAddChapter.value = false;
        alert("An error occured. Please try refreshing the page or contact support.");
        return;
      }
    });
    return (
      <div class="z-100 fixed left-0 top-0 flex h-[100vh] w-full items-center justify-center backdrop-blur-sm">
        <div class="relative flex w-[40vw] min-w-[400px] max-w-[600px] flex-col items-center justify-center gap-3 rounded-lg border-2 border-black bg-white py-16 dark:bg-highlight-dark">
          <button
            onClick$={() => (showAddChapter.value = false)}
            class="absolute right-5 top-5 block p-1 text-[20px] text-primary-dark-gray dark:text-background-light-gray"
          >
            <LuX />
          </button>
          <h2 class="pb-6 text-center font-mosk text-[2rem] font-bold tracking-wider">
            Add Chapter
          </h2>
          <form preventdefault:submit onsubmit$={() => handleSubmit()}>
            <div>
              <label for="categoryName" class="cursor-pointer text-lg">
                Name
              </label>
              <div class="pt-1">
                <input
                  id="categoryName"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onInput$={(_, el) => {
                    formData.name = el.value;
                    formData.slug = el.value.toLowerCase().replace(/ /g, "-");
                    formData.link = `/courses/${courseSlug.value}/chapters/${formData.slug}/`;
                    if (ref.value) ref.value.scrollLeft += 99999;
                    if (ref2.value) ref2.value.scrollLeft += 99999;
                  }}
                  required
                  class={
                    "w-[300px] rounded-md border-2 px-3 py-2 dark:border-background-light-gray  dark:bg-highlight-dark dark:text-background-light-gray dark:disabled:border-disabled-dark dark:disabled:bg-disabled-dark " +
                    (formError.name ? "border-tomato dark:border-tomato" : "border-black/10")
                  }
                />
              </div>
              <p class="w-[300px] whitespace-pre-wrap break-words pt-1 tracking-wide text-tomato">
                {formError.name}
              </p>
            </div>
            <div>
              <label for="categorySlug" class="cursor-pointer text-lg">
                Slug
              </label>
              <div class="pt-1">
                <input
                  ref={ref}
                  id="categorySlug"
                  name="slug"
                  type="text"
                  disabled={user.role !== "admin"}
                  value={formData.slug}
                  onInput$={(_, el) => {
                    formData.slug = el.value;
                  }}
                  required
                  class={
                    "w-[300px] rounded-md border-2 px-3 py-2 dark:border-background-light-gray  dark:bg-highlight-dark dark:text-background-light-gray dark:disabled:border-disabled-dark dark:disabled:bg-disabled-dark " +
                    (formError.slug ? "border-tomato dark:border-tomato" : "border-black/10")
                  }
                />
              </div>
              <p class="w-[300px] whitespace-pre-wrap break-words pt-1 tracking-wide text-tomato">
                {formError.slug}
              </p>
            </div>
            <div>
              <label for="categorLink" class="cursor-pointer text-lg">
                Link
              </label>
              <div class="pt-1">
                <input
                  ref={ref2}
                  id="categorLink"
                  name="link"
                  type="text"
                  disabled={user.role !== "admin"}
                  value={formData.link}
                  onInput$={(_, el) => {
                    formData.link = el.value;
                  }}
                  required
                  class={
                    "w-[300px] rounded-md border-2 px-3 py-2 dark:border-background-light-gray  dark:bg-highlight-dark dark:text-background-light-gray dark:disabled:border-disabled-dark dark:disabled:bg-disabled-dark " +
                    (formError.link ? "border-tomato dark:border-tomato" : "border-black/10")
                  }
                />
              </div>
              <p class="w-[300px] whitespace-pre-wrap break-words pt-1 tracking-wide text-tomato">
                {formError.link}
              </p>
            </div>
            {user.role === "admin" && (
              <>
                <br />
                <div>
                  <label
                    title="The course is only accessible to subscribed users if checked."
                    for="subscriptionRequired"
                    class="flex cursor-pointer items-center gap-5   text-lg"
                  >
                    <span class="flex items-center gap-2">
                      <span class="text-[20px] text-primary-dark-gray dark:text-background-light-gray">
                        <LuGem />
                      </span>
                      Subscription Required
                    </span>
                    <input
                      id="subscriptionRequired"
                      type="checkbox"
                      class="h-4 w-4"
                      checked={formData.is_premium}
                      onChange$={(e, currentTarget) =>
                        (formData.is_premium = currentTarget.checked)
                      }
                    />
                  </label>
                </div>
                <br />
              </>
            )}
            <br />
            <button
              type="submit"
              class="block w-[300px] rounded-lg bg-primary-dark-gray p-4 text-background-light-gray dark:bg-primary-dark-gray"
            >
              {loading.value && (
                <span>
                  <LoadingSVG />
                </span>
              )}
              {!loading.value && <span>Submit</span>}
            </button>
          </form>
        </div>
      </div>
    );
  }
);

export default component$(
  ({
    ws,
    userAccessibleCourseWrite,
    userAccessibleCourseWriteResolved,
    tags,
    categories,
    courseIdToEditingUser,
  }: {
    ws: Signal<NoSerialize<WebSocket>>;
    userAccessibleCourseWrite: string[];
    userAccessibleCourseWriteResolved: { content_index: ContentIndex; profiles: Profiles }[];
    tags: Tag[];
    categories: ContentCategory[];
    courseIdToEditingUser: Record<string, [string, string]>;
  }) => {
    const user = useUserLoader().value;

    const courses = useStore(() =>
      Object.fromEntries(
        userAccessibleCourseWriteResolved.map(({ content_index, profiles }) => {
          return [
            content_index.id,
            Object.assign({}, content_index, {
              isOpen: false,
              chapters: [] as Content[],
              isLoadingChapter: false,
              hasLoadedChapter: false,
              profile: profiles,
              chaptersMap: {} as Record<string, { isDeleting: boolean }>,
            }),
          ];
        })
      )
    );
    const displayCourses = useComputed$(() =>
      Object.values(courses).toSorted(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
    );

    const isDeletingChapter = useSignal("");
    const isDeletingChapterCallback = useSignal<QRL<() => any> | undefined>(undefined);
    const isDeletingChapterTimeout = useSignal<any>();

    const isDeletingChapterIndex = useSignal("");
    const isDeletingChapterIndexCallback = useSignal<QRL<() => any> | undefined>(undefined);
    const isDeletingChapterIndexTimeout = useSignal<any>();

    const showAddChapter = useSignal(false);
    const showAddCourseId = useSignal("");
    const showAddCourseChapters = useComputed$<string[]>(() =>
      showAddCourseId.value === "" ? [] : courses[showAddCourseId.value].chapter_order
    );
    const showAddCourseSlug = useComputed$<string>(() =>
      showAddCourseId.value === "" ? "" : courses[showAddCourseId.value].slug
    );

    useTask$(({ track }) => {
      track(ws);
      if (!ws.value) return;

      ws.value.addEventListener("message", ({ data }) => {
        try {
          const d = JSON.parse(data);
          if (d.type === "deleteContentSuccess") {
            if (!isDeletingChapterCallback.value) return;
            isDeletingChapterCallback.value();
            isDeletingChapterCallback.value = undefined;
            clearTimeout(isDeletingChapterTimeout.value);
            return;
          }
          if (d.type === "deleteContentError") {
            alert(d.message);
            isDeletingChapter.value = "";
            isDeletingChapterCallback.value = undefined;
            clearTimeout(isDeletingChapterTimeout.value);
            return;
          }
          if (d.type === "deleteContentIndexSuccess") {
            if (!isDeletingChapterIndexCallback.value) return;
            isDeletingChapterIndexCallback.value();
            isDeletingChapterIndexCallback.value = undefined;
            clearTimeout(isDeletingChapterIndexTimeout.value);
            return;
          }
          if (d.type === "deleteContentIndexError") {
            alert(d.message);
            isDeletingChapterIndex.value = "";
            isDeletingChapterIndexCallback.value = undefined;
            clearTimeout(isDeletingChapterIndexTimeout.value);
            return;
          }
          if (d.type === "contentIndexDeleted") {
            if (isDeletingChapterIndexCallback.value) {
              const t = isDeletingChapterIndexCallback.value;
              isDeletingChapterIndexCallback.value = $(async () => {
                await t();
                delete courses[d.message.courseId];
              });
            } else delete courses[d.message.courseId];
            return;
          }
        } catch (e) {
          console.error(e);
        }
      });
    });

    const handleDeleteContentIndex = $(async (courseId: string) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!courses[courseId])
        return alert("Something went wrong! Please refresh the page and try again.");
      if (!window.confirm("Are you sure you want to delete this course?")) return;
      if (isDeletingChapterIndex.value || !ws.value) return;
      isDeletingChapterIndex.value = courseId;
      isDeletingChapterIndexCallback.value = $(async () => {
        try {
          await deleteCourse(courseId);
        } catch (e) {
          console.error(e);
          return alert(
            "An error occurred! Please refresh the page and try again or contact support."
          );
        }
        isDeletingChapterIndex.value = "";
      });
      isDeletingChapterIndexTimeout.value = setTimeout(() => {
        alert("Server Timeout! Please try again later or contact support.");
        isDeletingChapterIndexCallback.value = undefined;
        isDeletingChapterIndex.value = "";
      }, 7000);
      ws.value.send(
        JSON.stringify({
          type: "deleteContentIndex",
          userId: user.userId,
          courseId,
          contentId: courses[courseId].chapter_order,
        })
      );
    });

    const refreshChapters = $((id: string) => {
      courses[id].isLoadingChapter = true;
      getChapters(id).then((chapters) => {
        courses[id].chapters = chapters;
        courses[id].chaptersMap = Object.fromEntries(
          chapters.map((c) => [
            c.id,
            {
              isDeleting: false,
            },
          ])
        );
        courses[id].isLoadingChapter = false;
        courses[id].hasLoadedChapter = true;
      });
    });

    return (
      <>
        {showAddChapter.value && showAddCourseId.value && (
          <AddChapter
            showAddChapter={showAddChapter}
            courseId={showAddCourseId}
            courseChapters={showAddCourseChapters}
            courseSlug={showAddCourseSlug}
            callBackOnCreate={$((chapter) => {
              courses[showAddCourseId.value].chapter_order.push(chapter.id);
              refreshChapters(showAddCourseId.value);
            })}
          />
        )}
        <div class="mx-auto flex w-[80%] flex-col">
          <h1 class="font-mosk text-3xl font-bold tracking-wide">Your Courses</h1>
          <div class="mt-3 h-[2px] w-full bg-primary-dark-gray dark:bg-background-light-gray"></div>
          <div class="mt-6">
            <Link
              href={"/creator/create-course/"}
              class="inline-block rounded-lg bg-primary-dark-gray px-6 py-3 text-background-light-gray shadow-lg dark:bg-highlight-dark "
            >
              Create New Course
            </Link>
          </div>
          <section>
            {!ws.value && (
              <span class="mt-6 inline-block">
                <LoadingSVG />
              </span>
            )}
            {ws.value && (
              <>
                {displayCourses.value.length === 0 && (
                  <p class="mt-6">You have not created any courses yet. ヾ(•ω•`)o</p>
                )}
                {displayCourses.value.length > 0 && (
                  <ul class="flex flex-col gap-2 py-6">
                    {displayCourses.value.map((currentCourse) => {
                      return (
                        <li
                          class={
                            "flex flex-col rounded-xl border-2 border-primary-dark-gray bg-background-light-gray px-6 py-3 dark:bg-highlight-dark dark:text-background-light-gray"
                          }
                          key={`currentCourses${currentCourse.slug}`}
                        >
                          <div
                            onClick$={() => {
                              courses[currentCourse.id].isOpen = !courses[currentCourse.id].isOpen;
                              if (courses[currentCourse.id].hasLoadedChapter) return;
                              refreshChapters(currentCourse.id);
                            }}
                            class="flex cursor-pointer items-center justify-between"
                          >
                            <div class="flex flex-col gap-1">
                              <h2 class="text-lg tracking-wide">
                                {courses[currentCourse.id].name}
                              </h2>
                              <p class="flex items-center gap-2">
                                <span class="text-sm tracking-wide">
                                  {new Date(courses[currentCourse.id].updated_at).toDateString()},{" "}
                                  {
                                    displayNamesLang[
                                      courses[currentCourse.id]
                                        .lang as keyof typeof displayNamesLang
                                    ]
                                  }
                                </span>
                                <span>
                                  <img
                                    src={currentCourse.profile.avatar_url}
                                    alt=""
                                    width={20}
                                    height={20}
                                    class="rounded-full"
                                  />
                                </span>
                              </p>
                            </div>
                            <div class="flex items-center gap-2">
                              <div>
                                {currentCourse.is_single_page && (
                                  <button class="rounded-lg bg-primary-dark-gray px-6 py-3 text-background-light-gray shadow-md">
                                    Edit Content
                                  </button>
                                )}
                                {!currentCourse.is_single_page && (
                                  <button
                                    onClick$={(e) => {
                                      e.stopPropagation();
                                      showAddChapter.value = true;
                                      showAddCourseId.value = currentCourse.id;
                                    }}
                                    class="rounded-lg bg-primary-dark-gray px-6 py-3 text-background-light-gray shadow-md"
                                  >
                                    Add Chapter
                                  </button>
                                )}
                              </div>
                              <button class="p-2">
                                <span
                                  style={{
                                    transform: courses[currentCourse.id].isOpen
                                      ? "rotateZ(180deg)"
                                      : "",
                                  }}
                                  class={
                                    "inline-block text-[15px] text-primary-dark-gray dark:text-background-light-gray"
                                  }
                                >
                                  <IoCaretDown />
                                </span>
                              </button>
                            </div>
                          </div>
                          {!courses[currentCourse.id].link && (
                            <p>
                              Yo! This course does not have a link. It won't be visible to anyone.
                            </p>
                          )}
                          <div class="mt-6 flex items-center gap-3">
                            <a
                              target="_blank"
                              href={`/creator/edit-course/${currentCourse.id}/`}
                              class="flex gap-2 self-start"
                            >
                              <span class="border-b-2 border-primary-dark-gray dark:border-background-light-gray">
                                Edit Details
                              </span>
                              <span class="text-[15px] text-primary-dark-gray dark:text-background-light-gray">
                                <LuArrowRight />
                              </span>
                            </a>
                            {courses[currentCourse.id].link && (
                              <a
                                target="_blank"
                                href={courses[currentCourse.id].link!}
                                class="flex gap-2 self-start"
                              >
                                <span class="border-b-2 border-primary-dark-gray dark:border-background-light-gray">
                                  View Course
                                </span>
                                <span class="text-[15px] text-primary-dark-gray dark:text-background-light-gray">
                                  <LuArrowRight />
                                </span>
                              </a>
                            )}
                          </div>
                          {courses[currentCourse.id].isOpen ? (
                            courses[currentCourse.id].isLoadingChapter ? (
                              <span class="mt-6">
                                <LoadingSVG />
                              </span>
                            ) : (
                              <>
                                <div class="mt-6 flex gap-4 pb-2">
                                  <h3 class="w-[30%]">Author:</h3>
                                  <p class={`w-[70%]`}>
                                    <span class="flex items-center gap-2">
                                      <span>
                                        <img
                                          src={currentCourse.profile.avatar_url}
                                          alt=""
                                          width={30}
                                          height={30}
                                          class="rounded-full"
                                        />
                                      </span>
                                      <span>{currentCourse.profile.nickname}</span>
                                    </span>
                                  </p>
                                </div>
                                <div class="flex gap-4 pb-2">
                                  <h3 class="w-[30%]">Course Language:</h3>
                                  <p class={`w-[70%]`}>
                                    {
                                      listSupportedLang.find(
                                        (lang) => lang.value === courses[currentCourse.id].lang
                                      )!.label
                                    }
                                  </p>
                                </div>
                                <div class="flex gap-4 pb-2">
                                  <h3 class="w-[30%]">Supported Languages:</h3>
                                  <p class={`w-[70%]`}>
                                    {courses[currentCourse.id].supported_lang
                                      .filter((_lang) =>
                                        listSupportedLang.find(({ value }) => value === _lang)
                                      )
                                      .map(
                                        (_lang) =>
                                          listSupportedLang.find((lang) => lang.value === _lang)!
                                            .label
                                      )
                                      .join(", ")}
                                  </p>
                                </div>
                                <div class="flex gap-4 pb-2">
                                  <h3 class="w-[30%]">Created At:</h3>
                                  <p class={`w-[70%]`}>
                                    {new Date(currentCourse.created_at).toDateString()}
                                  </p>
                                </div>
                                <div class="flex gap-4 pb-2">
                                  <h3 class="w-[30%]">Updated At:</h3>
                                  <p class={`w-[70%]`}>
                                    {new Date(courses[currentCourse.id].updated_at).toDateString()}
                                  </p>
                                </div>

                                {courses[currentCourse.id].category && (
                                  <div class="flex gap-4 pb-2">
                                    <h3 class="w-[30%]">Category:</h3>
                                    <p class={`w-[70%]`}>
                                      {categories.find(
                                        (category) =>
                                          category.id === courses[currentCourse.id].category
                                      ) && (
                                        <a
                                          target="_blank"
                                          href={
                                            categories.find(
                                              (category) =>
                                                category.id === courses[currentCourse.id].category
                                            )!.link
                                          }
                                          class={`border-b-2 border-primary-dark-gray dark:border-background-light-gray`}
                                        >
                                          {
                                            categories.find(
                                              (category) =>
                                                category.id === courses[currentCourse.id].category
                                            )!.name
                                          }
                                        </a>
                                      )}
                                    </p>
                                  </div>
                                )}

                                {courses[currentCourse.id].tags && (
                                  <div class="flex gap-4 pb-2">
                                    <h3 class="w-[30%]">Tags:</h3>
                                    <ul class="flex w-[70%] flex-wrap gap-x-4 gap-y-2">
                                      {(courses[currentCourse.id].tags || [])
                                        .filter((tag) => tags.find((tag2) => tag2.id === tag))
                                        .map((tag) => (
                                          <li key={`Course${currentCourse.id}Tag${tag}`}>
                                            <a
                                              target="_blank"
                                              class="border-b-2 border-primary-dark-gray dark:border-background-light-gray"
                                              href={tags.find((tag2) => tag2.id === tag)!.link}
                                            >
                                              {tags.find((tag2) => tag2.id === tag)!.name}
                                            </a>
                                          </li>
                                        ))}
                                    </ul>
                                  </div>
                                )}

                                <div
                                  class="mt-6 flex gap-4 pb-2"
                                  title="Checks if the course is visible to everyone."
                                >
                                  <p class="flex items-center gap-2">
                                    {courses[currentCourse.id].is_private && (
                                      <span class="text-[20px] text-primary-dark-gray dark:text-background-light-gray">
                                        <LuEyeOff />
                                      </span>
                                    )}
                                    {!courses[currentCourse.id].is_private && (
                                      <span class="text-[20px] text-primary-dark-gray dark:text-background-light-gray">
                                        <LuEye />
                                      </span>
                                    )}
                                    <span>
                                      {courses[currentCourse.id].is_private
                                        ? "Only people with invite codes can view"
                                        : "Open to everyone"}
                                    </span>
                                  </p>
                                </div>

                                {user.role === "admin" && (
                                  <div
                                    class="flex gap-4 pb-2"
                                    title="Checks if a subscription is needed to read the course content."
                                  >
                                    <p class="flex items-center gap-2">
                                      <span
                                        class={
                                          "text-[20px] " +
                                          (courses[currentCourse.id].is_premium
                                            ? "text-pink"
                                            : "text-gray-300")
                                        }
                                      >
                                        <LuGem />
                                      </span>
                                      <span>
                                        {courses[currentCourse.id].is_premium
                                          ? "Subscription Required"
                                          : "Subscrtiption Not Required"}
                                      </span>
                                    </p>
                                  </div>
                                )}

                                <div
                                  class="flex gap-4 pb-2"
                                  title="If a course is locked, the content cannot be edited."
                                >
                                  <p class="flex items-center gap-2">
                                    <span
                                      class={
                                        "text-[20px] text-primary-dark-gray dark:text-background-light-gray"
                                      }
                                    >
                                      {courses[currentCourse.id].is_locked ? (
                                        <LuLock />
                                      ) : (
                                        <LuUnlock />
                                      )}
                                    </span>
                                    <span>
                                      {courses[currentCourse.id].is_locked
                                        ? "Content is Locked"
                                        : "Content is unlocked"}
                                    </span>
                                  </p>
                                </div>

                                <div class="mt-6 flex gap-4 py-2">
                                  <h3 class="w-[30%]">Description:</h3>
                                  <p class={`w-[80%]`}>{courses[currentCourse.id].description}</p>
                                </div>

                                {courses[currentCourse.id].is_single_page && (
                                  <Link href={""} class="mt-6">
                                    <span class="border-b-2 border-primary-dark-gray dark:border-background-light-gray">
                                      Edit Content
                                    </span>
                                  </Link>
                                )}
                                {!courses[currentCourse.id].is_single_page &&
                                  courses[currentCourse.id].isLoadingChapter && (
                                    <span>
                                      <LoadingSVG />
                                    </span>
                                  )}
                                {!courses[currentCourse.id].is_single_page &&
                                  courses[currentCourse.id].hasLoadedChapter && (
                                    <ul class="flex flex-col gap-4 py-4">
                                      {courses[currentCourse.id].chapter_order.map((_chapterId) => {
                                        const chapter = courses[currentCourse.id].chapters.find(
                                          (c) => c.id === _chapterId
                                        );
                                        if (!chapter || chapter.is_deleted) return null;
                                        return (
                                          <li
                                            key={`Course${currentCourse.id}Chapter${chapter.id}`}
                                            class="flex items-center justify-between"
                                          >
                                            <h2 class="border-b-2 border-primary-dark-gray dark:border-background-light-gray">
                                              <Link href={chapter.link || undefined}>
                                                {chapter.name}
                                              </Link>
                                            </h2>
                                            <div class="flex items-center gap-2 text-[20px] text-primary-dark-gray dark:text-background-light-gray">
                                              <button class="p-1">
                                                <FaPenToSquareRegular />
                                              </button>
                                              <button class="p-1">
                                                <FaSlidersSolid />
                                              </button>
                                              <button
                                                onClick$={async () => {
                                                  if (
                                                    !window.confirm(
                                                      "Are you sure you want to delete this chapter?"
                                                    )
                                                  )
                                                    return;
                                                  courses[currentCourse.id].chaptersMap[
                                                    chapter.id
                                                  ].isDeleting = true;
                                                  await deleteChapter(chapter.id);
                                                  courses[currentCourse.id].chaptersMap[
                                                    chapter.id
                                                  ].isDeleting = false;
                                                  refreshChapters(currentCourse.id);
                                                }}
                                                class="rounded-sm bg-tomato p-1 text-background-light-gray"
                                              >
                                                {courses[currentCourse.id].chaptersMap[chapter.id]
                                                  .isDeleting ? (
                                                  <LoadingSVG />
                                                ) : (
                                                  <FaTrashSolid />
                                                )}
                                              </button>
                                            </div>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  )}
                                <button
                                  onClick$={() => {
                                    handleDeleteContentIndex(currentCourse.id);
                                  }}
                                  class="rounded-lg bg-tomato px-6 py-3 shadow-lg"
                                >
                                  Delete Course
                                </button>
                              </>
                            )
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </>
            )}
          </section>
        </div>
      </>
    );
  }
);
