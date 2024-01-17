import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

import TimeSVG from "~/assets/svg/time-outline.svg";

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
    <article class="mx-auto w-[80%] py-4">
      <div class="w-[70%]">
        <h1 class="pb-1 font-mosk text-4xl font-bold tracking-wide">Getting Started</h1>
        <ul class="flex flex-col gap-2 py-2">
          {currentGuides.map((currentGuide) => (
            <li
              class=" rounded-xl border-2 border-primary-dark-gray bg-background-light-gray px-6 py-3"
              key={`currentGuides${currentGuide.slug}`}
            >
              <Link
                class="flex items-center justify-between "
                href={guidesInfo[currentGuide.slug].link}
                prefetch
              >
                <div class="flex flex-col gap-1">
                  <h2 class="text-lg tracking-wide">{guidesInfo[currentGuide.slug].name}</h2>
                  <p class="flex items-center gap-1">
                    <span class="-mt-[2px] block">
                      <img src={TimeSVG} alt="Time" width={15} height={15} />
                    </span>
                    <span>
                      {guidesInfo[currentGuide.slug].readingTime} min
                      {guidesInfo[currentGuide.slug].readingTime > 1 ? "s" : ""} read
                    </span>
                  </p>
                </div>
                {currentGuide.completed ? (
                  <p class="border-b-4 border-mint">Completed</p>
                ) : (
                  <p class="border-b-4 border-pink">Not Completed</p>
                )}
              </Link>
            </li>
          ))}
          <Link href="/members/dashboard/" class="p-2 text-right font-bold tracking-wide">
            <p>View all guides</p>
          </Link>
        </ul>
      </div>
    </article>
  );
});
