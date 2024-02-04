import type { NoSerialize, QRL, Signal } from "@builder.io/qwik";
import { $, component$, useSignal, useStore, useTask$ } from "@builder.io/qwik";
import { server$, z } from "@builder.io/qwik-city";
import { LuSettings, LuTrash } from "@qwikest/icons/lucide";
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import ArrowDown from "~/assets/svg/caret-down-outline.svg";
import defaultChapter from "~/const/defaultChapter";
import type roles from "~/const/roles";
import { useContent } from "~/routes/[lang.]/(wrapper)/(authRoutes)/contenteditor";
import drizzleClient from "~/utils/drizzleClient";
import type { Content, NewContent } from "../../../drizzle_turso/schema/content";
import { content } from "../../../drizzle_turso/schema/content";
import type { ContentIndex } from "../../../drizzle_turso/schema/content_index";
import { content_index } from "../../../drizzle_turso/schema/content_index";

export default component$(
  ({
    contentWS,
    contentEditorValue,
    renderedHTML,
    userId,
    userRole,
    isEditing,
    chapterId,
    courseId,
    audioAssetId,
    courseIdToEditingUser,
    isRequestingChapterCallback,
    isRequestingChapterTimeout,
    isRequestingChapter,
    isDeletingChapterCallback,
    isDeletingChapterTimeout,
    isDeletingChapter,
    avatar_url,
    timeStamp,
    hasChanged,
    chapterName,
  }: {
    contentWS: Signal<NoSerialize<WebSocket>>;
    contentEditorValue: Signal<any>;
    renderedHTML: Signal<string | undefined>;
    userId: string;
    userRole: (typeof roles)[number];
    isEditing: Signal<boolean>;
    chapterId: Signal<string>;
    courseId: Signal<string>;
    audioAssetId: Signal<string | undefined>;
    courseIdToEditingUser: Record<string, [string, string]>;
    isRequestingChapterCallback: Signal<QRL<() => any> | undefined>;
    isRequestingChapterTimeout: Signal<any>;
    isRequestingChapter: Signal<string>;
    isDeletingChapterCallback: Signal<QRL<() => any> | undefined>;
    isDeletingChapterTimeout: Signal<any>;
    isDeletingChapter: Signal<string>;
    avatar_url: string;
    timeStamp: Signal<string>;
    hasChanged: Signal<boolean>;
    chapterName: Signal<string>;
  }) => {
    const contentDB = useContent().value;
    const topics = useStore<ContentIndex[]>(
      contentDB[0].toSorted((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1))
    );
    const chapters = useStore<Content[]>(contentDB[1]);
    const navOpen = useStore(() => Array.from(Array(topics.length)).map((_) => false));
    const oldChapter = useSignal("");

    // const openAddCourse = useSignal(false);
    // const isCreatingNewCourse = useSignal(false);
    // const newCourseInfo = useStore({
    //   name: "",
    //   requireSubscription: false,
    // });
    // const newCourseError = useStore({
    //   name: "",
    // });

    const addChapterSuccessCallback = useSignal<QRL<() => any>>();
    const addChapterFailCallback = useSignal<QRL<(e: string) => any>>();
    const addChapterTimeout = useSignal<any>();
    const openAddChapter = useStore(() => Array.from(Array(topics.length)).map((_) => false));
    const isCreatingNewChapter = useStore(() => Array.from(Array(topics.length)).map((_) => false));
    const newChapterInfo = useStore(() =>
      Array.from(Array(topics.length)).map((_) => ({
        name: "",
        requireSubscription: false,
      }))
    );
    const newChapterError = useStore(() =>
      Array.from(Array(topics.length)).map((_) => ({
        name: "",
      }))
    );
    const openEditCourse = useStore(() => Array.from(Array(topics.length)).map((_) => false));
    const isEditingCourse = useStore(() => Array.from(Array(topics.length)).map((_) => false));
    const settingsCourseInfo = useStore(() =>
      Array.from(Array(topics.length)).map((_) => ({
        name: "",
        requireSubscription: false,
      }))
    );
    const settingsCourseError = useStore(() =>
      Array.from(Array(topics.length)).map((_) => ({
        name: "",
      }))
    );

    const editChapter = useStore(() => {
      const map: Record<
        string,
        {
          openEdit: boolean;
          isEditing: boolean;
          settingsInfo: {
            name: string;
            requireSubscription: boolean;
          };
          settingsError: { name: string };
        }[]
      > = {};
      for (const i of topics)
        map[i.id] = Array.from(Array(i.chapter_order.length)).map((_) => ({
          openEdit: false,
          isEditing: false,
          settingsInfo: {
            name: "",
            requireSubscription: false,
          },
          settingsError: { name: "" },
        }));
      return map;
    });

    useTask$(({ track }) => {
      track(contentWS);
      if (!contentWS.value) return;
      contentWS.value.addEventListener("message", ({ data }) => {
        try {
          const d = JSON.parse(data);
          if (d.type === "contentDeleted") {
            const chapterId = d.message.contentId;
            const courseId = d.message.courseId;
            const i1 = topics.findIndex((topic) => topic.id === courseId);
            if (i1 < 0) return;
            const i3 = topics[i1].chapter_order.indexOf(chapterId);
            if (i3 >= 0) {
              topics[i1].chapter_order.splice(i3, 1);
              editChapter[courseId].splice(i3, 1);
            }
            const i2 = chapters.findIndex((chapter) => chapter.id === chapterId);
            if (i2 >= 0) {
              chapters.splice(i2, 1);
            }
            return;
          }
          if (d.type === "contentCreated") {
            const ret = d.message.content;
            if (!ret) return;
            const index = topics.findIndex((topic) => topic.id === ret[0].index_id);
            if (index < 0) return;
            chapters.push(ret[0]);
            topics.splice(index, 1, ret[1]);
            editChapter[ret[0].index_id].push({
              openEdit: false,
              isEditing: false,
              settingsInfo: {
                name: "",
                requireSubscription: false,
              },
              settingsError: { name: "" },
            });
            return;
          }
          if (d.type === "createContentSuccess") {
            if (addChapterSuccessCallback.value) addChapterSuccessCallback.value();
            addChapterSuccessCallback.value = undefined;
            addChapterFailCallback.value = undefined;
            clearTimeout(addChapterTimeout.value);
            addChapterTimeout.value = undefined;
            return;
          }
          if (d.type === "createContentFail") {
            if (addChapterFailCallback.value) addChapterFailCallback.value(d.msg.toString());
            addChapterSuccessCallback.value = undefined;
            addChapterFailCallback.value = undefined;
            clearTimeout(addChapterTimeout.value);
            addChapterTimeout.value = undefined;
            return;
          }
          if (d.type === "contentDetailsEdited") {
            const details = d.message.details;
            const courseId = d.message.courseId;
            const chapterId = d.message.chapterId;
            if (chapterId) {
              const chapter = chapters.find((chapter) => chapter.id === chapterId);
              const index = topics.findIndex((topic) => topic.id === courseId);
              const chapterIndex = chapters.findIndex((chapter) => chapter.id === chapterId);
              const index2 = topics[index].chapter_order.indexOf(chapterId);
              if (!chapter || index < 0 || chapterIndex < 0) return;
              chapters.splice(chapterIndex, 1, details);

              if (index2) {
                const r = topics[index].chapter_order.splice(index2, 1)[0];
                setTimeout(() => {
                  topics[index].chapter_order.splice(index2, 0, r);
                }, 0);
              }
              return;
            }
            if (courseId) {
              const courseIndex = topics.findIndex((topic) => topic.id === courseId);
              console.log(courseIndex);
              if (courseIndex < 0) return;
              topics.splice(courseIndex, 1);
              setTimeout(() => topics.splice(courseIndex, 0, details), 0);
              return;
            }
          }
        } catch (e) {
          console.error(e);
        }
      });
    });

    return (
      <nav class="h-full max-h-[100vh] w-[20vw] overflow-auto border-r-2 border-yellow bg-light-yellow/50 p-4">
        {contentWS.value ? (
          <ul class="flex flex-col gap-6 pt-4">
            {/* <button
              class="rounded-lg bg-primary-dark-gray px-4 py-3 text-background-light-gray shadow-xl"
              onClick$={async () => {
                openAddCourse.value = !openAddCourse.value;
              }}
            >
              Create New Course
            </button>
            {openAddCourse.value && (
              <form
                preventdefault:submit
                onSubmit$={async (e) => {
                  if (!e.target) return;
                  const d = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries());
                  const schema = z.object({
                    coursename: z
                      .string()
                      .trim()
                      .min(1, "Course name cannot be empty!")
                      .max(70, "Course name cannot be longer than 70 chars!"),
                    sub: z.literal("on").optional(),
                  });
                  const parseResult = schema.safeParse(d);
                  if (!parseResult.success) {
                    newCourseError.name = parseResult.error.issues[0].message;
                    return;
                  }
                  isCreatingNewCourse.value = true;
                  const slug = parseResult.data.coursename.toLowerCase().split(" ").join("-");
                  const courseWithSlug = await server$(
                    async () =>
                      await drizzleClient()
                        .select()
                        .from(content_index)
                        .where(eq(content_index.slug, slug))
                  )();
                  if (courseWithSlug.length > 0) {
                    newCourseError.name = "Course with this name already exist!";
                    isCreatingNewCourse.value = false;
                    return;
                  }
                  const courseId = uuidv4();
                  const values: NewContentIndex = {
                    id: courseId,
                    name: parseResult.data.coursename,
                    slug: slug,
                    is_premium: !!parseResult.data.sub,
                    link: defaultCourse(slug),
                    chapter_order: [],
                  };
                  let newCourse: ContentIndex | undefined;
                  const role = userRole;
                  const uId = userId;
                  try {
                    newCourse = await server$(
                      async () =>
                        await drizzleClient().transaction(async (tx) => {
                          const currentAccessibleCourses =
                            (
                              await tx
                                .select({ accessible_courses: profiles.accessible_courses })
                                .from(profiles)
                                .where(eq(profiles.id, uId))
                            )[0].accessible_courses || [];
                          await tx
                            .update(profiles)
                            .set({
                              accessible_courses: [...currentAccessibleCourses, courseId],
                            })
                            .where(eq(profiles.id, uId));
                          return (await tx.insert(content_index).values(values).returning())[0];
                        })
                    )();
                  } catch (e) {
                    newCourseError.name = (e as any).toString();
                  }
                  if (newCourse) {
                    topics.unshift(newCourse);
                    navOpen.unshift(false);
                    openAddChapter.splice(0, openAddChapter.length);
                    openAddChapter.push(...Array.from(Array(topics.length)).map((_) => false));
                    isCreatingNewChapter.splice(0, isCreatingNewChapter.length);
                    isCreatingNewChapter.push(
                      ...Array.from(Array(topics.length)).map((_) => false)
                    );
                    newChapterInfo.splice(0, newChapterInfo.length);
                    newChapterInfo.push(
                      ...Array.from(Array(topics.length)).map((_) => ({
                        name: "",
                        requireSubscription: false,
                      }))
                    );
                    newChapterError.splice(0, newChapterError.length);
                    newChapterError.push(
                      ...Array.from(Array(topics.length)).map((_) => ({
                        name: "",
                      }))
                    );
                    openEditCourse.splice(0, openEditCourse.length);
                    openEditCourse.push(...Array.from(Array(topics.length)).map((_) => false));
                    isEditingCourse.splice(0, isEditingCourse.length);
                    isEditingCourse.push(...Array.from(Array(topics.length)).map((_) => false));
                    settingsCourseInfo.splice(0, settingsCourseInfo.length);
                    settingsCourseInfo.push(
                      ...Array.from(Array(topics.length)).map((_) => ({
                        name: "",
                        requireSubscription: false,
                      }))
                    );
                    settingsCourseError.splice(0, settingsCourseError.length);
                    settingsCourseError.push(
                      ...Array.from(Array(topics.length)).map((_) => ({
                        name: "",
                      }))
                    );
                    newCourseError.name = "";
                    openAddCourse.value = false;

                    editChapter[newCourse.id] = [];
                  }
                  isCreatingNewCourse.value = false;
                  newCourseInfo.name = "";
                  newCourseInfo.requireSubscription = false;
                }}
                class="space-y-2"
              >
                <div>
                  <label for="coursename" class="cursor-pointer">
                    Course Name
                  </label>
                  <div class="pt-1">
                    <input
                      id="coursename"
                      name="coursename"
                      type="text"
                      value={newCourseInfo.name}
                      onInput$={(_, el) => (newCourseInfo.name = el.value)}
                      required
                      class={
                        "block w-full rounded-md border-2 px-3 py-2 " +
                        (newCourseError.name ? "border-tomato" : "border-black/10")
                      }
                    />
                  </div>
                  <p class="w-full pt-1 text-tomato">{newCourseError.name}</p>
                </div>
                <div class="flex items-center gap-4">
                  <label for="sub" class="cursor-pointer">
                    Subscription required
                  </label>
                  <div>
                    <input
                      id="sub"
                      name="sub"
                      type="checkbox"
                      checked={newCourseInfo.requireSubscription}
                      onChange$={(e) => {
                        if (e.target)
                          newCourseInfo.requireSubscription = (
                            e.target as HTMLInputElement
                          ).checked;
                      }}
                      class={"block h-4 w-4 rounded-md border-2 border-black/10"}
                    />
                  </div>
                </div>
                <br />
                <button
                  disabled={isCreatingNewCourse.value}
                  type="submit"
                  class="rounded-lg bg-primary-dark-gray px-4 py-3 text-background-light-gray shadow-xl"
                >
                  {isCreatingNewCourse.value && (
                    <span>
                      <svg
                        aria-hidden="true"
                        class="inline-block h-4 w-4 animate-spin fill-background-light-gray text-primary-dark-gray"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                    </span>
                  )}
                  {!isCreatingNewCourse.value && <span class="">Create</span>}
                </button>
              </form>
            )} */}
            {topics.map((topic, index) => (
              <li key={`ContentEditor${topic.id}`}>
                <div class="flex items-center gap-4">
                  <button
                    onClick$={() => (navOpen[index] = !navOpen[index])}
                    class={"flex items-center gap-2"}
                  >
                    <h2 class="text-left text-lg tracking-wide">{topic.name}</h2>
                    <img
                      src={ArrowDown}
                      alt="arrowDown"
                      width={16}
                      height={16}
                      class={"transition-transform " + (navOpen[index] && "rotate-180")}
                    />
                  </button>
                  <div class="ml-auto flex items-center gap-1">
                    <button
                      onClick$={() => {
                        openAddChapter[index] = !openAddChapter[index];
                        navOpen[index] = true;
                      }}
                      class="p-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="h-[20px] w-[20px]"
                      >
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                      </svg>
                    </button>
                    <button
                      onClick$={() => {
                        settingsCourseInfo[index].name = topic.name;
                        settingsCourseInfo[index].requireSubscription = topic.is_premium;
                        openEditCourse[index] = !openEditCourse[index];
                      }}
                      class="text-[20px] text-primary-dark-gray"
                    >
                      <LuSettings />
                    </button>
                  </div>
                </div>
                {openEditCourse[index] && (
                  <form
                    preventdefault:submit
                    onSubmit$={async (e) => {
                      if (!e.target) return;
                      const d = Object.fromEntries(
                        new FormData(e.target as HTMLFormElement).entries()
                      );
                      const schema = z.object({
                        coursename: z
                          .string()
                          .trim()
                          .min(1, "Chapter name cannot be empty!")
                          .max(100, "Chapter name cannot be longer than 100 chars!"),
                        sub: z.literal("on").optional(),
                      });
                      const parseResult = schema.safeParse(d);
                      if (!parseResult.success) {
                        settingsCourseError[index].name = parseResult.error.issues[0].message;
                        return;
                      }
                      isEditingCourse[index] = true;
                      const slug = parseResult.data.coursename.toLowerCase().split(" ").join("-");
                      let courseWithSlug: ContentIndex[] | undefined;
                      const courseId = topic.id;
                      try {
                        courseWithSlug = await server$(
                          async () =>
                            await drizzleClient()
                              .select()
                              .from(content_index)
                              .where(eq(content_index.slug, slug))
                        )();
                      } catch (e) {
                        isEditingCourse[index] = false;
                        settingsCourseError[index].name = (e as any).toString();
                        return;
                      }
                      if (courseWithSlug.length > 0 && courseWithSlug[0].id !== courseId) {
                        console.log("slug already exists", settingsCourseError, index);
                        settingsCourseError[index].name = "Chapter with this name already exist!";
                        isEditingCourse[index] = false;
                        return;
                      }
                      const values = {
                        name: parseResult.data.coursename,
                        slug: slug,
                        is_premium: !!parseResult.data.sub,
                        link: defaultChapter(topic.slug, slug),
                      };
                      const parentId = topic.id;
                      let ret: ContentIndex | undefined = undefined;
                      try {
                        ret = await server$(async () => {
                          return (
                            await drizzleClient()
                              .update(content_index)
                              .set(values)
                              .where(eq(content_index.id, parentId))
                              .returning()
                          )[0];
                        })();
                      } catch (e) {
                        isEditingCourse[index] = false;
                        settingsCourseError[index].name = (e as any).toString();
                        return;
                      }

                      if (contentWS.value)
                        contentWS.value.send(
                          JSON.stringify({
                            type: "editContentDetails",
                            details: ret,
                            courseId: topic.id,
                          })
                        );

                      isEditingCourse[index] = false;
                      settingsCourseInfo[index].name = "";
                      settingsCourseInfo[index].requireSubscription = false;
                      openEditCourse[index] = false;
                      settingsCourseError[index].name = "";
                    }}
                    class="my-4 gap-2"
                  >
                    <div>
                      <label for="coursename" class="cursor-pointer">
                        Chapter Name
                      </label>
                      <div class="pt-1">
                        <input
                          id="coursename"
                          name="coursename"
                          type="text"
                          value={settingsCourseInfo[index].name}
                          onInput$={(_, el) => (settingsCourseInfo[index].name = el.value)}
                          required
                          class={
                            "block w-full rounded-md border-2 px-3 py-2 " +
                            (settingsCourseError[index].name ? "border-tomato" : "border-black/10")
                          }
                        />
                      </div>
                      <p class="w-full pt-1 text-tomato">
                        {(() => {
                          return settingsCourseError[index].name;
                        })()}
                      </p>
                    </div>
                    <div class="flex items-center gap-4">
                      <label for="sub" class="cursor-pointer">
                        Subscription required
                      </label>
                      <div>
                        <input
                          id="sub"
                          name="sub"
                          type="checkbox"
                          checked={settingsCourseInfo[index].requireSubscription}
                          onChange$={(e) => {
                            if (e.target)
                              settingsCourseInfo[index].requireSubscription = (
                                e.target as HTMLInputElement
                              ).checked;
                          }}
                          class={"block h-4 w-4 rounded-md border-2 border-black/10"}
                        />
                      </div>
                    </div>
                    <br />
                    <button
                      disabled={isEditingCourse[index]}
                      type="submit"
                      class="rounded-lg bg-primary-dark-gray px-4 py-3 text-background-light-gray shadow-xl"
                    >
                      {isEditingCourse[index] && (
                        <span>
                          <svg
                            aria-hidden="true"
                            class="inline-block h-4 w-4 animate-spin fill-background-light-gray text-primary-dark-gray"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                        </span>
                      )}
                      {!isEditingCourse[index] && <span class="">Confirm Edit</span>}
                    </button>
                  </form>
                )}
                {openAddChapter[index] && (
                  <form
                    preventdefault:submit
                    onSubmit$={async (e) => {
                      if (!e.target) return;
                      const d = Object.fromEntries(
                        new FormData(e.target as HTMLFormElement).entries()
                      );
                      const schema = z.object({
                        coursename: z
                          .string()
                          .trim()
                          .min(1, "Chapter name cannot be empty!")
                          .max(100, "Chapter name cannot be longer than 100 chars!"),
                        sub: z.literal("on").optional(),
                      });
                      const parseResult = schema.safeParse(d);
                      if (!parseResult.success) {
                        newChapterError[index].name = parseResult.error.issues[0].message;
                        return;
                      }
                      isCreatingNewChapter[index] = true;
                      const slug = parseResult.data.coursename.toLowerCase().split(" ").join("-");
                      const courseId = topic.id;
                      let courseWithSlug: Content[] | undefined;
                      try {
                        courseWithSlug = await server$(
                          async () =>
                            await drizzleClient()
                              .select()
                              .from(content)
                              .where(and(eq(content.slug, slug), eq(content.index_id, courseId)))
                        )();
                      } catch (e) {
                        isCreatingNewChapter[index] = false;
                        newChapterError[index].name = (e as any).toString();
                        return;
                      }
                      if (courseWithSlug.length > 0) {
                        console.log("slug already exists", newChapterError, index);
                        newChapterError[index].name = "Chapter with this name already exist!";
                        isCreatingNewChapter[index] = false;
                        return;
                      }
                      if (!contentWS.value) return;
                      const newId = uuidv4();
                      const values: NewContent = {
                        id: newId,
                        name: parseResult.data.coursename,
                        slug: slug,
                        is_premium: !!parseResult.data.sub,
                        link: defaultChapter(topic.slug, slug),
                        chapter_order: [],
                        index_id: courseId,
                      };
                      const newChapterOrder = [...topic.chapter_order, newId];
                      const parentId = topic.id;
                      let ret: [Content, ContentIndex] | undefined;
                      try {
                        ret = await server$(async () => {
                          const retChapter = (
                            await drizzleClient().insert(content).values(values).returning()
                          )[0];
                          const retCourse = (
                            await drizzleClient()
                              .update(content_index)
                              .set({ chapter_order: newChapterOrder })
                              .where(eq(content_index.id, parentId))
                              .returning()
                          )[0];
                          return [retChapter, retCourse] as [Content, ContentIndex];
                        })();
                      } catch (e) {
                        isCreatingNewChapter[index] = false;
                        newChapterInfo[index].name = (e as any).toString();
                        return;
                      }
                      addChapterSuccessCallback.value = $(async () => {
                        isCreatingNewChapter[index] = false;
                        newChapterInfo[index].name = "";
                        newChapterInfo[index].requireSubscription = false;
                        openAddChapter[index] = false;
                        newChapterError[index].name = "";
                      });
                      addChapterFailCallback.value = $((e: string) => {
                        isCreatingNewChapter[index] = false;
                        newChapterError[index].name = "Failed to add Chapter: " + e;
                      });
                      addChapterTimeout.value = setTimeout(() => {
                        addChapterSuccessCallback.value = undefined;
                        if (addChapterFailCallback.value)
                          addChapterFailCallback.value("Server Timeout");
                        addChapterFailCallback.value = undefined;
                      }, 7000);
                      contentWS.value.send(
                        JSON.stringify({
                          type: "createContent",
                          content: ret,
                        })
                      );
                    }}
                    class="my-4 gap-2"
                  >
                    <div>
                      <label for="coursename" class="cursor-pointer">
                        Chapter Name
                      </label>
                      <div class="pt-1">
                        <input
                          id="coursename"
                          name="coursename"
                          type="text"
                          value={newChapterInfo[index].name}
                          onInput$={(_, el) => (newChapterInfo[index].name = el.value)}
                          required
                          class={
                            "block w-full rounded-md border-2 px-3 py-2 " +
                            (newChapterError[index].name ? "border-tomato" : "border-black/10")
                          }
                        />
                      </div>
                      <p class="w-full pt-1 text-tomato">
                        {(() => {
                          return newChapterError[index].name;
                        })()}
                      </p>
                    </div>
                    <div class="flex items-center gap-4">
                      <label for="sub" class="cursor-pointer">
                        Subscription required
                      </label>
                      <div>
                        <input
                          id="sub"
                          name="sub"
                          type="checkbox"
                          checked={newChapterInfo[index].requireSubscription}
                          onChange$={(e) => {
                            if (e.target)
                              newChapterInfo[index].requireSubscription = (
                                e.target as HTMLInputElement
                              ).checked;
                          }}
                          class={"block h-4 w-4 rounded-md border-2 border-black/10"}
                        />
                      </div>
                    </div>
                    <br />
                    <button
                      disabled={isCreatingNewChapter[index]}
                      type="submit"
                      class="rounded-lg bg-primary-dark-gray px-4 py-3 text-background-light-gray shadow-xl"
                    >
                      {isCreatingNewChapter[index] && (
                        <span>
                          <svg
                            aria-hidden="true"
                            class="inline-block h-4 w-4 animate-spin fill-background-light-gray text-primary-dark-gray"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                        </span>
                      )}
                      {!isCreatingNewChapter[index] && <span class="">Create</span>}
                    </button>
                  </form>
                )}
                {navOpen[index] && topic.chapter_order.length > 0 && (
                  <ul class="flex flex-col gap-4 pt-4">
                    {topic.chapter_order.map((chapter, chapterIndex) => {
                      const chapterObj = chapters.find((t) => t.id === chapter);
                      if (chapterObj)
                        return (
                          <li key={`ContentEditor${chapterObj.id}`}>
                            <div class="flex items-center gap-3">
                              <button
                                onClick$={() => {
                                  if (contentWS.value) {
                                    if (oldChapter.value) {
                                      if (isRequestingChapterCallback.value) return;
                                      if (
                                        hasChanged.value &&
                                        !window.confirm(
                                          "You have unsaved changes. Are you sure you want to leave/switch editing?"
                                        )
                                      )
                                        return;
                                      if (oldChapter.value === chapterObj.id) {
                                        return;
                                      }
                                      contentWS.value.send(
                                        JSON.stringify({
                                          type: "closeContent",
                                          userId: userId + "###" + timeStamp.value,
                                          courseId: topic.id,
                                          contentId: oldChapter.value,
                                        })
                                      );
                                    }
                                    isRequestingChapterCallback.value = $(() => {
                                      contentEditorValue.value = chapterObj.content_slate
                                        ? JSON.parse(chapterObj.content_slate)
                                        : undefined;
                                      renderedHTML.value = chapterObj.renderedHTML || undefined;
                                      oldChapter.value = chapterObj.id;
                                      chapterId.value = chapterObj.id;
                                      courseId.value = topic.id;
                                      if (chapterObj.audio_track_asset_id)
                                        audioAssetId.value = chapterObj.audio_track_asset_id;
                                      isEditing.value = true;
                                      isRequestingChapter.value = "";
                                      chapterName.value = chapterObj.name;
                                    });

                                    contentWS.value.send(
                                      JSON.stringify({
                                        type: "openContent",
                                        userId: userId + "###" + timeStamp.value,
                                        contentId: chapterObj.id,
                                        courseId: topic.id,
                                        avatar_url: avatar_url,
                                      })
                                    );

                                    isRequestingChapter.value = chapterObj.id;

                                    isRequestingChapterTimeout.value = setTimeout(() => {
                                      alert("Server Timeout! Server might be down!");
                                      isRequestingChapter.value = "";
                                      isRequestingChapterCallback.value = undefined;
                                    }, 7000);
                                  }
                                }}
                                class={"flex w-full items-center justify-between gap-4"}
                              >
                                <h3 class="text-left tracking-wide">{chapterObj.name}</h3>
                                {isRequestingChapter.value === chapterObj.id && (
                                  <span>
                                    <svg
                                      aria-hidden="true"
                                      class="inline-block h-4 w-4 animate-spin fill-background-light-gray text-primary-dark-gray"
                                      viewBox="0 0 100 101"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                      />
                                      <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"
                                      />
                                    </svg>
                                  </span>
                                )}
                                {courseIdToEditingUser[chapterObj.id] && (
                                  <img
                                    src={courseIdToEditingUser[chapterObj.id][1]}
                                    alt=""
                                    width="30"
                                    height="30"
                                    referrerPolicy="no-referrer"
                                    class={
                                      "rounded-full object-contain" +
                                      (oldChapter.value === chapterObj.id
                                        ? " rounded-full border-2 border-tomato"
                                        : "")
                                    }
                                  />
                                )}
                              </button>
                              <button
                                onClick$={() => {
                                  editChapter[topic.id][chapterIndex].settingsInfo.name =
                                    chapterObj.name;
                                  editChapter[topic.id][
                                    chapterIndex
                                  ].settingsInfo.requireSubscription = chapterObj.is_premium;
                                  editChapter[topic.id][chapterIndex].openEdit =
                                    !editChapter[topic.id][chapterIndex].openEdit;
                                }}
                                class="text-[20px] text-primary-dark-gray"
                              >
                                <LuSettings />
                              </button>
                            </div>
                            {editChapter[topic.id] &&
                              editChapter[topic.id][chapterIndex] &&
                              editChapter[topic.id][chapterIndex].openEdit && (
                                <form
                                  preventdefault:submit
                                  onSubmit$={async (e) => {
                                    if (!e.target) return;
                                    const d = Object.fromEntries(
                                      new FormData(e.target as HTMLFormElement).entries()
                                    );
                                    const schema = z.object({
                                      coursename: z
                                        .string()
                                        .trim()
                                        .min(1, "Chapter name cannot be empty!")
                                        .max(100, "Chapter name cannot be longer than 100 chars!"),
                                      sub: z.literal("on").optional(),
                                    });
                                    const parseResult = schema.safeParse(d);
                                    if (!parseResult.success) {
                                      editChapter[topic.id][chapterIndex].settingsError.name =
                                        parseResult.error.issues[0].message;
                                      return;
                                    }
                                    editChapter[topic.id][chapterIndex].isEditing = true;
                                    const slug = parseResult.data.coursename
                                      .toLowerCase()
                                      .split(" ")
                                      .join("-");
                                    const courseId = topic.id;
                                    const chapterId = chapterObj.id;
                                    let chapterWithSlug: Content[] | undefined;
                                    try {
                                      chapterWithSlug = await server$(
                                        async () =>
                                          await drizzleClient()
                                            .select()
                                            .from(content)
                                            .where(
                                              and(
                                                eq(content.slug, slug),
                                                eq(content.index_id, courseId)
                                              )
                                            )
                                      )();
                                    } catch (e) {
                                      editChapter[topic.id][chapterIndex].isEditing = false;
                                      editChapter[topic.id][chapterIndex].settingsError.name = (
                                        e as any
                                      ).toString();
                                      return;
                                    }
                                    if (
                                      chapterWithSlug.length > 0 &&
                                      chapterWithSlug[0].id !== chapterObj.id
                                    ) {
                                      console.log(
                                        "slug already exists",
                                        settingsCourseError,
                                        index
                                      );
                                      editChapter[topic.id][chapterIndex].settingsError.name =
                                        "Chapter with this name already exist!";
                                      editChapter[topic.id][chapterIndex].isEditing = false;
                                      return;
                                    }
                                    const values = {
                                      name: parseResult.data.coursename,
                                      slug: slug,
                                      is_premium: !!parseResult.data.sub,
                                      link: defaultChapter(topic.slug, slug),
                                    };
                                    let ret: Content | undefined = undefined;
                                    try {
                                      ret = await server$(async () => {
                                        return (
                                          await drizzleClient()
                                            .update(content)
                                            .set(values)
                                            .where(eq(content.id, chapterId))
                                            .returning()
                                        )[0];
                                      })();
                                    } catch (e) {
                                      editChapter[topic.id][chapterIndex].isEditing = false;
                                      editChapter[topic.id][chapterIndex].settingsError.name = (
                                        e as any
                                      ).toString();
                                      return;
                                    }
                                    editChapter[topic.id][chapterIndex].isEditing = false;
                                    editChapter[topic.id][chapterIndex].settingsInfo.name = "";
                                    editChapter[topic.id][
                                      chapterIndex
                                    ].settingsInfo.requireSubscription = false;
                                    editChapter[topic.id][chapterIndex].openEdit = false;
                                    editChapter[topic.id][chapterIndex].settingsError.name = "";

                                    if (contentWS.value)
                                      contentWS.value.send(
                                        JSON.stringify({
                                          type: "editContentDetails",
                                          details: ret,
                                          courseId: topic.id,
                                          chapterId: chapterObj.id,
                                        })
                                      );
                                  }}
                                  class="my-4 gap-2"
                                >
                                  <div>
                                    <label for="coursename" class="cursor-pointer">
                                      Chapter Name
                                    </label>
                                    <div class="pt-1">
                                      <input
                                        id="coursename"
                                        name="coursename"
                                        type="text"
                                        value={
                                          editChapter[topic.id][chapterIndex].settingsInfo.name
                                        }
                                        onInput$={(_, el) =>
                                          (editChapter[topic.id][chapterIndex].settingsInfo.name =
                                            el.value)
                                        }
                                        required
                                        class={
                                          "block w-full rounded-md border-2 px-3 py-2 " +
                                          (editChapter[topic.id][chapterIndex].settingsError.name
                                            ? "border-tomato"
                                            : "border-black/10")
                                        }
                                      />
                                    </div>
                                    <p class="w-full pt-1 text-tomato">
                                      {(() => {
                                        return editChapter[topic.id][chapterIndex].settingsError
                                          .name;
                                      })()}
                                    </p>
                                  </div>
                                  <div class="flex items-center gap-4">
                                    <label for="sub" class="cursor-pointer">
                                      Subscription required
                                    </label>
                                    <div>
                                      <input
                                        id="sub"
                                        name="sub"
                                        type="checkbox"
                                        checked={
                                          editChapter[topic.id][chapterIndex].settingsInfo
                                            .requireSubscription
                                        }
                                        onChange$={(e) => {
                                          if (e.target)
                                            editChapter[topic.id][
                                              chapterIndex
                                            ].settingsInfo.requireSubscription = (
                                              e.target as HTMLInputElement
                                            ).checked;
                                        }}
                                        class={"block h-4 w-4 rounded-md border-2 border-black/10"}
                                      />
                                    </div>
                                  </div>
                                  <br />
                                  <div class="flex gap-3">
                                    <button
                                      disabled={editChapter[topic.id][chapterIndex].isEditing}
                                      type="submit"
                                      class="rounded-lg bg-primary-dark-gray px-4 py-2 text-background-light-gray shadow-md"
                                    >
                                      {editChapter[topic.id][chapterIndex].isEditing && (
                                        <span>
                                          <svg
                                            aria-hidden="true"
                                            class="inline-block h-4 w-4 animate-spin fill-background-light-gray text-primary-dark-gray"
                                            viewBox="0 0 100 101"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                              fill="currentColor"
                                            />
                                            <path
                                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                              fill="currentFill"
                                            />
                                          </svg>
                                        </span>
                                      )}
                                      {!editChapter[topic.id][chapterIndex].isEditing && (
                                        <span class="">Confirm Edit</span>
                                      )}
                                    </button>
                                    <button
                                      type="button"
                                      class="rounded-lg bg-tomato p-2 text-[20px] text-background-light-gray shadow-md"
                                      onClick$={() => {
                                        if (!contentWS.value) return;
                                        if (isDeletingChapterCallback.value) return;
                                        if (
                                          !window.confirm(
                                            "Are you sure you want to delete the chapter?"
                                          )
                                        )
                                          return;
                                        const courseId = topic.id;
                                        const chapterId = chapterObj.id;
                                        const newChapterOrder = topic.chapter_order.filter(
                                          (id) => id !== chapterId
                                        );
                                        isDeletingChapterCallback.value = $(async () => {
                                          await server$(async () => {
                                            try {
                                              await drizzleClient().transaction(async (tx) => {
                                                await tx
                                                  .update(content_index)
                                                  .set({ chapter_order: newChapterOrder })
                                                  .where(eq(content_index.id, courseId));
                                                await tx
                                                  .delete(content)
                                                  .where(eq(content.id, chapterId));
                                              });
                                            } catch (e) {
                                              /* empty */
                                            }
                                          })();

                                          isDeletingChapter.value = "";
                                        });

                                        contentWS.value.send(
                                          JSON.stringify({
                                            type: "deleteContent",
                                            userId: userId,
                                            contentId: chapterObj.id,
                                            courseId: topic.id,
                                          })
                                        );

                                        isDeletingChapter.value = chapterObj.id;

                                        isDeletingChapterTimeout.value = setTimeout(() => {
                                          alert("Server Timeout! Server might be down!");
                                          isDeletingChapter.value = "";
                                          isDeletingChapterCallback.value = undefined;
                                        }, 7000);
                                      }}
                                    >
                                      {isDeletingChapter.value === chapterObj.id ? (
                                        <svg
                                          aria-hidden="true"
                                          class="inline-block h-4 w-4 animate-spin fill-background-light-gray text-primary-dark-gray"
                                          viewBox="0 0 100 101"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                            fill="currentColor"
                                          />
                                          <path
                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                            fill="currentFill"
                                          />
                                        </svg>
                                      ) : (
                                        <LuTrash />
                                      )}
                                    </button>
                                  </div>
                                </form>
                              )}
                          </li>
                        );
                      else return null;
                    })}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div class="flex h-full w-full items-center justify-center">
            <span>
              <svg
                aria-hidden="true"
                class="inline-block h-4 w-4 animate-spin fill-background-light-gray text-primary-dark-gray"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            </span>
          </div>
        )}
      </nav>
    );
  }
);
