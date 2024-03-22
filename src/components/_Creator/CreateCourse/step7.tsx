import type { QRL, Signal } from "@builder.io/qwik";
import { component$, useSignal } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { LuArrowLeft } from "@qwikest/icons/lucide";
import LoadingSVG from "~/components/LoadingSVG";
import { useCategories, useTags } from "~/routes/(lang)/(wrapper)/(authRoutes)/creator/layout";
import { useUserLoader } from "~/routes/(lang)/(wrapper)/(authRoutes)/layout";
import type { ContentCategory } from "../../../../drizzle_turso/schema/content_category";
import type { NewContentIndex } from "../../../../drizzle_turso/schema/content_index";
import type { Tag } from "../../../../drizzle_turso/schema/tag";
import { listSupportedLang } from "../../../../lang";

export default component$(
  ({
    courseData,
    formSteps,
    createdCategory,
    createdTags,
    handleSubmit,
    isEditing = false,
  }: {
    courseData: NewContentIndex;
    formSteps: Signal<number>;
    createdCategory: Signal<ContentCategory | undefined>;
    createdTags: Tag[];
    handleSubmit: QRL<() => void>;
    isEditing?: boolean;
  }) => {
    const categories = useCategories().value;
    const tags = useTags().value;
    const user = useUserLoader().value;
    const loading = useSignal(false);
    const nav = useNavigate();
    return (
      <section class="flex h-[100vh] w-[95vw] items-center justify-center bg-sherbet dark:bg-primary-dark-gray md:w-[80vw]">
        <div class="relative flex w-full items-center justify-center rounded-lg border-2 border-black bg-white py-16 dark:bg-highlight-dark md:w-[80%] lg:w-[60%] lg:min-w-[400px] lg:max-w-[700px]">
          <button
            class="absolute left-3 top-3 cursor-pointer text-[20px] text-primary-dark-gray dark:text-background-light-gray md:left-6 md:top-6 md:text-[25px]"
            onClick$={() => formSteps.value--}
          >
            <LuArrowLeft />
          </button>
          <div>
            <h1 class="px-4 pb-3 text-center font-mosk text-[1.5rem] font-bold tracking-wider md:pb-6 md:text-[2rem] lg:text-[2.5rem]">
              Course Details
            </h1>
            <br />
            <div class="flex w-full flex-col items-center justify-center space-y-6 px-6 md:w-[400px] md:px-0">
              <div class="w-full">
                <p class="flex w-full items-center justify-between gap-3 text-base md:gap-5 md:text-lg">
                  <span>Name:</span> <span>{courseData.name}</span>
                </p>
              </div>
              <div class="w-full">
                <p class="flex w-full items-center justify-between gap-3 text-base md:gap-5 md:text-lg">
                  <span>Description:</span> <span>{courseData.description}</span>
                </p>
              </div>
              {!courseData.is_private && (
                <div class="w-full">
                  <p class="flex w-full items-center justify-between gap-3 text-base md:gap-5 md:text-lg">
                    <span>Category:</span>{" "}
                    <span>
                      {courseData.category
                        ? createdCategory.value && createdCategory.value.id === courseData.category
                          ? `${createdCategory.value.name} (new)`
                          : categories.find((category) => category.id === courseData.category)
                              ?.name || ""
                        : ""}
                    </span>
                  </p>
                </div>
              )}
              {!courseData.is_private && (
                <div class="w-full">
                  <div class="flex w-full items-center justify-between gap-3 text-base md:gap-5 md:text-lg">
                    <span>Tags:</span>{" "}
                    <ul class="flex max-w-[250px] flex-wrap gap-2 md:max-w-[300px]">
                      {courseData.tags!.map((tag) => {
                        const cTag = createdTags.find((tag2) => tag2.id === tag);
                        if (cTag) {
                          return <li key={`CourseReview${tag}`}>{cTag.name} (new)</li>;
                        }
                        return (
                          <li key={`CourseReview${tag}`}>
                            {tags.find((tag2) => tag2.id === tag)?.name || ""}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )}
              <div class="w-full">
                <p class="flex w-full items-center justify-between gap-3 text-base md:gap-5 md:text-lg">
                  <span>Language:</span>{" "}
                  <span>
                    {listSupportedLang.find((lang) => lang.value === courseData.lang)?.label || ""}
                  </span>
                </p>
              </div>
              <div class="w-full">
                <p class="flex w-full items-center justify-between gap-3 text-base md:gap-5 md:text-lg">
                  <span>Private:</span>{" "}
                  <input
                    type="checkbox"
                    class="h-4 w-4"
                    checked={courseData.is_private}
                    disabled={true}
                  />
                </p>
              </div>
              <div class="w-full">
                <p class="flex w-full items-center justify-between gap-3 text-base md:gap-5 md:text-lg">
                  <span>Multiple Chapters:</span>{" "}
                  <input
                    type="checkbox"
                    class="h-4 w-4"
                    checked={!courseData.is_single_page}
                    disabled={true}
                  />
                </p>
              </div>
              {user.role === "admin" && (
                <div class="w-full">
                  <p class="flex w-full items-center justify-between gap-3 text-base md:gap-5 md:text-lg">
                    <span>Subscription Required:</span>{" "}
                    <input
                      type="checkbox"
                      class="h-4 w-4"
                      checked={courseData.is_premium}
                      disabled={true}
                    />
                  </p>
                </div>
              )}
              {!courseData.is_private && (
                <div class="w-full text-center">
                  <p class="flex items-center justify-between gap-3 text-base md:gap-5">
                    A course approval is needed before it is published.
                  </p>
                </div>
              )}
              <br />
              <button
                onClick$={async () => {
                  if (loading.value) return;
                  loading.value = true;
                  try {
                    await handleSubmit();
                    loading.value = false;
                    window.close();
                    nav("/creator/", { forceReload: true });
                  } catch (e) {
                    console.error(e);
                    alert("Something went wrong! Please try again later or contact support.");
                  }
                }}
                class="block w-[250px] rounded-lg bg-primary-dark-gray p-4 text-background-light-gray dark:bg-primary-dark-gray md:w-[300px]"
              >
                {loading.value && (
                  <span>
                    <LoadingSVG />
                  </span>
                )}
                {!loading.value && (
                  <span class="text-[0.875rem] md:text-[1rem]">
                    {isEditing ? "Update Course" : "Submit Course"}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }
);
