import type { Signal } from '@builder.io/qwik';
import { component$, useSignal } from '@builder.io/qwik';
import { z } from '@builder.io/qwik-city';
import { LuArrowLeft } from '@qwikest/icons/lucide';
import LoadingSVG from '~/components/LoadingSVG';
import type { NewContentIndex } from '../../../../drizzle_turso/schema/content_index';

const schema = z.object({
  short_description: z
    .string()
    .trim()
    .min(2, 'A short description is required')
    .max(200, 'Description is too long (max. 200 chars)'),
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
      short_description: string;
    };
    formSteps: Signal<number>;
  }) => {
    const loading = useSignal(false);
    const ref = useSignal<HTMLTextAreaElement>();
    return (
      <section class="flex h-[100vh] w-[95vw] items-center justify-center bg-sherbet dark:bg-primary-dark-gray md:w-[80vw]">
        <div class="relative flex max-h-[90dvh] w-full items-start justify-center overflow-auto rounded-lg border-2 border-black bg-white py-16 dark:bg-highlight-dark md:w-[80%] lg:w-[60%] lg:min-w-[400px] lg:max-w-[700px]">
          <div
            class="absolute left-3 top-3 cursor-pointer text-[20px] text-primary-dark-gray dark:text-background-light-gray md:left-6 md:top-6 md:text-[25px]"
            onClick$={() => formSteps.value--}
          >
            <LuArrowLeft />
          </div>
          <div>
            <h1 class="px-4 pb-3 text-center font-mosk text-[1.5rem] font-bold tracking-wider md:pb-6 md:text-[2rem] lg:text-[2.5rem]">
              Give your course a short description
            </h1>
            <br />
            <div class="flex flex-col items-center justify-center space-y-6">
              <div>
                <label for="description" class="cursor-pointer text-base md:text-lg">
                  Description (chars: {courseData.short_description?.length ?? 0}/200)
                </label>
                <div class="pt-1">
                  <textarea
                    ref={ref}
                    name="short_description"
                    id="description"
                    value={courseData.short_description}
                    onInput$={(e, eventTarget) => {
                      courseData.short_description = eventTarget.value.slice(0, 200);
                      if (ref.value) ref.value.value = courseData.short_description;
                    }}
                    class={
                      'h-[300px] w-[80vw] min-w-[200px] rounded-md border-2 px-3 py-2 text-base dark:border-background-light-gray dark:bg-highlight-dark dark:text-background-light-gray dark:disabled:border-black/20  md:w-[400px] md:text-lg xl:w-[500px] ' +
                      (courseDataError.short_description ? 'border-tomato dark:border-tomato' : 'border-black/10')
                    }
                  />
                </div>
                <p class="w-[250px] pt-1 tracking-wide text-tomato md:w-[300px]">{courseDataError.short_description}</p>
              </div>
              <br />
              <button
                onClick$={async () => {
                  courseDataError.short_description = '';
                  loading.value = true;
                  const result = schema.safeParse(courseData);
                  if (!result.success) {
                    courseDataError.short_description = result.error.issues[0].message;
                    loading.value = false;
                    return;
                  }
                  formSteps.value++;
                  loading.value = false;
                }}
                type="button"
                class="block w-[250px] rounded-lg bg-primary-dark-gray p-2 text-background-light-gray dark:bg-primary-dark-gray md:w-[300px] md:p-4"
              >
                {loading.value && (
                  <span>
                    <LoadingSVG />
                  </span>
                )}
                {!loading.value && <span class="text-[0.875rem] md:text-[1rem]">Next</span>}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }
);
