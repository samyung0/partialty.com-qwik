import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { IoTimeOutline } from "@qwikest/icons/ionicons";

const currentGuides = [
  {
    slug: "Introduction to Web",
    completed: true,
  },
  {
    slug: "Introduction to meta-frameworks",
    completed: false,
  },
] as const;

const guidesInfo = {
  "Introduction to Web": {
    name: "Introduction to Web",
    readingTime: 20,
    link: "/members/dashboard/",
  },
  "Introduction to meta-frameworks": {
    name: "Introduction to meta-frameworks",
    readingTime: 10,
    link: "/members/dashboard/",
  },
};

export default component$(() => {
  return (
    <article class="mx-auto w-[95%] py-4 md:w-[80%]">
      <div class="w-[100%] lg:w-[85%] xl:w-[70%]">
        <h1 class="pb-1 font-mosk text-2xl font-bold tracking-wide lg:text-4xl">Getting Started</h1>
        <ul class="flex flex-col gap-2 py-2">
          {currentGuides.map((currentGuide) => (
            <li
              class=" rounded-xl border-2 border-primary-dark-gray bg-background-light-gray px-4 py-2 dark:bg-highlight-dark dark:text-background-light-gray md:px-6 md:py-3"
              key={`currentGuides${currentGuide.slug}`}
            >
              <Link
                class="flex items-center justify-between "
                href={guidesInfo[currentGuide.slug].link}
                prefetch
              >
                <div class="flex flex-col gap-1">
                  <h2 class="text-base md:text-lg md:tracking-wide">
                    {guidesInfo[currentGuide.slug].name}
                  </h2>
                  <p class="flex items-center gap-1">
                    <span class="-mt-[2px] flex items-center text-[12px] text-primary-dark-gray dark:text-background-light-gray md:text-[15px]">
                      <IoTimeOutline />
                    </span>
                    <span class="text-[0.75rem] md:text-[1rem]">
                      {guidesInfo[currentGuide.slug].readingTime} min
                      {guidesInfo[currentGuide.slug].readingTime > 1 ? "s" : ""} read
                    </span>
                  </p>
                </div>
                {currentGuide.completed ? (
                  <p class="whitespace-nowrap border-b-2 border-mint text-[0.875rem] md:border-b-4 md:text-[1rem]">
                    Completed
                  </p>
                ) : (
                  <p class="whitespace-nowrap border-b-2 border-pink text-[0.875rem] md:border-b-4 md:text-[1rem]">
                    Not Completed
                  </p>
                )}
              </Link>
            </li>
          ))}
          <Link
            href="/members/dashboard/"
            class="p-0 text-right text-[0.875rem] font-bold tracking-wide md:p-2 md:text-[1rem]"
          >
            <p>View all guides</p>
          </Link>
        </ul>
      </div>
    </article>
  );
});
