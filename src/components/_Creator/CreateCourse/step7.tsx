import type { QRL, Signal } from "@builder.io/qwik";
import { component$, useSignal } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { LuArrowLeft } from "@qwikest/icons/lucide";
import LoadingSVG from "~/components/LoadingSVG";
import { useCategories, useTags } from "~/routes/[lang.]/(wrapper)/(authRoutes)/creator/layout";
import { useUserLoader } from "~/routes/[lang.]/(wrapper)/(authRoutes)/layout";
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
    createdTags: Signal<Tag[]>;
    handleSubmit: QRL<() => void>;
    isEditing?: boolean;
  }) => {
    const categories = useCategories().value;
    const tags = useTags().value;
    const user = useUserLoader().value;
    const loading = useSignal(false);
    const nav = useNavigate();
    return (
      <section class="flex h-[100vh] w-[80vw] items-center justify-center bg-sherbet dark:bg-primary-dark-gray">
        <div class="relative flex w-[50vw] min-w-[400px] max-w-[700px] items-center justify-center rounded-lg border-2 border-black bg-white py-16 dark:bg-highlight-dark">
          <div
            class="absolute left-6 top-6 text-[25px] text-primary-dark-gray dark:text-background-light-gray"
            onClick$={() => formSteps.value--}
          >
            <LuArrowLeft />
          </div>
          <div>
            <h1 class="pb-6 text-center font-mosk text-[2.5rem] font-bold tracking-wider">
              Course Details
            </h1>
            <br />
            <div class="flex w-[400px] flex-col items-center justify-center space-y-6">
              <div class="w-full">
                <p class="flex w-full items-center justify-between gap-5 text-lg">
                  <span>Name:</span> <span>{courseData.name}</span>
                </p>
              </div>
              <div class="w-full">
                <p class="flex w-full items-center justify-between gap-5 text-lg">
                  <span>Description:</span> <span>{courseData.description}</span>
                </p>
              </div>
              {!courseData.is_private && (
                <div class="w-full">
                  <p class="flex w-full items-center justify-between gap-5 text-lg">
                    <span>Category:</span>{" "}
                    <span>
                      {categories.find((category) => category.id === courseData.category)?.name ||
                        ""}{" "}
                      {createdCategory.value?.id === courseData.category ? "(new)" : ""}
                    </span>
                  </p>
                </div>
              )}
              {!courseData.is_private && (
                <div class="w-full">
                  <div class="flex w-full items-center justify-between gap-5 text-lg">
                    <span>Tags:</span>{" "}
                    <ul class="flex max-w-[300px] flex-wrap gap-2">
                      {courseData.tags!.map((tag) => (
                        <li key={`CourseReview${tag}`}>
                          {tags.find((tag2) => tag2.id === tag)?.name || ""}{" "}
                          {createdTags.value.find((tag2) => tag2.id === tag) ? "(new)" : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              <div class="w-full">
                <p class="flex w-full items-center justify-between gap-5 text-lg">
                  <span>Language:</span>{" "}
                  <span>
                    {listSupportedLang.find((lang) => lang.value === courseData.lang)?.label || ""}
                  </span>
                </p>
              </div>
              <div class="w-full">
                <p class="flex w-full items-center justify-between gap-5 text-lg">
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
                <p class="flex w-full items-center justify-between gap-5 text-lg">
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
                  <p class="flex w-full items-center justify-between gap-5 text-lg">
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
                  <p class="flex items-center justify-between gap-5 text-base">
                    A course approval is needed before it is published.
                  </p>
                </div>
              )}
              <br />
              <button
                onClick$={async () => {
                  if (loading.value) return;
                  loading.value = true;
                  await handleSubmit();
                  loading.value = false;
                  window.close();
                }}
                class="block w-[300px] rounded-lg bg-primary-dark-gray p-4 text-background-light-gray dark:bg-primary-dark-gray"
              >
                {loading.value && (
                  <span>
                    <LoadingSVG />
                  </span>
                )}
                {!loading.value && <span>{isEditing ? "Update Course" : "Submit Course"}</span>}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }
);
