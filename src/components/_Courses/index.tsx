import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link, server$, useNavigate } from "@builder.io/qwik-city";
import { IoReaderOutline, IoRocketOutline } from "@qwikest/icons/ionicons";
import { LuArrowRight, LuGem } from "@qwikest/icons/lucide";
import { eq } from "drizzle-orm";
import Footer from "~/components/Footer";
import HeartSVG from "~/components/HeartSVG";
import Nav from "~/components/Nav";
import { difficultyLabels } from "~/const/difficulty";
import {
  useCategoryLoader,
  useCourseLoader,
  useTagLoader,
  useUserLoaderNullable,
} from "~/routes/(lang)/(wrapper)/courses/[courseSlug]/layout";
import drizzleClient from "~/utils/drizzleClient";
import { profiles } from "../../../drizzle_turso/schema/profiles";
import { listSupportedLang } from "../../../lang";

const getFavourite = server$(async function (id: string) {
  return (
    (
      await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === "1")
        .select({ favourite_courses: profiles.favourite_courses })
        .from(profiles)
        .where(eq(profiles.id, id))
    )[0]?.favourite_courses || []
  );
});

const setFavouriteDB = server$(async function (userId: string, courseId: string) {
  const favourite_courses = await getFavourite(userId);
  favourite_courses.push(courseId);
  return await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === "1")
    .update(profiles)
    .set({ favourite_courses })
    .where(eq(profiles.id, userId))
    .returning();
});

const removeFavouriteDB = server$(async function (userId: string, courseId: string) {
  const favourite_courses = await getFavourite(userId);
  const index = favourite_courses.indexOf(courseId);
  if (index >= 0) favourite_courses.splice(index, 1);
  return await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === "1")
    .update(profiles)
    .set({ favourite_courses })
    .where(eq(profiles.id, userId))
    .returning();
});

const setFavouriteCookie = server$(function (courseId: string) {
  this.cookie.set("favourite" + courseId, 1, {
    path: "/",
    maxAge: [12, "weeks"],
    httpOnly: true,
    sameSite: "lax",
    secure: true,
  });
});

const removeFavouriteCookie = server$(function (courseId: string) {
  this.cookie.delete("favourite" + courseId, {
    path: "/",
  });
});

export default component$(() => {
  const userNullable = useUserLoaderNullable().value;
  const { course, preview, chapters, isFavourited } = useCourseLoader().value;
  const tags = useTagLoader().value;
  const categories = useCategoryLoader().value;

  const isFavourite = useSignal(isFavourited);
  const nav = useNavigate();

  const toggleFavourite = $(() => {
    if (!userNullable) return nav("/login/");
    isFavourite.value = !isFavourite.value;
    if (isFavourite.value) {
      setFavouriteDB(userNullable.userId, course.content_index.id).catch(() => {
        isFavourite.value = false;
        removeFavouriteCookie(course.content_index.id);
      });
      setFavouriteCookie(course.content_index.id);
    } else {
      removeFavouriteDB(userNullable.userId, course.content_index.id).catch(() => {
        isFavourite.value = true;
        setFavouriteCookie(course.content_index.id);
      });
      removeFavouriteCookie(course.content_index.id);
    }
  });

  useVisibleTask$(async () => {
    if (!userNullable) return;
    const favourite = await getFavourite(userNullable.userId);
    if (favourite.includes(course.content_index.id)) {
      isFavourite.value = true;
      setFavouriteCookie(course.content_index.id);
    } else {
      isFavourite.value = false;
      removeFavouriteCookie(course.content_index.id);
    }
  });

  const nextCourseLink = course.content_user_progress
    ? chapters.find(
        (chapter) =>
          chapter.id ===
          course.content_index.chapter_order.filter(
            (id) => !course.content_user_progress!.progress.includes(id)
          )[0]
      )?.link ||
      chapters.find((chapter) => chapter.id === course.content_index.chapter_order[0])!.link!
    : "";

  return (
    <section class="min-h-[100vh] bg-light-yellow dark:bg-primary-dark-gray dark:text-background-light-gray">
      <Nav user={userNullable} />
      <article class="mx-auto flex min-h-[100vh] w-[95%] max-w-[800px] flex-col gap-3 py-4 md:w-[80%] md:gap-6 lg:w-[70%]">
        <Link
          href={"/catalog/"}
          class="ml-2 flex items-center gap-2 self-start  text-sm tracking-wide  md:-mb-4 md:text-base"
        >
          <span>All courses</span>{" "}
          <span class="-mt-[2px] block text-[15px] text-primary-dark-gray dark:text-background-light-gray md:mt-0 md:text-[20px]">
            <LuArrowRight />
          </span>
        </Link>
        <section class="flex flex-col gap-3 rounded-xl border-2 border-primary-dark-gray bg-background-light-gray p-4 dark:bg-highlight-dark dark:text-background-light-gray  md:gap-4 md:p-6 lg:p-8">
          <h1 class="font-mosk text-xl tracking-wider md:text-2xl lg:text-3xl">
            {course.content_index.name}
            {preview && (
              <span class="pl-4 text-xs tracking-normal md:text-sm lg:text-base">Preview Mode</span>
            )}
          </h1>
          <p class="whitespace-pre-line text-base tracking-wide md:text-lg lg:text-xl">
            {course.content_index.short_description}
            {/* Lorem ipsum dolor sit amet consectetur adipisicing elit.{"\n"}
            Magni perspiciatis provident quos id tempora ipsum, quidem obcaecati sunt minus porro? */}
          </p>
          <p class="flex items-center gap-2 text-base tracking-wide md:gap-4 md:text-lg lg:text-xl">
            <span class="text-[15px] text-primary-dark-gray dark:text-background-light-gray md:text-[20px]">
              <IoReaderOutline />
            </span>
            {course.content_index.chapter_order.length} chapter
            {course.content_index.chapter_order.length > 1 ? "s" : ""}
          </p>
          <p class="flex items-center gap-2 text-base tracking-wide md:gap-4 md:text-lg lg:text-xl">
            <span class="text-[15px] text-primary-dark-gray dark:text-background-light-gray md:text-[20px]">
              <IoRocketOutline />
            </span>
            <span
              class={`border-b-2 md:border-b-4 ${
                course.content_index.difficulty === "easy"
                  ? "border-sea"
                  : course.content_index.difficulty === "intermediate"
                  ? "border-yellow"
                  : "border-pink"
              }`}
            >
              {difficultyLabels[course.content_index.difficulty]}
            </span>
          </p>
        </section>
        <section class="mx-auto flex w-[90%] flex-col gap-3 md:flex-row md:gap-6 lg:gap-12">
          <div class="order-2 flex flex-1 flex-col gap-3 pb-12 md:order-1 md:gap-4">
            {course.content_index.is_premium && (
              <div class="flex flex-col gap-1 md:gap-2">
                <p class="flex items-center gap-2 text-sm text-tomato dark:text-pink md:gap-3 md:text-base">
                  <span class="text-[15px] md:text-[20px]">
                    <LuGem />
                  </span>
                  <span>Subscription Required</span>
                </p>
              </div>
            )}
            <div class="flex flex-col gap-1 md:gap-2">
              <h2 class="font-mosk text-base tracking-wide md:text-lg lg:text-xl">
                Course Description
              </h2>
              <p class="text-sm md:text-base">
                {course.content_index.description}
                {/* Lorem ipsum, dolor sit amet consectetur adipisicing elit. Natus, sit doloribus?
                Dolores soluta voluptates suscipit quisquam aperiam aspernatur saepe doloribus nihil
                dolor aliquid! Doloribus quod earum, molestiae sequi aliquid rem, est facilis
                blanditiis ut autem asperiores! Doloremque, sequi reiciendis reprehenderit, ipsum
                nemo cumque numquam ea hic quisquam quam exercitationem laborum. */}
              </p>
            </div>
            {!course.content_index.is_single_page && (
              <div class="flex flex-col gap-1 md:gap-2">
                <h2 class="font-mosk text-base tracking-wide md:text-lg lg:text-xl">
                  Course Chapters
                </h2>

                <ul class="flex flex-col gap-2 text-base md:gap-3 lg:text-lg">
                  {chapters.map((chapter) => (
                    <li key={chapter.id} class="flex items-center gap-2">
                      <span>{chapter.name}</span>
                      {chapter.is_premium && (
                        <span class="text-[14px] text-tomato dark:text-pink md:text-[16px] lg:text-[18px]">
                          <LuGem />
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div class="flex flex-col gap-1 md:gap-2">
              <h2 class="font-mosk text-base tracking-wide md:text-lg lg:text-xl">Course Author</h2>
              <p class="flex items-center gap-2 text-sm md:gap-3 md:text-base">
                <span>{course.profiles.nickname}</span>
                <span>
                  <img
                    src={course.profiles.avatar_url}
                    width={25}
                    height={25}
                    referrerPolicy="no-referrer"
                    class="h-[20px] w-[20px] rounded-full md:h-[25px] md:w-[25px]"
                  />
                </span>
              </p>
            </div>
            <div class="flex flex-col gap-1 md:gap-2">
              <h2 class="font-mosk text-base tracking-wide md:text-lg lg:text-xl">
                Course Language
              </h2>
              <p class="text-sm md:text-base">
                {
                  listSupportedLang.find((_lang) => _lang.value === course.content_index.lang)
                    ?.label
                }
              </p>
            </div>
            <p class="text-gary-500 pt-3 text-xs italic dark:text-gray-300 md:pt-6">
              Last Edited On: {course.content_index.updated_at.toString().split(" ")[0]}
            </p>
          </div>
          <div class="order-1 flex w-full flex-col gap-3 text-sm md:order-2 md:w-[280px] md:text-base">
            <div class="flex flex-col gap-3 p-3 px-0 md:gap-4 md:p-4">
              <div class="flex gap-2 md:gap-3">
                <span>Category:</span>
                <p class="border-b-2 border-primary-dark-gray dark:border-background-light-gray">
                  <Link
                    href={
                      categories.find((_category) => _category.id === course.content_index.category)
                        ?.link
                    }
                    prefetch
                  >
                    {categories.find((_category) => _category.id === course.content_index.category)
                      ?.name || ""}
                  </Link>
                </p>
              </div>
              <div class="flex gap-2 md:gap-3">
                <span>Tags:</span>
                <ul class="flex flex-wrap gap-2">
                  {(course.content_index.tags || []).map((_tag) => {
                    const tagObj = tags.find((__tag) => __tag.id === _tag);
                    if (!tagObj) return null;
                    return (
                      <li
                        key={_tag}
                        class="border-b-2 border-primary-dark-gray dark:border-background-light-gray"
                      >
                        <Link href={tagObj.link} prefetch>
                          {tagObj.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            {!course.content_user_progress && (
              <Link
                href={
                  chapters.find((chapter) => course.content_index.chapter_order[0] === chapter.id)
                    ?.link || undefined
                }
                prefetch
                class="rounded-lg bg-primary-dark-gray p-2 text-center text-sm tracking-wide text-background-light-gray dark:bg-disabled-dark md:p-3 md:text-base"
              >
                Start Course Now :D
              </Link>
            )}
            {course.content_user_progress !== null && (
              <Link
                href={nextCourseLink}
                prefetch
                class="rounded-lg bg-primary-dark-gray p-2 text-center text-sm tracking-wide text-background-light-gray dark:bg-disabled-dark md:p-3 md:text-base"
              >
                Continue Course :D
              </Link>
            )}
            <div class="flex flex-col gap-3 p-3 px-0 pt-0 md:gap-4 md:p-4 md:pt-0">
              <button
                onClick$={toggleFavourite}
                class="flex items-center justify-center text-sm tracking-wide underline decoration-wavy underline-offset-4 md:text-base lg:underline-offset-[6px]"
              >
                <span class="flex items-center gap-3">
                  <span>{isFavourite.value ? "Remove from Favourite" : "Add to Favourite"}</span>
                  {/* <span class="text-[12px] text-primary-dark-gray dark:text-background-light-gray md:text-[15px]">
                    <LuHeart />
                  </span> */}
                  <span class="h-[20px] w-[20px] fill-tomato stroke-tomato dark:fill-pink dark:stroke-pink">
                    <HeartSVG checked={isFavourite} />
                  </span>
                </span>
              </button>
            </div>
          </div>
        </section>
      </article>
      <Footer />
    </section>
  );
});
