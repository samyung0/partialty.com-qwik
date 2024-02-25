import type { Signal } from "@builder.io/qwik";
import { component$, useSignal } from "@builder.io/qwik";
import { z } from "@builder.io/qwik-city";
import { LuArrowLeft } from "@qwikest/icons/lucide";
import LoadingSVG from "~/components/LoadingSVG";
import type { NewContentIndex } from "../../../../drizzle_turso/schema/content_index";

const schema = z.object({
  description: z
    .string()
    .trim()
    .min(2, "A description is required")
    .max(5000, "Description is too long (max. 5000 chars)"),
});

export default component$(
  ({
    courseData,
    courseDataError,
    formSteps,
  }: {
    courseData: NewContentIndex;
    courseDataError: {
      name: string;
      chapter_order: string;
      description: string;
    };
    formSteps: Signal<number>;
  }) => {
    const loading = useSignal(false);
    const ref = useSignal<HTMLTextAreaElement>();
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
              Give your course a description
            </h1>
            <br />
            <div class="flex flex-col items-center justify-center space-y-6">
              <div>
                <label for="description" class="cursor-pointer text-lg">
                  Description (chars: {courseData.description?.length ?? 0}/5000)
                </label>
                <div class="pt-1">
                  <textarea
                    ref={ref}
                    name="description"
                    id="description"
                    value={courseData.description}
                    onInput$={(e, eventTarget) => {
                      courseData.description = eventTarget.value.slice(0, 5000);
                      if (ref.value) ref.value.value = courseData.description;
                    }}
                    class={
                      "h-[200px] w-[400px] rounded-md border-2 px-3 py-2 text-lg dark:border-background-light-gray  dark:bg-highlight-dark dark:text-background-light-gray dark:disabled:border-black/20 " +
                      (courseDataError.description
                        ? "border-tomato dark:border-tomato"
                        : "border-black/10")
                    }
                  />
                </div>
                <p class="w-[300px] pt-1 tracking-wide text-tomato">
                  {courseDataError.description}
                </p>
              </div>
              <br />
              <button
                onClick$={async () => {
                  courseDataError.description = "";
                  loading.value = true;
                  const result = schema.safeParse(courseData);
                  if (!result.success) {
                    courseDataError.description = result.error.issues[0].message;
                    loading.value = false;
                    return;
                  }
                  formSteps.value++;
                  loading.value = false;
                }}
                type="button"
                class="block w-[300px] rounded-lg bg-primary-dark-gray p-4 text-background-light-gray dark:bg-primary-dark-gray"
              >
                {loading.value && (
                  <span>
                    <LoadingSVG />
                  </span>
                )}
                {!loading.value && <span>Next</span>}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }
);
