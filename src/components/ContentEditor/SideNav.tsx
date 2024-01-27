import { component$, useStore } from "@builder.io/qwik";
import ArrowDown from "~/assets/svg/caret-down-outline.svg";

type CourseInfo = {
  slug: string;
  name: string;
  chapterOrder: string[];
  chapters: Record<string, { name: string; link: string }>;
  link: string;
}[];
const courses: CourseInfo = [
  {
    slug: "html",
    name: "HTML Course",
    chapterOrder: ["chapter1", "chapter2", "chapter3", "chapter4", "chapter5"],
    chapters: {
      chapter1: {
        name: "Lorem Ipsum sthsth iodsaio djASOI JdoISAJ D",
        link: "/members/dashboard/",
      },
      chapter2: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      chapter3: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      chapter4: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      chapter5: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
    },
    link: "/members/dashboard/",
  },
  {
    slug: "js",
    name: "JS Course",
    chapterOrder: ["chapter1", "chapter2", "chapter3", "chapter4", "chapter5"],
    chapters: {
      chapter1: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      chapter2: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      chapter3: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      chapter4: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      chapter5: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
    },
    link: "/members/dashboard/",
  },
  {
    slug: "react",
    name: "React Course",
    chapterOrder: ["chapter1", "chapter2", "chapter3", "chapter4", "chapter5"],
    chapters: {
      chapter1: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      chapter2: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      chapter3: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      chapter4: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      chapter5: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
    },
    link: "/members/dashboard/",
  },
  {
    slug: "astro",
    name: "Astro Course",
    chapterOrder: ["chapter1", "chapter2", "chapter3", "chapter4", "chapter5"],
    chapters: {
      chapter1: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      chapter2: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      chapter3: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      chapter4: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
      chapter5: {
        name: "Lorem Ipsum sthsth",
        link: "/members/dashboard/",
      },
    },
    link: "/members/dashboard/",
  },
];

export default component$(() => {
  const navOpen = useStore(() => Array.from(Array(courses.length)).map((_) => false));
  return (
    <nav class="h-full max-h-[100vh] w-[20vw] overflow-auto border-r-2 border-yellow bg-light-yellow/50 p-8">
      <ul class="flex flex-col gap-6 pt-4">
        {courses.map((course, index) => (
          <li key={`ContentEditor${course.slug}`}>
            <button
              onClick$={() => (navOpen[index] = !navOpen[index])}
              class={"flex items-center gap-2 pb-4"}
            >
              <h2 class="text-left text-lg tracking-wide">{course.name}</h2>
              <img
                src={ArrowDown}
                alt="arrowDown"
                width={16}
                height={16}
                class={"transition-transform " + (navOpen[index] && "rotate-180")}
              />
            </button>
            {navOpen[index] && (
              <ul class="flex flex-col gap-4">
                {course.chapterOrder.map((chapter) => (
                  <li key={`ContentEditor${course.slug}${chapter}`}>
                    <button class={"flex w-full items-center justify-between gap-4"}>
                      <h3 class="text-left tracking-wide">{course.chapters[chapter].name}</h3>
                      {/* <img
                        src="https://res.cloudinary.com/dhthx6tn6/image/upload/v1705217727/defaultProfilePic/default1_qzccfr.jpg"
                        alt=""
                        width="30"
                        height="30"
                        class="rounded-full object-contain"
                      /> */}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
});
