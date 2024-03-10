import type { Signal } from "@builder.io/qwik";
import { component$, useSignal } from "@builder.io/qwik";
import { server$, z } from "@builder.io/qwik-city";
import { and, eq } from "drizzle-orm";
import LoadingSVG from "~/components/LoadingSVG";
import { useUserLoader } from "~/routes/[lang.]/(wrapper)/(authRoutes)/layout";
import drizzleClient from "~/utils/drizzleClient";
import type { NewContentIndex } from "../../../../drizzle_turso/schema/content_index";
import { content_index } from "../../../../drizzle_turso/schema/content_index";

const checkExistingCourse = server$(async (slug: string) => {
  return await drizzleClient()
    .select({ id: content_index.id })
    .from(content_index)
    .where(and(eq(content_index.slug, slug), eq(content_index.is_deleted, false)));
});

const schema = z.object({
  name: z.string().trim().min(2, "A name is required").max(70, "Name is too long (max. 70 chars)"),
});

export default component$(
  ({
    courseData,
    courseDataError,
    formSteps,
    isEditing = false,
  }: {
    courseData: NewContentIndex;
    courseDataError: {
      name: string;
      chapter_order: string;
      description: string;
      short_description: string;
    };
    formSteps: Signal<number>;
    isEditing?: boolean;
  }) => {
    const user = useUserLoader().value;
    const loading = useSignal(false);
    const ref = useSignal<HTMLInputElement>();
    return (
      <section class="flex h-[100vh] w-[95vw] items-center justify-center bg-sherbet dark:bg-primary-dark-gray md:w-[80vw]">
        <div class="flex w-full items-center justify-center rounded-lg border-2 border-black bg-white py-16 dark:bg-highlight-dark md:w-[80%] lg:w-[60%] lg:min-w-[400px] lg:max-w-[700px]">
          <div>
            <h1 class="px-4 pb-3 text-center font-mosk text-[1.5rem] font-bold tracking-wider md:pb-6 md:text-[2rem] lg:text-[2.5rem]">
              What is your course called
            </h1>
            <br />
            <div class="flex flex-col items-center justify-center space-y-6">
              <div>
                <label for="name" class="cursor-pointer text-base md:text-lg">
                  Name
                </label>
                <div class="pt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={courseData.name}
                    onInput$={(_, el) => {
                      courseData.name = el.value;
                      courseData.slug = el.value.toLowerCase().replace(/ /g, "-");
                      if (ref.value) ref.value.scrollLeft += 99999;
                    }}
                    required
                    class={
                      "w-[250px] rounded-md border-2 px-3 py-2 dark:border-background-light-gray dark:bg-highlight-dark  dark:text-background-light-gray dark:disabled:border-black/20 md:w-[300px] " +
                      (courseDataError.name
                        ? "border-tomato dark:border-tomato"
                        : "border-black/10")
                    }
                  />
                </div>
                <p class="w-[250px] pt-1 tracking-wide text-tomato md:w-[300px]">
                  {courseDataError.name}
                </p>
              </div>
              <div>
                <label for="slug" class="cursor-pointer text-base md:text-lg">
                  Slug
                </label>
                <div class="pt-1">
                  <input
                    ref={ref}
                    disabled
                    id="slug"
                    name="slug"
                    type="text"
                    autoComplete="slug"
                    value={courseData.slug}
                    required
                    class={
                      "w-[250px] rounded-md border-2 px-3 py-2 disabled:bg-gray-300 dark:border-background-light-gray  dark:bg-highlight-dark dark:text-background-light-gray  dark:disabled:border-disabled-dark dark:disabled:bg-disabled-dark md:w-[300px] "
                    }
                  />
                </div>
              </div>
              <br />
              <button
                onClick$={async () => {
                  courseDataError.name = "";
                  loading.value = true;
                  const result = schema.safeParse(courseData);
                  if (!result.success) {
                    courseDataError.name = result.error.issues[0].message;
                    loading.value = false;
                    return;
                  }
                  const existingCourse = await checkExistingCourse(courseData.slug);
                  if (
                    existingCourse.length > 0 &&
                    (isEditing ? existingCourse[0].id !== courseData.id : true)
                  ) {
                    courseDataError.name = "A course with this name already exists";
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
