import { Slot, component$, useSignal } from "@builder.io/qwik";
import { Link, routeLoader$, useLocation } from "@builder.io/qwik-city";
import { eq } from "drizzle-orm";
import SmallNav from "~/components/SmallNav";
import {
  useCourseLoader,
  useUserLoaderNullable,
} from "~/routes/[lang.]/(wrapper)/courses/[courseSlug]/layout";
import drizzleClient from "~/utils/drizzleClient";
import type { Content } from "../../../../../../../../drizzle_turso/schema/content";
import { content } from "../../../../../../../../drizzle_turso/schema/content";

import { LuArrowRight, LuGem } from "@qwikest/icons/lucide";
import { cn } from "~/utils/cn";

export const useCurrentChapter = routeLoader$(async (event) => {
  const _user = await event.resolveValue(useUserLoaderNullable);
  const { course, chapters } = await event.resolveValue(useCourseLoader);
  const currentChapterSlug = event.params.chapterSlug;

  const currentChapterFiltered = chapters.find((c) => c.slug === currentChapterSlug);
  if (!currentChapterFiltered) throw event.redirect(302, "/notfound/");

  if (course.content_index.is_premium && !_user) throw event.redirect(302, "/login/");
  if (currentChapterFiltered.is_premium && !_user) throw event.redirect(302, "/login/");

  const ret: { subscriptionNeeded: boolean; loaded: boolean; currentChapter: Content | null } = {
    subscriptionNeeded: false,
    loaded: false,
    currentChapter: null,
  };

  if (
    (course.content_index.is_premium || currentChapterFiltered.is_premium) &&
    _user &&
    _user.role === "free"
  )
    ret.subscriptionNeeded = true;
  else {
    const chapter = (
      await drizzleClient().select().from(content).where(eq(content.id, currentChapterFiltered.id))
    )[0];
    if (!chapter) throw event.redirect(302, "/notfound/");
    ret.currentChapter = chapter;
    ret.loaded = true;
  }

  return ret;
});

export default component$(() => {
  const openSideNav = useSignal(false);
  const userNullable = useUserLoaderNullable().value;
  const { course, preview, chapters } = useCourseLoader().value;
  const { currentChapter, loaded, subscriptionNeeded } = useCurrentChapter().value;
  const chapterSlug = useLocation().params.chapterSlug;
  return (
    <>
      <section class="flex min-h-[100vh] flex-col bg-background-light-gray dark:bg-primary-dark-gray dark:text-background-light-gray">
        <div class="flex flex-1">
          <nav class="max-h-[100vh] min-h-full w-[20%] min-w-[300px] max-w-[500px] overflow-auto bg-pale-yellow/50 pl-6 pr-6 dark:bg-disabled-dark lg:w-[30%] 2xl:w-[40%] 2xl:pl-[10%]">
            <div class="flex flex-col items-start gap-4 py-6">
              <SmallNav user={userNullable} />
              <div class="flex flex-col gap-2 py-2 lg:gap-4 lg:py-4  ">
                <div class="flex flex-col">
                  <Link
                    href={"/catalog/"}
                    class="mb-6 flex items-center gap-2 text-sm tracking-wide text-gray-500 dark:text-background-light-gray"
                  >
                    <span>All courses</span>{" "}
                    <span class="-mt-[4px] block text-[15px] text-gray-500 dark:text-background-light-gray">
                      <LuArrowRight />
                    </span>
                  </Link>
                  {preview && (
                    <p class="font-mosk text-xs tracking-wide text-deep-sea lg:text-sm">
                      Preview Mode
                    </p>
                  )}
                  <p class="text-base tracking-wide lg:text-lg">{course.content_index.name}</p>
                </div>
                <ul class="flex flex-col gap-3 border-l-2 border-middle-yellow py-2 text-sm text-gray-400 dark:border-gray-500 dark:text-gray-500 lg:text-base">
                  {course.content_index.chapter_order.map((chapterId) => {
                    const chapter = chapters.find((c) => c.id === chapterId);
                    if (!chapter) return null;
                    const isActive = chapter.slug === chapterSlug;
                    return (
                      <li
                        key={chapter.id}
                        class={cn(
                          "relative pl-6 after:absolute after:left-[-4px] after:top-[50%] after:z-10 after:hidden after:size-[8px] after:translate-y-[-4px] after:rounded-full after:bg-middle-yellow hover:after:block lg:after:left-[-5px] lg:after:size-[10px] lg:after:translate-y-[-5px]",
                          isActive && "text-deep-sea after:block after:bg-sea dark:text-sea"
                        )}
                      >
                        <Link prefetch href={chapter.link || undefined}>
                          {chapter.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </nav>
          <div class="flex-1">
            {loaded && <Slot />}
            {!loaded && (
              <section class="flex h-full flex-col items-center justify-center gap-2 px-3 text-center md:gap-4 md:px-6 lg:px-8">
                <h1 class="flex flex-wrap items-center justify-center font-mosk text-lg font-bold tracking-wide md:text-xl lg:text-3xl">
                  <span class="whitespace-nowrap">Aiya, Looks Like You Need to&nbsp;</span>
                  <span class="highlight-mint flex items-center px-6 dark:highlight-mint-down dark:px-6">
                    <span>Subscribe&nbsp;</span>
                    <span class="text-[15px] md:text-[20px]">
                      <LuGem />
                    </span>
                  </span>
                  <span>&nbsp;First</span>
                </h1>
                <p class="text-sm md:text-base lg:text-lg">
                  This part of the content requires a subscription. Head over to{" "}
                  <Link href={"/profile/"} class="underline decoration-wavy underline-offset-4">
                    profiles
                  </Link>{" "}
                  and subscribe at only $5 per month. You can cancel anytime.{" "}
                </p>
              </section>
            )}
          </div>
        </div>
      </section>
    </>
  );
});
