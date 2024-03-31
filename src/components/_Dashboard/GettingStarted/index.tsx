import { component$, useComputed$, useSignal } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { IoReaderOutline } from '@qwikest/icons/ionicons';
import { useDBLoader } from '~/routes/(lang)/(wrapper)/(authRoutes)/members/dashboard/layout';

export default component$(() => {
  const { data, chapters } = useDBLoader().value;
  // const fuseCourse = useSignal<any>();
  // const searchCourse = useSignal("");
  const showAll = useSignal(false);
  const filteredCourses = useComputed$(() => data.filter((entry) => entry.content_index.is_guide));
  const sortedCourses = useComputed$(() =>
    filteredCourses.value.toSorted(
      (a, b) =>
        new Date(b.content_user_progress.started_date).getTime() -
        new Date(a.content_user_progress.started_date).getTime()
    )
  );
  const displayCourses = useComputed$(() => (showAll.value ? sortedCourses.value : sortedCourses.value.slice(0, 3)));
  return (
    <article class="mx-auto max-w-7xl px-4 py-4 sm:px-6  lg:px-8">
      <div class="w-[100%] lg:w-[85%] xl:w-[70%]">
        <h1 class="pb-1 font-mosk text-2xl font-bold tracking-wide lg:text-3xl">Getting Started</h1>
        <ul class="flex flex-col gap-2 py-2">
          {displayCourses.value.map((data) => {
            const currentGuide = data.content_index;
            const currentChapters = data.content_index.chapter_order.filter(
              (id) => !!chapters.find((chapter) => chapter.id === id)
            );
            const isCompleted = !!data.content_user_progress.finished_date;
            return (
              <li
                class=" rounded-xl border-2 border-primary-dark-gray bg-background-light-gray px-4 py-2 dark:bg-highlight-dark dark:text-background-light-gray md:px-6 md:py-3"
                key={`currentGuides${currentGuide.slug}`}
              >
                <Link class="flex items-center justify-between " href={currentGuide.link || undefined} prefetch>
                  <div class="flex flex-col gap-1">
                    <h2 class="text-base md:text-lg md:tracking-wide">{currentGuide.name}</h2>
                    <p class="flex items-center gap-1">
                      <span class="-mt-[2px] flex items-center text-[12px] text-primary-dark-gray dark:text-background-light-gray md:text-[15px]">
                        <IoReaderOutline />
                      </span>
                      <span class="text-[0.75rem] md:text-[1rem]">
                        {/* {currentGuide.readingTime} min
                        {currentGuide.readingTime > 1 ? 's' : ''} read */}
                        {currentChapters.length} chapter {currentChapters.length > 1 ? 's' : ''}
                      </span>
                    </p>
                  </div>
                  {isCompleted ? (
                    <p class="whitespace-nowrap border-b-2 border-mint text-[0.875rem] md:border-b-4 md:text-[1rem]">
                      Completed
                    </p>
                  ) : (
                    <p class="whitespace-nowrap border-b-2 border-custom-pink text-[0.875rem] md:border-b-4 md:text-[1rem]">
                      Not Completed
                    </p>
                  )}
                </Link>
              </li>
            );
          })}
          {sortedCourses.value.length > 3 && (
            <button
              onClick$={() => (showAll.value = !showAll.value)}
              class="self-start p-0 text-[0.875rem] font-bold tracking-wide md:p-2"
            >
              {showAll.value ? <p>View Less</p> : <p>View All</p>}
            </button>
          )}
        </ul>
      </div>
    </article>
  );
});
