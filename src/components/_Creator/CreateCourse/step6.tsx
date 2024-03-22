import type { Signal } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import { LuArrowLeft, LuEyeOff, LuFiles, LuGem, LuScrollText } from "@qwikest/icons/lucide";
import type difficulty from "~/const/difficulty";
import { difficultyLabels } from "~/const/difficulty";
import { useUserLoader } from "~/routes/(lang)/(wrapper)/(authRoutes)/layout";
import type { NewContentIndex } from "../../../../drizzle_turso/schema/content_index";

export default component$(
  ({
    courseData,
    formSteps,
    isEditing = false,
  }: {
    courseData: NewContentIndex;
    formSteps: Signal<number>;
    isEditing?: boolean;
  }) => {
    const user = useUserLoader().value;
    return (
      <section class="flex h-[100vh] w-[95vw] items-center justify-center bg-sherbet dark:bg-primary-dark-gray md:w-[80vw]">
        <div class="relative flex w-full items-center justify-center rounded-lg border-2 border-black bg-white py-16 dark:bg-highlight-dark md:w-[80%] lg:w-[60%] lg:min-w-[400px] lg:max-w-[700px]">
          <div
            class="absolute left-3 top-3 cursor-pointer text-[20px] text-primary-dark-gray dark:text-background-light-gray md:left-6 md:top-6 md:text-[25px]"
            onClick$={() => formSteps.value--}
          >
            <LuArrowLeft />
          </div>
          <div>
            <h1 class="px-4 pb-3 text-center font-mosk text-[1.5rem] font-bold tracking-wider md:pb-6 md:text-[2rem] lg:text-[2.5rem]">
              Other settings
            </h1>
            <br />
            <div class="flex flex-col items-center justify-center space-y-6">
              <div>
                <label
                  title="Sets the difficulty of the course"
                  for="difficulty"
                  class="flex cursor-pointer items-center gap-3 text-base md:gap-5 md:text-lg"
                >
                  <span class="flex items-center gap-2">Difficulty</span>
                  <select
                    name="difficulty"
                    id="diffculty"
                    value={courseData.difficulty}
                    class="rounded-md border-2 px-3 py-1 dark:border-primary-dark-gray dark:bg-primary-dark-gray"
                    onChange$={(e, currentTarget) => {
                      courseData.difficulty = currentTarget.value as (typeof difficulty)[number];
                    }}
                  >
                    {Object.entries(difficultyLabels).map(([val, label]) => {
                      return (
                        <option key={`difficulty${val}`} value={val}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                </label>
              </div>
              {user.role === "admin" && (
                <div>
                  <label
                    title="Shows up in the guides section"
                    for="isGuide"
                    class="flex cursor-pointer items-center gap-3 text-base md:gap-5 md:text-lg"
                  >
                    <span class="flex items-center gap-2">
                      <span class="text-[15px] text-primary-dark-gray dark:text-background-light-gray md:text-[20px]">
                        <LuScrollText />
                      </span>
                      Guide
                    </span>
                    <input
                      id="isGuide"
                      type="checkbox"
                      class="h-4 w-4"
                      checked={courseData.is_guide}
                      onChange$={(e, currentTarget) =>
                        (courseData.is_guide = currentTarget.checked)
                      }
                    />
                  </label>
                </div>
              )}
              <div>
                <label
                  title="A course can only be viewed through invite codes if it is set to private, and will not be listed in the course catalog."
                  for="isPrivate"
                  class="flex cursor-pointer items-center gap-3 text-base md:gap-5 md:text-lg"
                >
                  <span class="flex items-center gap-2">
                    <span class="text-[15px] text-primary-dark-gray dark:text-background-light-gray md:text-[20px]">
                      <LuEyeOff />
                    </span>
                    Private
                  </span>
                  <input
                    id="isPrivate"
                    type="checkbox"
                    class="h-4 w-4"
                    checked={courseData.is_private}
                    onChange$={(e, currentTarget) =>
                      (courseData.is_private = currentTarget.checked)
                    }
                  />
                </label>
              </div>
              <div>
                <label
                  title="The option should be left empty if you are creating a blog or guide that has only a single page. Check this if you think it is better to split the course into multiple chapters. You CANNOT change this after creating the course."
                  for="multipleChapters"
                  class="flex cursor-pointer items-center gap-3 text-base md:gap-5 md:text-lg"
                >
                  <span class="flex items-center gap-2">
                    <span class="text-[15px] text-primary-dark-gray dark:text-background-light-gray md:text-[20px]">
                      <LuFiles />
                    </span>
                    Multiple chapters
                  </span>
                  <input
                    disabled={isEditing}
                    id="multipleChapters"
                    type="checkbox"
                    class="h-4 w-4"
                    checked={!courseData.is_single_page}
                    onChange$={(e, currentTarget) => {
                      if (isEditing) return;
                      courseData.is_single_page = !currentTarget.checked;
                    }}
                  />
                </label>
              </div>
              {user.role === "admin" && (
                <div>
                  <label
                    title="The course is only accessible to subscribed users if checked."
                    for="subscriptionRequired"
                    class="flex cursor-pointer items-center gap-3 text-base md:gap-5 md:text-lg"
                  >
                    <span class="flex items-center gap-2">
                      <span class="text-[15px] text-primary-dark-gray dark:text-background-light-gray md:text-[20px]">
                        <LuGem />
                      </span>
                      Subscription Required
                    </span>
                    <input
                      id="subscriptionRequired"
                      type="checkbox"
                      class="h-4 w-4"
                      checked={courseData.is_premium}
                      onChange$={(e, currentTarget) =>
                        (courseData.is_premium = currentTarget.checked)
                      }
                    />
                  </label>
                </div>
              )}
              <p class="max-w-[250px] text-sm text-tomato md:max-w-[400px] md:text-base">
                Setting the course private will disable all the category and tags for the course!
              </p>
              <p class="max-w-[250px] text-sm md:max-w-[400px]  md:text-base">
                Once you have submitted a non-private course, you need to mark it as ready for
                review and a few days are required before the course is approved and published.
              </p>
              <br />
              <button
                onClick$={() => formSteps.value++}
                class="block w-[250px] rounded-lg bg-primary-dark-gray p-2 text-background-light-gray dark:bg-primary-dark-gray md:w-[300px] md:p-4"
              >
                <span class="text-[0.875rem] md:text-[1rem]">Review Course Info</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }
);
