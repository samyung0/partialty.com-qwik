import type { Signal } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import { LuArrowLeft, LuEyeOff, LuFiles, LuGem } from "@qwikest/icons/lucide";
import { useUserLoader } from "~/routes/[lang.]/(wrapper)/(authRoutes)/layout";
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
      <section class="flex h-[100vh] w-[80vw] items-center justify-center bg-sherbet dark:bg-primary-dark-gray">
        <div class="relative flex w-[50vw] min-w-[400px] max-w-[700px] items-center justify-center rounded-lg border-2 border-black bg-white py-16 dark:bg-highlight-dark">
          <div
            class="absolute left-6 top-6 cursor-pointer text-[25px] text-primary-dark-gray dark:text-background-light-gray"
            onClick$={() => formSteps.value--}
          >
            <LuArrowLeft />
          </div>
          <div>
            <h1 class="pb-6 text-center font-mosk text-[2.5rem] font-bold tracking-wider">
              Other settings
            </h1>
            <br />
            <div class="flex flex-col items-center justify-center space-y-6">
              <div>
                <label
                  title="A course can only be viewed through invite codes if it is set to private, and will not be listed in the course catalog."
                  for="isPrivate"
                  class="flex cursor-pointer items-center gap-5   text-lg"
                >
                  <span class="flex items-center gap-2">
                    <span class="text-[20px] text-primary-dark-gray dark:text-background-light-gray">
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
                  class="flex cursor-pointer items-center gap-5   text-lg"
                >
                  <span class="flex items-center gap-2">
                    <span class="text-[20px] text-primary-dark-gray dark:text-background-light-gray">
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
                    class="flex cursor-pointer items-center gap-5   text-lg"
                  >
                    <span class="flex items-center gap-2">
                      <span class="text-[20px] text-primary-dark-gray dark:text-background-light-gray">
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
              <br />
              <p class="max-w-[400px] text-base text-tomato">
                Setting the course private will disable all the category and tags for the course!
              </p>
              <br />
              <p class="max-w-[400px] text-base">
                Once you have submitted a non-private course, you need to mark it as ready for
                review and a few days are required before the course is approved and published.
              </p>
              <br />
              <button
                onClick$={() => formSteps.value++}
                class="block w-[300px] rounded-lg bg-primary-dark-gray p-4 text-background-light-gray dark:bg-primary-dark-gray"
              >
                <span>Review Course Info</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }
);
