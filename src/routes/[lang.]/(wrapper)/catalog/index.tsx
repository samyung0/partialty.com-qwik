import { component$, useComputed$, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link, useLocation, useNavigate } from "@builder.io/qwik-city";
import { LuGem, LuRocket, LuTags } from "@qwikest/icons/lucide";
import Footer from "~/components/Footer";
import Nav from "~/components/Nav";
import { useCategories, useCourseLoader, useTags } from "~/routes/[lang.]/(wrapper)/catalog/layout";
import Masonry from "~/routes/[lang.]/(wrapper)/catalog/masonry";
import { cn } from "~/utils/cn";

// const Masonry = _Masonry as any;

// import Macy from "macy"

export default component$(() => {
  const showMobileFilter = useSignal(false);
  const showSort = useSignal(false);
  const tagOpened = useSignal(true);
  const categoryOpened = useSignal(true);

  // const container = useSignal<HTMLElement>();
  // const macy = useSignal<any>();
  // const scriptLoaded = useSignal(false);

  const nav = useNavigate();
  const loc = useLocation();

  // useVisibleTask$(() => {
  //   const script = document.createElement("script");
  //   script.src = "https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js";
  //   script.async = true;
  //   document.head.appendChild(script);
  //   script.onload = () => {
  //     scriptLoaded.value = true;
  //   };
  // });

  // useVisibleTask$(({ track }) => {
  //   track(container);
  //   track(scriptLoaded);
  //   if (!container.value || !scriptLoaded.value) return;
  //   macy.value = noSerialize(
  //     new (window as any).Masonry(container.value, {
  //       // container: container.value,
  //       // columns: 3,
  //       itemSelector: ".item",
  //       columnWidth: ".item",
  //       percentPosition: true,
  //       gutter: 12,
  //       stagger: 30,
  //     })
  //   );
  // });

  const courses = useCourseLoader().value;
  const tags = useTags().value;
  const categories = useCategories().value;

  const urlStateManager = useComputed$<{
    type: null | string;
    category: (typeof categories)[number]["slug"][];
    tag: (typeof tags)[number]["slug"][];
    sort: string;
  }>(() => ({
    type: loc.url.searchParams.get("type"),
    category: loc.url.searchParams.getAll("category"),
    tag: loc.url.searchParams.getAll("tag"),
    sort: loc.url.searchParams.get("sort") || "difficulty-increasing",
  }));

  const coursesDisplay = useComputed$(() =>
    urlStateManager.value.type === "project" || urlStateManager.value.type === "guide"
      ? []
      : urlStateManager.value.type === "course"
      ? courses.map((x) => x.content_index).filter((course) => !course.is_guide)
      : courses.map((x) => x.content_index)
  );

  const guidesDisplay = useComputed$(() =>
    urlStateManager.value.type === "project" || urlStateManager.value.type === "course"
      ? []
      : urlStateManager.value.type === "guide"
      ? courses.map((x) => x.content_index).filter((course) => course.is_guide)
      : []
  );

  const display = useComputed$<
    {
      id: string;
      link: string | null;
      name: string;
      short_description: string;
      difficulty: string;
      tags: string[] | null;
      is_premium: boolean;
      created_at: string;
    }[]
  >(() =>
    [...coursesDisplay.value, ...guidesDisplay.value]
      .filter((course) =>
        urlStateManager.value.category.length > 0
          ? urlStateManager.value.category.includes(
              categories.find((category) => category.id === course.category)?.slug || ""
            )
          : true
      )
      .filter((course) =>
        urlStateManager.value.tag.length > 0
          ? course.tags &&
            course.tags
              .map((tagId) => tags.find((tag) => tag.id === tagId))
              .filter((x) => x && urlStateManager.value.tag.includes(x!.slug)).length > 0
          : true
      )
  );

  const difficultyMap = useSignal<Record<string, number>>({
    easy: 1,
    intermediate: 2,
    advanced: 3,
  });

  const sortedDisplay = useComputed$(() => {
    switch (urlStateManager.value.sort) {
      case "difficulty-increasing":
        return display.value.toSorted(
          (a, b) => difficultyMap.value[a.difficulty] || 0 - difficultyMap.value[b.difficulty] || 0
        );
      case "difficulty-decreasing":
        return display.value.toSorted(
          (a, b) => difficultyMap.value[b.difficulty] || 0 - difficultyMap.value[a.difficulty] || 0
        );
      case "newest":
        return display.value.toSorted(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

      case "oldest":
        return display.value.toSorted(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      default:
        return display.value;
    }
  });

  return (
    <section class="flex min-h-[100vh] flex-col bg-light-yellow dark:bg-primary-dark-gray dark:text-background-light-gray">
      <div class="min-h-[100vh]">
        <Nav />
        <div class="flex flex-auto ">
          <div class="flex-auto">
            <div
              class={cn("relative z-40 hidden lg:hidden", showMobileFilter.value && "block")}
              role="dialog"
              aria-modal="true"
            >
              <div class="fixed inset-0 bg-black bg-opacity-25"></div>

              <div
                class="fixed inset-0 z-40 flex"
                onClick$={() => (showMobileFilter.value = !showMobileFilter.value)}
              >
                <div
                  class="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto  bg-pale-yellow py-4 pb-12 shadow-xl dark:bg-primary-dark-gray"
                  onClick$={(e) => e.stopPropagation()}
                >
                  <div class="flex items-center justify-between px-4">
                    <h2 class="text-lg font-medium ">Filters</h2>
                    <button
                      type="button"
                      class="-mr-2 flex h-10 w-10 items-center justify-center rounded-md  p-2 text-gray-400 dark:bg-primary-dark-gray"
                      onClick$={() => (showMobileFilter.value = !showMobileFilter.value)}
                    >
                      <span class="sr-only">Close menu</span>
                      <svg
                        class="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <form class="mt-4 border-t border-gray-200" preventdefault:submit>
                    <h3 class="sr-only">Type</h3>
                    <ul role="list" class="px-2 py-3 font-medium ">
                      <li class="block px-2 py-3">
                        <button
                          type="button"
                          onClick$={() => {
                            const url = new URL(loc.url);
                            url.searchParams.delete("type");
                            nav(url.toString());
                            showMobileFilter.value = false;
                          }}
                        >
                          All
                        </button>
                      </li>
                      <li class="block px-2 py-3">
                        <button
                          type="button"
                          onClick$={() => {
                            const url = new URL(loc.url);
                            url.searchParams.set("type", "course");
                            nav(url.toString());
                            showMobileFilter.value = false;
                          }}
                        >
                          Course
                        </button>
                      </li>
                      <li class="block px-2 py-3">
                        <button
                          type="button"
                          onClick$={() => {
                            const url = new URL(loc.url);
                            url.searchParams.set("type", "project");
                            nav(url.toString());
                            showMobileFilter.value = false;
                          }}
                        >
                          Project
                        </button>
                      </li>
                      <li class="block px-2 py-3">
                        <button
                          type="button"
                          onClick$={() => {
                            const url = new URL(loc.url);
                            url.searchParams.set("type", "guide");
                            nav(url.toString());
                            showMobileFilter.value = false;
                          }}
                        >
                          Guide/Blog
                        </button>
                      </li>
                    </ul>

                    <div class="border-t border-gray-200 px-4 py-6">
                      <h3 class="-mx-2 -my-3 flow-root">
                        <button
                          type="button"
                          class="flex w-full items-center justify-between  px-2 py-3 text-gray-400 hover:text-gray-500 dark:bg-primary-dark-gray"
                          aria-controls="filter-section-mobile-0"
                          aria-expanded="false"
                          onClick$={() => (categoryOpened.value = !categoryOpened.value)}
                        >
                          <span class="font-medium ">Category</span>
                          <span class="ml-6 flex items-center">
                            {!categoryOpened.value && (
                              <svg
                                class="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                              </svg>
                            )}
                            {categoryOpened.value && (
                              <svg
                                class="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                            )}
                          </span>
                        </button>
                      </h3>
                      <div
                        class={cn("hidden pt-6", categoryOpened.value && "block")}
                        id="filter-section-mobile-0"
                      >
                        <div class="space-y-6">
                          {categories.map((category) => (
                            <div key={category.id} class="flex items-center">
                              <input
                                id={`filter-category-${category.id}`}
                                type="checkbox"
                                class="h-4 w-4 rounded border-gray-300"
                                checked={urlStateManager.value.category.includes(category.slug)}
                                onChange$={(e, ct) => {
                                  const url = new URL(loc.url);
                                  if (ct.checked) {
                                    url.searchParams.append("category", category.slug);
                                  } else {
                                    url.searchParams.delete("category", category.slug);
                                  }
                                  nav(url.toString());
                                }}
                              />
                              <label
                                for={`filter-category-${category.id}`}
                                class="ml-3 text-sm text-gray-600 dark:text-gray-300"
                              >
                                {category.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div class="border-t border-gray-200 px-4 py-6">
                      <h3 class="-mx-2 -my-3 flow-root">
                        <button
                          type="button"
                          class="flex w-full items-center justify-between  px-2 py-3 text-gray-400 hover:text-gray-500 dark:bg-primary-dark-gray"
                          aria-controls="filter-section-mobile-1"
                          aria-expanded="false"
                          onClick$={() => (tagOpened.value = !tagOpened.value)}
                        >
                          <span class="font-medium ">Tag</span>
                          <span class="ml-6 flex items-center">
                            {!tagOpened.value && (
                              <svg
                                class="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                              </svg>
                            )}
                            {tagOpened.value && (
                              <svg
                                class="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                            )}
                          </span>
                        </button>
                      </h3>
                      <div
                        class={cn("hidden pt-6", tagOpened.value && "block")}
                        id="filter-section-mobile-1"
                      >
                        <div class="space-y-6">
                          {tags.map((tag) => (
                            <div key={tag.id} class="flex items-center">
                              <input
                                id={`filter-tag-${tag.id}`}
                                type="checkbox"
                                class="h-4 w-4 rounded border-gray-300"
                                checked={urlStateManager.value.tag.includes(tag.slug)}
                                onChange$={(e, ct) => {
                                  const url = new URL(loc.url);
                                  if (ct.checked) {
                                    url.searchParams.append("tag", tag.slug);
                                  } else {
                                    url.searchParams.delete("tag", tag.slug);
                                  }
                                  nav(url.toString());
                                }}
                              />
                              <label
                                for={`filter-tag-${tag.id}`}
                                class="ml-3 text-sm text-gray-600 dark:text-gray-300"
                              >
                                {tag.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div class="flex items-baseline justify-between border-b border-gray-300 pb-6 pt-12">
                <h1 class="font-mosk text-4xl font-bold tracking-wide">Catalog</h1>

                <div class="flex items-center">
                  <div class="relative inline-block text-left">
                    <div>
                      <button
                        type="button"
                        class="group inline-flex items-center justify-center text-base font-medium"
                        id="menu-button"
                        aria-expanded="false"
                        aria-haspopup="true"
                        onClick$={() => (showSort.value = !showSort.value)}
                      >
                        Sort
                        <svg
                          class="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500 dark:text-gray-300 dark:group-hover:text-gray-200"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                    <div
                      class={cn(
                        "absolute right-0 z-10 mt-2 hidden w-[220px] origin-top-right rounded-lg border-2 border-primary-dark-gray bg-background-light-gray p-3 focus:outline-none dark:border-disabled-dark dark:bg-highlight-dark",
                        showSort.value && "block"
                      )}
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="menu-button"
                      tabIndex={-1}
                    >
                      <div class="py-1" role="none">
                        <button
                          class={cn(
                            "block px-4 py-2 text-base",
                            urlStateManager.value.sort === "difficulty-increasing" && "font-bold"
                          )}
                          role="menuitem"
                          tabIndex={-1}
                          id="menu-item-0"
                          onClick$={() => {
                            const url = new URL(loc.url);
                            url.searchParams.set("sort", "difficulty-increasing");
                            nav(url.toString());
                          }}
                        >
                          Difficulty Increasing
                        </button>
                        <button
                          onClick$={() => {
                            const url = new URL(loc.url);
                            url.searchParams.set("sort", "difficulty-decreasing");
                            nav(url.toString());
                          }}
                          class={cn(
                            "block px-4 py-2 text-base",
                            urlStateManager.value.sort === "difficulty-decreasing" && "font-bold"
                          )}
                          role="menuitem"
                          tabIndex={-1}
                          id="menu-item-1"
                        >
                          Difficulty Decreasing
                        </button>
                        <button
                          onClick$={() => {
                            const url = new URL(loc.url);
                            url.searchParams.set("sort", "newest");
                            nav(url.toString());
                          }}
                          class={cn(
                            "block px-4 py-2 text-base",
                            urlStateManager.value.sort === "newest" && "font-bold"
                          )}
                          role="menuitem"
                          tabIndex={-1}
                          id="menu-item-2"
                        >
                          Newest
                        </button>
                        <button
                          onClick$={() => {
                            const url = new URL(loc.url);
                            url.searchParams.set("sort", "oldest");
                            nav(url.toString());
                          }}
                          class={cn(
                            "block px-4 py-2 text-base",
                            urlStateManager.value.sort === "oldest" && "font-bold"
                          )}
                          role="menuitem"
                          tabIndex={-1}
                          id="menu-item-3"
                        >
                          Oldest
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* <button
                    type="button"
                    class="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 sm:ml-7"
                  >
                    <span class="sr-only">View grid</span>
                    <svg class="h-5 w-5" aria-hidden="true" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fill-rule="evenodd"
                        d="M4.25 2A2.25 2.25 0 002 4.25v2.5A2.25 2.25 0 004.25 9h2.5A2.25 2.25 0 009 6.75v-2.5A2.25 2.25 0 006.75 2h-2.5zm0 9A2.25 2.25 0 002 13.25v2.5A2.25 2.25 0 004.25 18h2.5A2.25 2.25 0 009 15.75v-2.5A2.25 2.25 0 006.75 11h-2.5zm9-9A2.25 2.25 0 0011 4.25v2.5A2.25 2.25 0 0013.25 9h2.5A2.25 2.25 0 0018 6.75v-2.5A2.25 2.25 0 0015.75 2h-2.5zm0 9A2.25 2.25 0 0011 13.25v2.5A2.25 2.25 0 0013.25 18h2.5A2.25 2.25 0 0018 15.75v-2.5A2.25 2.25 0 0015.75 11h-2.5z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button> */}
                  <button
                    type="button"
                    class="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 sm:ml-6 lg:hidden"
                    onClick$={() => (showMobileFilter.value = !showMobileFilter.value)}
                  >
                    <span class="sr-only">Filters</span>
                    <svg class="h-5 w-5" aria-hidden="true" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fill-rule="evenodd"
                        d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <section aria-labelledby="courses-heading" class="pb-24 pt-6">
                <h2 id="courses-heading" class="sr-only">
                  Courses
                </h2>

                <div class="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                  <form class="hidden lg:block" preventdefault:submit>
                    <h3 class="sr-only">Type</h3>
                    <ul
                      role="list"
                      class="space-y-4 border-b border-gray-300 pb-6 text-sm font-medium "
                    >
                      <li>
                        <button
                          type="button"
                          onClick$={() => {
                            const url = new URL(loc.url);
                            url.searchParams.delete("type");
                            nav(url.toString());
                          }}
                        >
                          All
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick$={() => {
                            const url = new URL(loc.url);
                            url.searchParams.set("type", "course");
                            nav(url.toString());
                          }}
                        >
                          Course
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick$={() => {
                            const url = new URL(loc.url);
                            url.searchParams.set("type", "project");
                            nav(url.toString());
                          }}
                        >
                          Project
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick$={() => {
                            const url = new URL(loc.url);
                            url.searchParams.set("type", "guide");
                            nav(url.toString());
                          }}
                        >
                          Guide/Blog
                        </button>
                      </li>
                    </ul>

                    <div class="border-b border-gray-300 py-6">
                      <h3 class="-my-3 flow-root">
                        <button
                          type="button"
                          class="flex w-full items-center justify-between  py-3 text-sm text-gray-500 hover:text-gray-700 dark:bg-primary-dark-gray dark:text-gray-300 dark:hover:text-gray-200"
                          aria-controls="filter-section-0"
                          aria-expanded="false"
                          onClick$={() => (categoryOpened.value = !categoryOpened.value)}
                        >
                          <span class="font-medium ">Category</span>
                          <span class="ml-6 flex items-center">
                            {!categoryOpened.value && (
                              <svg
                                class="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                              </svg>
                            )}
                            {categoryOpened.value && (
                              <svg
                                class="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                            )}
                          </span>
                        </button>
                      </h3>
                      <div
                        class={cn("hidden pt-6", categoryOpened.value && "block")}
                        id="filter-section-0"
                      >
                        <div class="space-y-4">
                          {categories.map((category) => (
                            <div key={category.id} class="flex items-center">
                              <input
                                id={`filter-category-${category.id}`}
                                type="checkbox"
                                class="h-4 w-4 rounded border-gray-300"
                                checked={urlStateManager.value.category.includes(category.slug)}
                                onChange$={(e, ct) => {
                                  const url = new URL(loc.url);
                                  if (ct.checked) {
                                    url.searchParams.append("category", category.slug);
                                  } else {
                                    url.searchParams.delete("category", category.slug);
                                  }
                                  nav(url.toString());
                                }}
                              />
                              <label
                                for={`filter-category-${category.id}`}
                                class="ml-3 text-sm text-gray-600 dark:text-gray-300"
                              >
                                {category.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div class="border-b border-gray-300 py-6">
                      <h3 class="-my-3 flow-root">
                        <button
                          type="button"
                          class="flex w-full items-center justify-between  py-3 text-sm text-gray-500 hover:text-gray-700 dark:bg-primary-dark-gray dark:text-gray-300 dark:hover:text-gray-200"
                          aria-controls="filter-section-0"
                          aria-expanded="false"
                          onClick$={() => (tagOpened.value = !tagOpened.value)}
                        >
                          <span class="font-medium ">Tags</span>
                          <span class="ml-6 flex items-center">
                            {!tagOpened.value && (
                              <svg
                                class="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                              </svg>
                            )}
                            {tagOpened.value && (
                              <svg
                                class="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                            )}
                          </span>
                        </button>
                      </h3>
                      <div
                        class={cn("hidden pt-6", tagOpened.value && "block")}
                        id="filter-section-0"
                      >
                        <div class="space-y-4">
                          {tags.map((tag) => (
                            <div key={tag.id} class="flex items-center">
                              <input
                                id={`filter-tag-${tag.id}`}
                                type="checkbox"
                                class="h-4 w-4 rounded border-gray-300"
                                checked={urlStateManager.value.tag.includes(tag.slug)}
                                onChange$={(e, ct) => {
                                  const url = new URL(loc.url);
                                  if (ct.checked) {
                                    url.searchParams.append("tag", tag.slug);
                                  } else {
                                    url.searchParams.delete("tag", tag.slug);
                                  }
                                  nav(url.toString());
                                }}
                              />
                              <label
                                for={`filter-tag-${tag.id}`}
                                class="ml-3 text-sm text-gray-600 dark:text-gray-300"
                              >
                                {tag.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </form>

                  <div class="lg:col-span-3">
                    <div class="">
                      <div class="mx-auto pr-4 sm:flex sm:items-center sm:pr-6 lg:pr-8">
                        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-300">
                          Filters
                          <span class="sr-only">, active</span>
                        </h3>

                        <div
                          aria-hidden="true"
                          class="hidden h-5 w-px bg-gray-300 sm:ml-4 sm:block"
                        ></div>

                        <div class="mt-2 sm:ml-4 sm:mt-0">
                          <div class="-m-1 flex flex-wrap items-center">
                            {urlStateManager.value.type && (
                              <span class="m-1 inline-flex items-center rounded-full border border-gray-200 bg-white py-1.5 pl-3 pr-2 text-sm font-medium text-gray-900 dark:border-disabled-dark dark:bg-highlight-dark dark:text-background-light-gray">
                                <span>{urlStateManager.value.type}</span>
                                <button
                                  onClick$={() => {
                                    const url = new URL(loc.url);
                                    url.searchParams.delete("type");
                                    nav(url.toString());
                                  }}
                                  type="button"
                                  class="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500"
                                >
                                  <span class="sr-only">
                                    Remove filter for {urlStateManager.value.type}
                                  </span>
                                  <svg
                                    class="h-2 w-2"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 8 8"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-width="1.5"
                                      d="M1 1l6 6m0-6L1 7"
                                    />
                                  </svg>
                                </button>
                              </span>
                            )}

                            {urlStateManager.value.category.map((category) => (
                              <span
                                key={`filterCategory${category}`}
                                class="m-1 inline-flex items-center rounded-full border border-gray-200 bg-white py-1.5 pl-3 pr-2 text-sm font-medium text-gray-900 dark:border-disabled-dark dark:bg-highlight-dark dark:text-background-light-gray"
                              >
                                <span>{category}</span>
                                <button
                                  onClick$={() => {
                                    const url = new URL(loc.url);
                                    url.searchParams.delete("category");
                                    urlStateManager.value.category
                                      .filter((slug) => slug !== category)
                                      .forEach((slug) => url.searchParams.append("category", slug));
                                    nav(url.toString());
                                  }}
                                  type="button"
                                  class="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500"
                                >
                                  <span class="sr-only">Remove filter for {category}</span>
                                  <svg
                                    class="h-2 w-2"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 8 8"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-width="1.5"
                                      d="M1 1l6 6m0-6L1 7"
                                    />
                                  </svg>
                                </button>
                              </span>
                            ))}

                            {urlStateManager.value.tag.map((tag) => (
                              <span
                                key={`filtertag${tag}`}
                                class="m-1 inline-flex items-center rounded-full border border-gray-200 bg-white py-1.5 pl-3 pr-2 text-sm font-medium text-gray-900 dark:border-disabled-dark dark:bg-highlight-dark dark:text-background-light-gray"
                              >
                                <span>{tag}</span>
                                <button
                                  onClick$={() => {
                                    const url = new URL(loc.url);
                                    url.searchParams.delete("tag");
                                    urlStateManager.value.tag
                                      .filter((slug) => slug !== tag)
                                      .forEach((slug) => url.searchParams.append("tag", slug));
                                    nav(url.toString());
                                  }}
                                  type="button"
                                  class="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500"
                                >
                                  <span class="sr-only">Remove filter for {tag}</span>
                                  <svg
                                    class="h-2 w-2"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 8 8"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-width="1.5"
                                      d="M1 1l6 6m0-6L1 7"
                                    />
                                  </svg>
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <section class="py-4">
                      <Masonry client:only>
                        {sortedDisplay.value.map((course) => {
                          return (
                            <Link
                              href={course.link || undefined}
                              key={course.id}
                              class="item flex cursor-pointer flex-col gap-3 rounded-lg border-2 border-primary-dark-gray bg-background-light-gray p-3 shadow-md hover:shadow-lg dark:border-disabled-dark dark:bg-highlight-dark"
                            >
                              <h3 class="font-mosk text-base font-bold tracking-wide md:text-lg">
                                {course.name}
                              </h3>
                              <p class="whitespace-pre-line text-sm">{course.short_description}</p>
                              <div class="flex items-center gap-2">
                                <span class="-mt-[6px] block text-[15px] text-primary-dark-gray dark:text-background-light-gray">
                                  <LuRocket />
                                </span>
                                <p
                                  class={cn(
                                    "self-start border-b-2 pb-1",
                                    course.difficulty === "easy" && "border-sea",
                                    course.difficulty === "intermediate" && "border-yellow",
                                    course.difficulty === "advanced" && "border-pink"
                                  )}
                                >
                                  {course.difficulty}
                                </p>
                              </div>
                              {course.tags && (
                                <div class="flex items-start gap-2">
                                  <span class=" block text-[15px] text-primary-dark-gray dark:text-background-light-gray">
                                    <LuTags />
                                  </span>
                                  <p class="flex gap-2 whitespace-pre-wrap break-all">
                                    {course.tags
                                      .map((tagId) => tags.find((tag) => tag.id === tagId))
                                      .filter((x) => x)
                                      .map((tag) => tag!.name)
                                      .join(", ")}
                                  </p>
                                </div>
                              )}
                              {course.is_premium && (
                                <div class="flex items-start gap-2">
                                  <p class="flex items-center gap-2">
                                    <span class="text-[15px] text-tomato dark:text-pink">
                                      <LuGem />
                                    </span>
                                    <span class="text-tomato dark:text-pink">
                                      Subscription Required
                                    </span>
                                  </p>
                                </div>
                              )}
                            </Link>
                          );
                        })}
                      </Masonry>
                    </section>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
});

export const head: DocumentHead = {
  title: "Catalog",
  meta: [
    {
      name: "description",
      content: "Browse all the courses and projects available.",
    },
  ],
};
