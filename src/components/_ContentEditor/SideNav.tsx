/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { NoSerialize, QRL, Signal } from "@builder.io/qwik";
import {
  $,
  component$,
  useComputed$,
  useSignal,
  useStore,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { server$, useLocation, useNavigate } from "@builder.io/qwik-city";
import { isServer } from "@builder.io/qwik/build";
import { IoCaretDown } from "@qwikest/icons/ionicons";
import LoadingSVG from "~/components/LoadingSVG";
import {
  useAccessibleCourseWrite,
  useAccessibleCourseWriteResolved,
} from "~/routes/[lang.]/(wrapper)/(authRoutes)/contenteditor";
import { content, type Content } from "../../../drizzle_turso/schema/content";

import { LuX } from "@qwikest/icons/lucide";
import { eq } from "drizzle-orm";
import SmallNav from "~/components/SmallNav";
import { getChapters } from "~/components/_Creator/Course";
import { useVerifyChapter } from "~/routes/[lang.]/(wrapper)/(authRoutes)/contenteditor/layout";
import { useUserLoader } from "~/routes/[lang.]/(wrapper)/(authRoutes)/layout";
import drizzleClient from "~/utils/drizzleClient";
export { getChapters };

const getChapterSingle = server$(async (chapterId: string) =>
  drizzleClient().select().from(content).where(eq(content.id, chapterId))
);

export default component$(
  ({
    contentWS,
    contentEditorValue,
    renderedHTML,
    isEditing,
    chapterId,
    courseId,
    audioAssetId,
    courseIdToEditingUser,
    hasChanged,
    chapterName,
    timeStamp,
    openSideNav,
  }: {
    contentWS: Signal<NoSerialize<WebSocket>>;
    contentEditorValue: Signal<any>;
    renderedHTML: Signal<string | undefined>;
    isEditing: Signal<boolean>;
    chapterId: Signal<string>;
    courseId: Signal<string>;
    audioAssetId: Signal<string | undefined>;
    courseIdToEditingUser: Record<string, [string, string]>;
    hasChanged: Signal<boolean>;
    chapterName: Signal<string>;
    timeStamp: Signal<string>;
    openSideNav: Signal<boolean>;
  }) => {
    const initialCourseId = useLocation().url.searchParams.get("courseId");
    const initialChapterId = useLocation().url.searchParams.get("chapterId");
    const verifyChapter = useVerifyChapter();

    const user = useUserLoader().value;
    const nav = useNavigate();
    const userAccessibleCourseWrite = useAccessibleCourseWrite();
    const userAccessibleCourseWriteResolved = useAccessibleCourseWriteResolved();
    const courses = useStore(() =>
      Object.fromEntries(
        userAccessibleCourseWriteResolved.value.map(
          ({ content_index, profiles, course_approval }) => {
            return [
              content_index.id,
              Object.assign({}, content_index, {
                isOpen: false,
                chapters: [] as Content[],
                chaptersMap: {} as Record<string, { isOpeningChapter: boolean }>,
                isLoadingChapter: false,
                hasLoadedChapter: false,
                isOpeningChapter: false,
              }),
            ];
          }
        )
      )
    );
    useTask$(({ track }) => {
      track(userAccessibleCourseWriteResolved);
      if (isServer) return;
      const keys = Object.keys(courses);
      userAccessibleCourseWriteResolved.value.forEach(
        async ({ content_index, profiles, course_approval }) => {
          keys.splice(keys.indexOf(content_index.id), 1);
          const isOpen = courses[content_index.id]?.isOpen || false;
          if (isOpen) {
            const chapters = await getChapters(content_index.id);
            courses[content_index.id] = Object.assign({}, content_index, {
              isOpen: true,
              chapters,
              isLoadingChapter: courses[content_index.id]?.isLoadingChapter || false,
              chaptersMap: Object.fromEntries(
                chapters.map((c) => [
                  c.id,
                  {
                    isOpeningChapter: false,
                  },
                ])
              ),
              hasLoadedChapter: true,
              isOpeningChapter: courses[content_index.id]?.isOpeningChapter || false,
            });
          } else {
            courses[content_index.id] = Object.assign({}, content_index, {
              isOpen: false,
              chapters: [],
              chaptersMap: {},
              isLoadingChapter: courses[content_index.id]?.isLoadingChapter || false,
              hasLoadedChapter: false,
              isOpeningChapter: courses[content_index.id]?.isOpeningChapter || false,
            });
          }
        }
      );
      for (const i of keys) {
        delete courses[i];
      }
    });

    const displayCourses = useComputed$(() =>
      Object.values(courses).toSorted(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
    );

    const oldChapter = useSignal("");

    const isRequestingChapter = useSignal("");
    const isRequestingChapterCallback = useSignal<QRL<() => any> | undefined>(undefined);
    const isRequestingChapterTimeout = useSignal<any>();

    useTask$(({ track }) => {
      track(contentWS);
      if (!contentWS.value) return;

      contentWS.value.addEventListener("message", ({ data }) => {
        try {
          const d = JSON.parse(data);
          if (
            d.type === "contentDeleted" ||
            d.type === "contentIndexDeleted" ||
            d.type === "contentIndexDetailsEdited" ||
            d.type === "chapterCreated" ||
            d.type === "contentCreated" ||
            d.type === "contentLocked" ||
            d.type === "contentIndexLocked" ||
            d.type === "contentIndexUnlocked" ||
            d.type === "contentUnlocked" ||
            d.type === "contentDetailsEdited"
          ) {
            nav();
            return;
          }
          if (d.type === "openContentSuccess") {
            if (!isRequestingChapterCallback.value) return;
            isRequestingChapterCallback.value();
            isRequestingChapterCallback.value = undefined;
            clearTimeout(isRequestingChapterTimeout.value);
            return;
          }
          if (d.type === "openContentError") {
            alert(d.message);
            isRequestingChapter.value = "";
            isRequestingChapterCallback.value = undefined;
            clearTimeout(isRequestingChapterTimeout.value);
            return;
          }
          if (d.type === "forceCloseContent") {
            alert("Owner locked the content!");
            if (user.role === "admin" || courses[courseId.value].author === user.userId) return;
            contentWS.value?.send(
              JSON.stringify({
                type: "closeContent",
                userId: user.userId + "###" + timeStamp.value,
                courseId: courseId.value,
                contentId: chapterId.value,
              })
            );
            isEditing.value = false;
            return;
          }
        } catch (e) {
          console.error(e);
        }
      });
    });

    const refreshChapters = $(async (id: string) => {
      courses[id].isLoadingChapter = true;
      const chapters = await getChapters(id);
      courses[id].chaptersMap = Object.fromEntries(
        chapters.map((c) => [
          c.id,
          {
            isOpeningChapter: false,
          },
        ])
      );
      courses[id].chapters = chapters;
      courses[id].isLoadingChapter = false;
      courses[id].hasLoadedChapter = true;
    });

    useVisibleTask$(
      async ({ track }) => {
        track(contentWS);
        if (!verifyChapter) return;
        if (!initialCourseId || !initialChapterId || !courses[initialCourseId]) return;
        if (!contentWS.value) return;

        if (
          (userAccessibleCourseWrite.value[0] !== "*" &&
            !userAccessibleCourseWrite.value.includes(initialCourseId)) ||
          (courses[initialCourseId].is_locked &&
            user.userId !== courses[initialCourseId].author &&
            user.role !== "admin")
        )
          return alert("No permission to edit the course!");

        if (!courses[initialCourseId].is_single_page) {
          courses[initialCourseId].isOpen = true;
          refreshChapters(initialCourseId);
        }
        isRequestingChapterCallback.value = $(async () => {
          const val = (await getChapterSingle(initialChapterId))[0];
          contentEditorValue.value = val.content_slate ? JSON.parse(val.content_slate) : undefined;
          renderedHTML.value = val.renderedHTML || undefined;
          chapterId.value = initialChapterId;
          courseId.value = initialCourseId;
          if (val.audio_track_asset_id) audioAssetId.value = val.audio_track_asset_id;
          isEditing.value = true;
          isRequestingChapter.value = "";
          chapterName.value = val.name;

          if (oldChapter.value)
            contentWS.value?.send(
              JSON.stringify({
                type: "closeContent",
                userId: user.userId,
                courseId: initialCourseId,
                contentId: oldChapter.value,
              })
            );
          oldChapter.value = initialChapterId;
        });

        contentWS.value!.send(
          JSON.stringify({
            type: "openContent",
            userId: user.userId + "###" + timeStamp.value,
            contentId: initialChapterId,
            courseId: initialCourseId,
            avatar_url: user.avatar_url,
          })
        );

        isRequestingChapter.value = initialChapterId;

        isRequestingChapterTimeout.value = setTimeout(() => {
          alert("Server Timeout! Server might be down!");
          isRequestingChapter.value = "";
          isRequestingChapterCallback.value = undefined;
        }, 7000);
      },
      { strategy: "document-ready" }
    );

    return (
      <nav
        class={
          "absolute left-0 top-0 z-[200] hidden h-full max-h-[100vh] w-[100vw] items-center justify-start text-primary-dark-gray backdrop-blur-sm dark:text-background-light-gray xl:relative xl:flex xl:w-[20vw] " +
          (openSideNav.value ? " !block" : "")
        }
        onClick$={() => {
          openSideNav.value = false;
        }}
      >
        <button class="absolute right-4 top-4 block text-[15px] text-primary-dark-gray dark:text-background-light-gray md:text-[20px] xl:hidden">
          <LuX />
        </button>
        <div
          class="h-full w-[20vw] min-w-[280px] overflow-auto bg-pale-yellow p-4 shadow shadow-slate-200/80 ring-1 ring-slate-900/5 backdrop-blur-sm dark:border-disabled-dark dark:bg-primary-dark-gray md:min-w-[250px] xl:bg-pale-yellow/50 xl:w-full"
          onClick$={(e) => e.stopPropagation()}
        >
          {contentWS.value ? (
            <div class="flex flex-col items-start gap-4 py-6">
              <SmallNav user={user} />
              <ul class="flex flex-col gap-6 pt-2 md:pt-4">
                {displayCourses.value.map((currentCourse, index) => {
                  const displayChapters = courses[currentCourse.id].chapter_order.filter(
                    (chapter) => {
                      const t = courses[currentCourse.id].chapters.find((c) => c.id === chapter);
                      return t && !t.is_deleted;
                    }
                  );
                  return (
                    <li key={`ContentEditor${currentCourse.id}`}>
                      <div class="flex items-center gap-4">
                        <button
                          onClick$={async () => {
                            courses[currentCourse.id].isOpen = !courses[currentCourse.id].isOpen;
                            if (courses[currentCourse.id].is_single_page) {
                              if (!contentWS.value || !timeStamp.value) return;
                              if (isRequestingChapter.value !== "") {
                                return;
                              }
                              if (
                                (userAccessibleCourseWrite.value[0] !== "*" &&
                                  !userAccessibleCourseWrite.value.includes(currentCourse.id)) ||
                                (courses[currentCourse.id].is_locked &&
                                  user.userId !== courses[currentCourse.id].author &&
                                  user.role !== "admin")
                              )
                                return alert("No permission to edit the course!");
                              const chapters = await getChapters(currentCourse.id);
                              if (chapters.length === 0)
                                return alert(
                                  "An error occured! Please refresh the page or contact support."
                                );
                              courses[currentCourse.id].chapters = chapters;
                              const chapter = chapters[0];
                              if (oldChapter.value) {
                                if (
                                  hasChanged.value &&
                                  !window.confirm(
                                    "You have unsaved changes. Are you sure you want to leave/switch editing?"
                                  )
                                )
                                  return;
                                if (oldChapter.value === chapter.id) {
                                  return;
                                }
                              }
                              isRequestingChapterCallback.value = $(async () => {
                                const val = (await getChapterSingle(chapter.id))[0];
                                contentEditorValue.value = val.content_slate
                                  ? JSON.parse(val.content_slate)
                                  : undefined;
                                renderedHTML.value = val.renderedHTML || undefined;
                                chapterId.value = chapter.id;
                                courseId.value = currentCourse.id;
                                if (chapter.audio_track_asset_id)
                                  audioAssetId.value = chapter.audio_track_asset_id;
                                isEditing.value = true;
                                isRequestingChapter.value = "";
                                chapterName.value = chapter.name;
                                window.history.replaceState(
                                  {},
                                  "",
                                  `/contenteditor/?courseId=${currentCourse.id}&chapterId=${chapter.id}`
                                );

                                if (oldChapter.value)
                                  contentWS.value?.send(
                                    JSON.stringify({
                                      type: "closeContent",
                                      userId: user.userId + "###" + timeStamp.value,
                                      courseId: currentCourse.id,
                                      contentId: oldChapter.value,
                                    })
                                  );
                                oldChapter.value = chapter.id;
                              });

                              contentWS.value.send(
                                JSON.stringify({
                                  type: "openContent",
                                  userId: user.userId + "###" + timeStamp.value,
                                  contentId: chapter.id,
                                  courseId: currentCourse.id,
                                  avatar_url: user.avatar_url,
                                })
                              );

                              isRequestingChapter.value = chapter.id;

                              isRequestingChapterTimeout.value = setTimeout(() => {
                                alert("Server Timeout! Server might be down!");
                                isRequestingChapter.value = "";
                                isRequestingChapterCallback.value = undefined;
                              }, 7000);
                            } else {
                              if (courses[currentCourse.id].hasLoadedChapter) return;
                              refreshChapters(currentCourse.id);
                            }
                          }}
                          class={"flex w-full items-center gap-2"}
                        >
                          <h2 class="text-left">{courses[currentCourse.id].name}</h2>
                          <div class="ml-auto flex items-center gap-2">
                            {!courses[currentCourse.id].is_single_page && (
                              <span
                                class={
                                  "text-[16px] text-primary-dark-gray transition-transform dark:text-background-light-gray " +
                                  (courses[currentCourse.id].isOpen && "rotate-180")
                                }
                              >
                                <IoCaretDown />
                              </span>
                            )}
                            {courses[currentCourse.id].isOpeningChapter && (
                              <span>
                                <LoadingSVG />
                              </span>
                            )}
                            {isRequestingChapter.value ===
                              courses[currentCourse.id].chapters[0]?.id &&
                              courses[currentCourse.id].is_single_page && (
                                <span>
                                  <LoadingSVG />
                                </span>
                              )}
                            {courseIdToEditingUser[currentCourse.chapter_order[0]] &&
                              courses[currentCourse.id].is_single_page && (
                                <span class="h-[30px] w-[30px]">
                                  <img
                                    src={courseIdToEditingUser[currentCourse.chapter_order[0]][1]}
                                    alt=""
                                    width={30}
                                    height={30}
                                    referrerPolicy="no-referrer"
                                    class={
                                      "h-[30px] w-[30px] max-w-[30px] rounded-full object-contain " +
                                      (oldChapter.value ===
                                      courses[currentCourse.id].chapters[0]?.id
                                        ? " rounded-full border-2 border-tomato"
                                        : "")
                                    }
                                  />
                                </span>
                              )}
                          </div>
                        </button>
                      </div>
                      {courses[currentCourse.id].isOpen &&
                        courses[currentCourse.id].isLoadingChapter &&
                        !courses[currentCourse.id].is_single_page && (
                          <div class="mt-6">
                            <LoadingSVG />
                          </div>
                        )}
                      {courses[currentCourse.id].isOpen &&
                        !courses[currentCourse.id].is_single_page &&
                        courses[currentCourse.id].hasLoadedChapter &&
                        displayChapters.length > 0 && (
                          <ul class="relative mt-2 flex flex-col gap-4 py-1 pl-4 after:absolute after:left-0 after:top-0 after:h-full after:w-[2px] after:bg-primary-dark-gray dark:after:bg-background-light-gray md:py-2">
                            {displayChapters.map((_chapterId, chapterIndex) => {
                              const chapter = courses[currentCourse.id].chapters.find(
                                (c) => c.id === _chapterId
                              );
                              if (chapter)
                                return (
                                  <li key={`ContentEditor${chapter.id}`}>
                                    <div class="flex items-center gap-3">
                                      <button
                                        onClick$={() => {
                                          if (contentWS.value && timeStamp.value) {
                                            if (isRequestingChapter.value !== "") {
                                              return;
                                            }
                                            if (
                                              (userAccessibleCourseWrite.value[0] !== "*" &&
                                                !userAccessibleCourseWrite.value.includes(
                                                  currentCourse.id
                                                )) ||
                                              (courses[currentCourse.id].is_locked &&
                                                user.userId !== courses[currentCourse.id].author &&
                                                user.role !== "admin")
                                            )
                                              return alert("No permission to edit the course!");
                                            if (oldChapter.value) {
                                              if (
                                                hasChanged.value &&
                                                !window.confirm(
                                                  "You have unsaved changes. Are you sure you want to leave/switch editing?"
                                                )
                                              )
                                                return;
                                              if (oldChapter.value === chapter.id) {
                                                return;
                                              }
                                            }
                                            isRequestingChapterCallback.value = $(async () => {
                                              const val = (await getChapterSingle(chapter.id))[0];
                                              contentEditorValue.value = val.content_slate
                                                ? JSON.parse(val.content_slate)
                                                : undefined;
                                              renderedHTML.value = val.renderedHTML || undefined;
                                              chapterId.value = chapter.id;
                                              courseId.value = currentCourse.id;
                                              if (chapter.audio_track_asset_id)
                                                audioAssetId.value = chapter.audio_track_asset_id;
                                              isEditing.value = true;
                                              isRequestingChapter.value = "";
                                              chapterName.value = chapter.name;
                                              window.history.replaceState(
                                                {},
                                                "",
                                                `/contenteditor/?courseId=${currentCourse.id}&chapterId=${chapter.id}`
                                              );

                                              if (oldChapter.value)
                                                contentWS.value?.send(
                                                  JSON.stringify({
                                                    type: "closeContent",
                                                    userId: user.userId,
                                                    courseId: currentCourse.id,
                                                    contentId: oldChapter.value,
                                                  })
                                                );
                                              oldChapter.value = chapter.id;
                                            });

                                            contentWS.value.send(
                                              JSON.stringify({
                                                type: "openContent",
                                                userId: user.userId + "###" + timeStamp.value,
                                                contentId: chapter.id,
                                                courseId: currentCourse.id,
                                                avatar_url: user.avatar_url,
                                              })
                                            );

                                            isRequestingChapter.value = chapter.id;

                                            isRequestingChapterTimeout.value = setTimeout(() => {
                                              alert("Server Timeout! Server might be down!");
                                              isRequestingChapter.value = "";
                                              isRequestingChapterCallback.value = undefined;
                                            }, 7000);
                                          }
                                        }}
                                        class={"flex w-full items-center justify-between gap-4"}
                                      >
                                        <h3 class="text-left">{chapter.name}</h3>
                                        <div class="ml-auto flex items-center gap-2">
                                          {isRequestingChapter.value === chapter.id && (
                                            <span>
                                              <LoadingSVG />
                                            </span>
                                          )}
                                          {courseIdToEditingUser[chapter.id] && (
                                            <img
                                              src={courseIdToEditingUser[chapter.id][1]}
                                              alt=""
                                              width="30"
                                              height="30"
                                              referrerPolicy="no-referrer"
                                              class={
                                                "rounded-full object-contain" +
                                                (oldChapter.value === chapter.id
                                                  ? " rounded-full border-2 border-tomato"
                                                  : "")
                                              }
                                            />
                                          )}
                                        </div>
                                      </button>
                                    </div>
                                  </li>
                                );
                              else return null;
                            })}
                          </ul>
                        )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div class="flex h-full w-full items-center justify-center">
              <span>
                <LoadingSVG />
              </span>
            </div>
          )}
        </div>
      </nav>
    );
  }
);
