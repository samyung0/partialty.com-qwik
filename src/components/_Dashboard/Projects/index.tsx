import { component$, useSignal, useStore } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { IoCaretDown, IoReaderOutline } from "@qwikest/icons/ionicons";
import { LuArrowRight } from "@qwikest/icons/lucide";
// import SearchSVG from "~/assets/svg/search-outline.svg";

// import Fuse from "fuse.js";

type ProjectInfo = {
  name: string;
  stepsOrder: string[];
  steps: Record<string, { name: string; link: string }>;
  link: string;
  topics: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
};

type CurrentProject = {
  slug: string;
  completed: Record<string, boolean>;
  lastAccessed: number;
  open: boolean;
  finished: boolean;
  highlight: Record<string, boolean>;
  codeSpace: string;
};

const difficulty: Record<string, { name: string; link: string }> = {
  beginner: {
    name: "Beginner",
    link: "/members/dashboard/",
  },
  intermediate: {
    name: "Intermediate",
    link: "/members/dashboard/",
  },
  advanced: {
    name: "Advanced",
    link: "/members/dashboard/",
  },
};

type Topics = Record<string, { name: string; link: string }>;

const topics: Topics = {
  html: {
    name: "HTML",
    link: "/members/dashboard/",
  },
  css: {
    name: "Css",
    link: "/members/dashboard/",
  },
  js: {
    name: "JS",
    link: "/members/dashboard/",
  },
  react: {
    name: "React",
    link: "/members/dashboard/",
  },
  nextjs: {
    name: "Next JS",
    link: "/members/dashboard/",
  },
  "headless-cms": {
    name: "Headless CMS",
    link: "/members/dashboard/",
  },
  firebase: {
    name: "Firebase",
    link: "/members/dashboard/",
  },
  supabase: {
    name: "Supabase",
    link: "/members/dashboard/",
  },
  mongodb: {
    name: "Mongo DB",
    link: "/members/dashboard/",
  },
  docker: {
    name: "Docker",
    link: "/members/dashboard/",
  },
  astro: {
    name: "Astro",
    link: "/members/dashboard/",
  },
  webhook: {
    name: "Webook",
    link: "/members/dashboard/",
  },
  hygraph: {
    name: "Hygraph",
    link: "/members/dashboard/",
  },
  tailwind: {
    name: "Tailwind",
    link: "/members/dashboard/",
  },
};

const coursesInfo: Record<string, ProjectInfo> = {
  "simple-landing-page": {
    name: "Simple Landing page",
    topics: ["html", "css"],
    stepsOrder: ["step1", "step2", "step3", "step4", "step5", "step6"],
    steps: {
      step1: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      step2: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      step3: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      step4: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      step5: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      step6: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
    },
    link: "/members/dashboard/",
    difficulty: "beginner",
  },
  "simple-carousel-page": {
    name: "Simple Carousel page",
    topics: ["html", "css", "js"],
    stepsOrder: ["step1", "step2", "step3", "step4"],
    steps: {
      step1: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      step2: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      step3: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      step4: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
    },
    difficulty: "beginner",
    link: "/members/dashboard/",
  },
  "simple-quiz-app": {
    name: "Simple Quiz App",
    topics: ["html", "css", "js"],
    stepsOrder: ["step1", "step2", "step3", "step4", "step5"],
    steps: {
      step1: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      step2: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      step3: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      step4: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      step5: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
    },
    difficulty: "beginner",
    link: "/members/dashboard/",
  },
  "todo-app-firebase": {
    name: "Todo App with Firebase",
    topics: ["html", "css", "js", "firebase"],
    stepsOrder: ["step1", "step2", "step3", "step4", "step5"],
    steps: {
      step1: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      step2: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      step3: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      step4: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      step5: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
    },
    difficulty: "beginner",
    link: "/members/dashboard/",
  },
  "realtime-chat-app-nextjs-supabase": {
    name: "Realtime Chat App with Next JS, Tailwind and Supabase",
    topics: ["nextjs", "tailwind", "supabase"],
    stepsOrder: ["step1", "step2", "step3", "step4", "step5"],
    steps: {
      step1: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      step2: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      step3: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      step4: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      step5: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
    },
    difficulty: "intermediate",
    link: "/members/dashboard/",
  },
  "static-blog-page-astro-hygraph": {
    name: "Static Blog Page with Astro, Tailwind and Hygraph",
    topics: ["astro", "webhook", "hygraph", "tailwind"],
    stepsOrder: ["step1", "step2", "step3", "step4", "step5"],
    steps: {
      step1: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      step2: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      step3: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      step4: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      step5: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
    },
    difficulty: "intermediate",
    link: "/members/dashboard/",
  },
};

export default component$(() => {
  const currentProjects = useStore(() => {
    const p: CurrentProject[] = [
      {
        slug: "simple-landing-page",
        completed: {
          step1: true,
          step2: true,
          step3: false,
          step4: false,
          step5: false,
          step6: false,
        },
        codeSpace: "/members/dashboard/",
        finished: false,
        lastAccessed: 1705468275501,
        open: false,
        highlight: {},
      },
      {
        slug: "simple-carousel-page",
        completed: {
          step1: true,
          step2: true,
          step3: false,
          step4: false,
          step5: false,
        },
        codeSpace: "/members/dashboard/",
        finished: false,
        open: false,
        highlight: {},
        lastAccessed: 1705468275500,
      },
      {
        slug: "simple-quiz-app",
        completed: {
          step1: true,
          step2: true,
          step3: true,
          step4: true,
          step5: true,
        },
        codeSpace: "/members/dashboard/",
        finished: true,
        open: false,
        highlight: {},
        lastAccessed: 1705468275503,
      },
      {
        slug: "todo-app-firebase",
        completed: {
          step1: true,
          step2: true,
          step3: true,
          step4: true,
          step5: true,
        },
        codeSpace: "/members/dashboard/",
        finished: true,
        open: false,
        highlight: {},
        lastAccessed: 1705468275501,
      },
      {
        slug: "realtime-chat-app-nextjs-supabase",
        completed: {
          step1: false,
          step2: false,
          step3: false,
          step4: false,
          step5: false,
        },
        codeSpace: "/members/dashboard/",
        finished: false,
        open: false,
        highlight: {},
        lastAccessed: 1705468275505,
      },
      {
        slug: "static-blog-page-astro-hygraph",
        completed: {
          step1: false,
          step2: false,
          step3: false,
          step4: false,
          step5: false,
        },
        codeSpace: "/members/dashboard/",
        finished: false,
        open: false,
        highlight: {},
        lastAccessed: 1705468275505,
      },
    ];
    const finished = p.filter((t) => t.finished);
    const unfinished = p.filter((t) => !t.finished);
    return [
      ...unfinished.sort((a, b) => b.lastAccessed - a.lastAccessed),
      ...finished.sort((a, b) => b.lastAccessed - a.lastAccessed),
    ];
  });
  // const coursesObj = useSignal(() =>
  //   Object.keys(coursesInfo).map((key) => ({ slug: key, ...coursesInfo[key] }))
  // );
  // const fuseCourse = useSignal<any>();
  // const searchCourse = useSignal("");
  const showAll = useSignal(false);
  const displayCourses = showAll.value ? currentProjects : currentProjects.slice(0, 3);

  // useVisibleTask$(() => {
  //   fuseCourse.value = noSerialize(
  //     new Fuse(coursesObj.value, {
  //       threshold: 0.4,
  //       keys: [
  //         "slug",
  //         "name",
  //         "stepsOrder",
  //         ...coursesObj.value
  //           .map((course) => {
  //             const arr = course.stepsOrder.map((chapter) => ["steps", chapter, "name"]);
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
    <article class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <div class="w-[100%] pb-1 lg:w-[85%] xl:w-[70%]">
        <div class="flex items-end justify-between">
          <h1 class="pb-1 font-mosk text-2xl font-bold tracking-wide lg:text-4xl">My Projects</h1>
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
          {displayCourses.map((currentProject) => {
            const steps = Object.values(coursesInfo[currentProject.slug].steps);
            const currentChapters = Object.entries(currentProject.completed);
            const completedChapters = currentChapters.filter((entry) => entry[1]);
            return (
              <li
                class={
                  "flex flex-col rounded-xl border-2 border-primary-dark-gray bg-background-light-gray px-6 py-3 dark:bg-highlight-dark dark:text-background-light-gray"
                }
                key={`currentProjects${currentProject.slug}`}
              >
                <div
                  onClick$={() => {
                    currentProject.open = !currentProject.open;
                  }}
                  class="flex cursor-pointer items-center justify-between"
                >
                  <div class="flex flex-col gap-1">
                    <h2 class="text-base md:text-lg md:tracking-wide">
                      {coursesInfo[currentProject.slug].name}
                    </h2>
                    <div class="mb-1 block h-1.5 w-[100px] rounded-full bg-light-sea md:hidden">
                      <div
                        class={`h-1.5 rounded-full bg-sea`}
                        style={{
                          width: `${Math.round((completedChapters.length / steps.length) * 100)}%`,
                        }}
                      ></div>
                    </div>
                    <p class="flex items-center gap-1">
                      <span class="-mt-1 flex items-center text-[12px] text-primary-dark-gray dark:text-background-light-gray md:text-[15px]">
                        <IoReaderOutline />
                      </span>
                      <span class="text-[0.75rem] md:text-[1rem] md:tracking-wide">
                        {completedChapters.length} / {steps.length} step
                        {steps.length > 0 ? "s" : ""} completed
                      </span>
                    </p>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="hidden h-1.5 w-[100px] rounded-full bg-light-sea md:block">
                      <div
                        class={`h-1.5 rounded-full bg-sea`}
                        style={{
                          width: `${Math.round((completedChapters.length / steps.length) * 100)}%`,
                        }}
                      ></div>
                    </div>
                    <button class="p-2">
                      <span
                        style={{
                          transform: currentProject.open ? "rotateZ(180deg)" : "",
                        }}
                        class={
                          "inline-block text-[16px] text-primary-dark-gray transition-transform dark:text-background-light-gray"
                        }
                      >
                        <IoCaretDown />
                      </span>
                    </button>
                  </div>
                </div>
                <Link href={currentProject.codeSpace} class="mt-4 flex gap-2 self-start md:mt-6">
                  <span class="border-b-2 border-primary-dark-gray text-[0.875rem] dark:border-background-light-gray md:text-[1rem]">
                    Go to Codespace
                  </span>
                  <span class="text-[12px] text-primary-dark-gray dark:text-background-light-gray md:text-[15px]">
                    <LuArrowRight />
                  </span>
                </Link>
                {currentProject.open ? (
                  <>
                    <div class="mt-6 flex gap-4 pb-2">
                      <h3 class="w-[20%] text-[0.875rem] md:text-[1rem]">Topics:</h3>
                      <ul class="flex w-[80%] flex-wrap gap-x-4 gap-y-2">
                        {coursesInfo[currentProject.slug].topics.map((topic) => (
                          <li key={`Course${currentProject.slug}Topic${topic}`}>
                            <Link
                              class="border-b-2 border-primary-dark-gray text-[0.875rem]  dark:border-background-light-gray md:text-[1rem]"
                              href={topics[topic].link}
                            >
                              {topics[topic].name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div class="flex gap-4 pb-2">
                      <h3 class="w-[20%]  text-[0.875rem] md:text-[1rem]">Difficulty:</h3>
                      <p class={`w-[80%]`}>
                        <Link
                          href={difficulty[coursesInfo[currentProject.slug].difficulty].link}
                          class={`border-b-2  text-[0.875rem] md:text-[1rem] ${
                            coursesInfo[currentProject.slug].difficulty === "beginner"
                              ? "border-sea"
                              : coursesInfo[currentProject.slug].difficulty === "intermediate"
                              ? "border-yellow"
                              : "border-pink"
                          }`}
                        >
                          {difficulty[coursesInfo[currentProject.slug].difficulty].name}
                        </Link>
                      </p>
                    </div>
                    <ul class="flex flex-col gap-4 py-4">
                      {coursesInfo[currentProject.slug].stepsOrder.map((chapter) => (
                        <li
                          key={`Course${currentProject.slug}Chapter${chapter}`}
                          class="flex items-center justify-between"
                        >
                          <h2 class="border-b-2 border-primary-dark-gray text-[0.875rem] dark:border-background-light-gray md:text-[1rem]">
                            <Link href={coursesInfo[currentProject.slug].steps[chapter].link}>
                              {coursesInfo[currentProject.slug].steps[chapter].name}
                            </Link>
                          </h2>
                          {currentProject.completed[chapter] ? (
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
                  </>
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
