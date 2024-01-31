import type { NoSerialize, QRL, Signal } from "@builder.io/qwik";
import { $, component$, useSignal, useStore } from "@builder.io/qwik";
import { server$, z } from "@builder.io/qwik-city";
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import ArrowDown from "~/assets/svg/caret-down-outline.svg";
import defaultChapter from "~/const/defaultChapter";
import defaultCourse from "~/const/defaultCourse";
import type roles from "~/const/roles";
import { useContent } from "~/routes/[lang.]/(wrapper)/(authRoutes)/contenteditor";
import drizzleClient from "~/utils/drizzleClient";
import type { Content, NewContent } from "../../../drizzle_turso/schema/content";
import { content } from "../../../drizzle_turso/schema/content";
import type { ContentIndex, NewContentIndex } from "../../../drizzle_turso/schema/content_index";
import { content_index } from "../../../drizzle_turso/schema/content_index";
import { profiles } from "../../../drizzle_turso/schema/profiles";

export default component$(
  ({
    contentWS,
    contentEditorValue,
    renderedHTML,
    userId,
    userRole,
    isEditing,
    chapterId,
    audioAssetId,
    courseIdToEditingUser,
    isRequestingChapterCallback,
    isRequestingChapterTimeout,
    isRequestingChapter,
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
    audioAssetId: Signal<string | undefined>;
    courseIdToEditingUser: Record<string, [string, string]>;
    isRequestingChapterCallback: Signal<QRL<() => any> | undefined>;
    isRequestingChapterTimeout: Signal<any>;
    isRequestingChapter: Signal<boolean>;
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

    const openAddCourse = useSignal(false);
    const isCreatingNewCourse = useSignal(false);
    const newCourseInfo = useStore({
      name: "",
      requireSubscription: false,
    });
    const newCourseError = useStore({
      name: "",
    });

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
    return (
      <nav class="h-full max-h-[100vh] w-[20vw] overflow-auto border-r-2 border-yellow bg-light-yellow/50 p-4">
        {contentWS.value ? (
          <ul class="flex flex-col gap-6 pt-4">
            <button
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
                    newCourseError.name = "";
                    openAddCourse.value = false;
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
            )}
            {topics.map((topic, index) => (
              <li key={`ContentEditor${topic.slug}`}>
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
                </div>
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
                      chapters.push(ret[0]);
                      topics.splice(index, 1, ret[1]);
                      isCreatingNewChapter[index] = false;
                      newChapterInfo[index].name = "";
                      newChapterInfo[index].requireSubscription = false;
                      openAddChapter[index] = false;
                      newChapterError[index].name = "";
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
                            (newCourseError.name ? "border-tomato" : "border-black/10")
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
                {navOpen[index] && (
                  <ul class="flex flex-col gap-4 pt-4">
                    {topic.chapter_order.map((chapter) => {
                      const chapterObj = chapters.find((t) => t.id === chapter);
                      if (chapterObj)
                        return (
                          <li
                            onClick$={() => {
                              if (contentWS.value) {
                                if (oldChapter.value) {
                                  if (
                                    hasChanged.value &&
                                    !window.confirm(
                                      "You have unsaved changes. Are you sure you want to leave/switch editing?"
                                    )
                                  )
                                    return;
                                  if (oldChapter.value === chapterObj.id) {
                                    isEditing.value = false;
                                    contentWS.value.send(
                                      JSON.stringify({
                                        type: "closeContent",
                                        userId: userId + "###" + timeStamp.value,
                                        contentId: oldChapter.value,
                                      })
                                    );
                                    oldChapter.value = "";
                                    return;
                                  }
                                  contentWS.value.send(
                                    JSON.stringify({
                                      type: "closeContent",
                                      userId: userId + "###" + timeStamp.value,
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
                                  if (chapterObj.audio_track_asset_id)
                                    audioAssetId.value = chapterObj.audio_track_asset_id;
                                  isEditing.value = true;
                                  isRequestingChapter.value = false;
                                  chapterName.value = chapterObj.name;
                                });

                                contentWS.value.send(
                                  JSON.stringify({
                                    type: "openContent",
                                    userId: userId + "###" + timeStamp.value,
                                    contentId: chapterObj.id,
                                    avatar_url: avatar_url,
                                  })
                                );

                                isRequestingChapter.value = true;

                                isRequestingChapterTimeout.value = setTimeout(() => {
                                  alert("Server Timeout! Server might be down!");
                                  isRequestingChapter.value = false;
                                  isRequestingChapterCallback.value = undefined;
                                }, 7000);
                              }
                            }}
                            key={`ContentEditor${topic.slug}${chapter}`}
                          >
                            <button class={"flex w-full items-center justify-between gap-4"}>
                              <h3 class="text-left tracking-wide">{chapterObj.name}</h3>
                              {isRequestingChapter.value && (
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
