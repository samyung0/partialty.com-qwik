import type { NoSerialize, QRL, Signal } from "@builder.io/qwik";
import { component$, useComputed$, useStore } from "@builder.io/qwik";
import { Link, server$ } from "@builder.io/qwik-city";
import { FaPenToSquareRegular, FaSlidersSolid, FaTrashSolid } from "@qwikest/icons/font-awesome";
import { IoCaretDown } from "@qwikest/icons/ionicons";
import { LuArrowRight, LuEye, LuEyeOff, LuGem, LuLock, LuUnlock } from "@qwikest/icons/lucide";
import { eq } from "drizzle-orm";

import LoadingSVG from "~/components/LoadingSVG";
import { useUserLoader } from "~/routes/[lang.]/(wrapper)/(authRoutes)/layout";
import drizzleClient from "~/utils/drizzleClient";
import type { Content } from "../../../../drizzle_turso/schema/content";
import { content } from "../../../../drizzle_turso/schema/content";
import type { ContentCategory } from "../../../../drizzle_turso/schema/content_category";
import type { ContentIndex } from "../../../../drizzle_turso/schema/content_index";
import type { Profiles } from "../../../../drizzle_turso/schema/profiles";
import type { Tag } from "../../../../drizzle_turso/schema/tag";
import { displayNamesLang, listSupportedLang } from "../../../../lang";

const getChapters = server$(async (courseId: string) => {
  return await drizzleClient().select().from(content).where(eq(content.index_id, courseId));
});

export default component$(
  ({
    ws,
    userAccessibleCourseWrite,
    userAccessibleCourseWriteResolved,
    tags,
    categories,
    courseIdToEditingUser,
    isDeletingChapter,
    isDeletingChapterCallback,
  }: {
    ws: Signal<NoSerialize<WebSocket>>;
    userAccessibleCourseWrite: string[];
    userAccessibleCourseWriteResolved: { content_index: ContentIndex; profiles: Profiles }[];
    tags: Tag[];
    categories: ContentCategory[];
    courseIdToEditingUser: Record<string, [string, string]>;
    isDeletingChapter: Signal<string>;
    isDeletingChapterCallback: Signal<QRL<() => any> | undefined>;
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

    return (
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
                            courses[currentCourse.id].isLoadingChapter = true;
                            getChapters(currentCourse.id).then((chapters) => {
                              courses[currentCourse.id].chapters = chapters;
                              courses[currentCourse.id].isLoadingChapter = false;
                              courses[currentCourse.id].hasLoadedChapter = true;
                            });
                          }}
                          class="flex cursor-pointer items-center justify-between"
                        >
                          <div class="flex flex-col gap-1">
                            <h2 class="text-lg tracking-wide">{courses[currentCourse.id].name}</h2>
                            <p class="flex items-center gap-2">
                              <span class="text-sm tracking-wide">
                                {new Date(courses[currentCourse.id].updated_at).toDateString()},{" "}
                                {
                                  displayNamesLang[
                                    courses[currentCourse.id].lang as keyof typeof displayNamesLang
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
                              Edit Course
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
                                      listSupportedLang.find((lang) => lang.value === _lang)!.label
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
                                    (category) => category.id === courses[currentCourse.id].category
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
                                  {courses[currentCourse.id].is_locked ? <LuLock /> : <LuUnlock />}
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
                                  {courses[currentCourse.id].chapters.map((chapter) => (
                                    <li
                                      key={`Course${currentCourse.id}Chapter${chapter}`}
                                      class="flex items-center justify-between"
                                    >
                                      <h2 class="border-b-2 border-primary-dark-gray dark:border-background-light-gray">
                                        <Link href={chapter.link || undefined}>{chapter.name}</Link>
                                      </h2>
                                      <div class="flex items-center gap-2 text-[20px] text-primary-dark-gray dark:text-background-light-gray">
                                        <span class="p-1">
                                          <FaPenToSquareRegular />
                                        </span>
                                        <span class="p-1">
                                          <FaSlidersSolid />
                                        </span>
                                        <span class="rounded-sm bg-tomato p-1 text-background-light-gray">
                                          <FaTrashSolid />
                                        </span>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            <button class="rounded-lg bg-tomato px-6 py-3 shadow-lg">
                              Delete Course
                            </button>
                          </>
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
    );
  }
);
