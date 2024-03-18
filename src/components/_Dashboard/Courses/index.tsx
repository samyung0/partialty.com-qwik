import { component$, useComputed$, useSignal, useStore } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { IoCaretDown, IoReaderOutline } from "@qwikest/icons/ionicons";
import { useDBLoader } from "~/routes/[lang.]/(wrapper)/(authRoutes)/members/dashboard/layout";
// import SearchSVG from "~/assets/svg/search-outline.svg";

// import Fuse from "fuse.js";

export default component$(() => {
  const { data, chapters } = useDBLoader().value;
  const courseObj = useStore(() => {
    const obj: Record<string, { opened: boolean }> = {};
    for (const i of data) obj[i.content_index.id] = { opened: false };
    return obj;
  });
  // const fuseCourse = useSignal<any>();
  // const searchCourse = useSignal("");
  const showAll = useSignal(false);
  const sortedCourses = useComputed$(() =>
    data.toSorted(
      (a, b) =>
        new Date(b.content_user_progress.started_date).getTime() -
        new Date(a.content_user_progress.started_date).getTime()
    )
  );
  const displayCourses = useComputed$(() =>
    showAll.value ? sortedCourses.value : sortedCourses.value.slice(0, 3)
  );

  // useVisibleTask$(() => {
  //   fuseCourse.value = noSerialize(
  //     new Fuse(coursesObj.value, {
  //       threshold: 0.4,
  //       keys: [
  //         "slug",
  //         "name",
  //         "chapterOrder",
  //         ...coursesObj.value
  //           .map((course) => {
  //             const arr = course.chapterOrder.map((chapter) => ["chapters", chapter, "name"]);
  //             return [...arr];
  //           })
  //           .flat(),
  //       ],
  //     })
  //   );
  // });

  // useTask$(({ track }) => {
  //   track(searchCourse);
  //   if (!fuseCourse.value) return;
  //   console.log(fuseCourse.value.search(searchCourse.value));
  // });

  return (
    <article class="mx-auto w-[95%] py-4 md:w-[80%]">
      <div class="w-[100%] pb-1 lg:w-[85%] xl:w-[70%]">
        <div class="flex items-end justify-between">
          <h1 class="pb-1 font-mosk text-2xl font-bold tracking-wide lg:text-4xl">My Courses</h1>
          {/* <div class="flex gap-2">
            <img src={SearchSVG} alt="Search" width={20} height={20} />
            <input
              type="text"
              bind:value={searchCourse}
              placeholder="Search your courses..."
              class="border-b-2 border-primary-dark-gray bg-transparent p-1 outline-none"
            />
          </div> */}
        </div>
        <ul class="flex flex-col gap-2 py-2">
          {displayCourses.value.map((data) => {
            const currentCourse = data.content_index;
            const currentChapters = data.content_index.chapter_order
              .map((id) => chapters.find((chapter) => chapter.id === id)!)
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              .filter((x) => x !== undefined);
            const completedChapters = data.content_user_progress.progress;
            return (
              <li
                class={
                  "flex flex-col rounded-xl border-2 border-primary-dark-gray bg-background-light-gray px-4 py-2 dark:bg-highlight-dark dark:text-background-light-gray md:px-6 md:py-3"
                }
                key={`currentCourses${currentCourse.slug}`}
              >
                <div
                  onClick$={() => {
                    courseObj[currentCourse.id].opened = !courseObj[currentCourse.id].opened;
                  }}
                  class="flex cursor-pointer items-center justify-between"
                >
                  <div class="flex flex-col gap-1">
                    <h2 class="text-base md:text-lg md:tracking-wide">{currentCourse.name}</h2>
                    <div class="mb-1 block h-1.5  w-[100px] rounded-full bg-light-lilac md:hidden">
                      <div
                        class={`h-1.5 rounded-full bg-lilac`}
                        style={{
                          width: `${Math.round(
                            (completedChapters.length / currentChapters.length) * 100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <p class="flex items-center gap-1">
                      <span class="-mt-1 flex items-center text-[12px] text-primary-dark-gray dark:text-background-light-gray md:text-[15px]">
                        <IoReaderOutline />
                      </span>
                      <span class="text-[0.75rem] md:text-[1rem] md:tracking-wide">
                        {completedChapters.length} / {currentChapters.length} chapter
                        {currentChapters.length > 1 ? "s" : ""} completed
                      </span>
                    </p>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="hidden h-1.5 w-[100px] rounded-full  bg-light-lilac md:block">
                      <div
                        class={`h-1.5 rounded-full bg-lilac`}
                        style={{
                          width: `${Math.round(
                            (completedChapters.length / chapters.length) * 100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <button class="p-2">
                      <span
                        style={{
                          transform: courseObj[currentCourse.id].opened ? "rotateZ(180deg)" : "",
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
                {courseObj[currentCourse.id].opened ? (
                  <ul class="flex flex-col gap-4 py-4">
                    {currentChapters.map((chapter) => (
                      <li
                        key={`Course${currentCourse.slug}Chapter${chapter.id}`}
                        class="flex items-center justify-between"
                      >
                        <h2 class="border-b-2 border-primary-dark-gray text-[0.875rem] dark:border-background-light-gray md:text-[1rem]">
                          <Link href={chapter.link || undefined}>{chapter.name}</Link>
                        </h2>
                        {completedChapters.indexOf(chapter.id) !== -1 ? (
                          <p class="border-b-2 border-mint text-[0.875rem]  md:border-b-4 md:text-[1rem]">
                            Completed
                          </p>
                        ) : (
                          <p class="border-b-2 border-pink text-[0.875rem]  md:border-b-4 md:text-[1rem]">
                            Not Completed
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
          <button
            onClick$={() => (showAll.value = !showAll.value)}
            class="md:text-[1rem self-start p-0 text-[0.875rem] font-bold tracking-wide md:p-2"
          >
            {showAll.value ? <p>View Less</p> : <p>View All</p>}
          </button>
        </ul>
      </div>
    </article>
  );
});
