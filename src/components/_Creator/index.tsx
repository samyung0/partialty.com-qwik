import type { QRL, Signal } from "@builder.io/qwik";
import { component$, useSignal } from "@builder.io/qwik";

import Nav from "~/components/Nav";
import { useUserLoader } from "~/routes/[lang.]/(wrapper)/(authRoutes)/layout";
import type { ContentCategory } from "../../../drizzle_turso/schema/content_category";
import type { ContentIndex } from "../../../drizzle_turso/schema/content_index";
import type { Profiles } from "../../../drizzle_turso/schema/profiles";
import type { Tag } from "../../../drizzle_turso/schema/tag";
import Course from "./Course";

const tabs = [{ name: "Course" }, { name: "Project" }];

export default component$(
  ({
    userAccessibleCourseWrite,
    userAccessibleCourseWriteResolved,
    tags,
    categories,
    courseIdToEditingUser,
    isDeletingChapter,
    isDeletingChapterCallback,
  }: {
    userAccessibleCourseWrite: string[];
    userAccessibleCourseWriteResolved: { content_index: ContentIndex; profiles: Profiles }[];
    tags: Tag[];
    categories: ContentCategory[];
    courseIdToEditingUser: Record<string, [string, string]>;
    isDeletingChapter: Signal<string>;
    isDeletingChapterCallback: Signal<QRL<() => any> | undefined>;
  }) => {
    const user = useUserLoader().value;
    const tabIndex = useSignal(0);
    return (
      <section class="min-h-[100vh] bg-light-yellow dark:bg-primary-dark-gray dark:text-background-light-gray">
        <Nav user={user} />
        <div class="mx-auto flex max-w-[80%] pt-6">
          <div class="flex w-[20%] flex-col gap-4">
            <div class="self-center">
              <img
                class="h-[100px] w-[100px] rounded-full object-cover"
                src={user.avatar_url}
                width={100}
                height={100}
              />
              <p class="p-1 text-center font-mosk text-lg tracking-wide">{user.nickname}</p>
            </div>
            <div class="flex flex-col">
              {tabs.map((tab, idx) => (
                <div class="relative flex h-full gap-1" key={`tab-${idx}`}>
                  <div
                    class={
                      "h-full w-[5px] rounded-lg " +
                      (idx === tabIndex.value
                        ? "bg-yellow"
                        : "bg-light-yellow dark:bg-primary-dark-gray")
                    }
                  ></div>

                  <button
                    class={`w-full rounded-md bg-light-yellow p-2 text-left hover:brightness-90 dark:bg-primary-dark-gray dark:hover:brightness-150 ${
                      idx === tabIndex.value && "brightness-90 dark:brightness-150"
                    }`}
                    onClick$={() => {
                      tabIndex.value = idx;
                    }}
                  >
                    {tab.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div class="w-full ">
            {tabIndex.value === 0 && (
              <Course
                userAccessibleCourseWrite={userAccessibleCourseWrite}
                userAccessibleCourseWriteResolved={userAccessibleCourseWriteResolved}
                tags={tags}
                categories={categories}
                courseIdToEditingUser={courseIdToEditingUser}
                isDeletingChapter={isDeletingChapter}
                isDeletingChapterCallback={isDeletingChapterCallback}
              />
            )}
          </div>
        </div>
      </section>
    );
  }
);
