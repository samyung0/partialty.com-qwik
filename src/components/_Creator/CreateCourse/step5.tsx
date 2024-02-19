import type { Signal } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import { LuArrowLeft } from "@qwikest/icons/lucide";
import type { NewContentIndex } from "../../../../drizzle_turso/schema/content_index";
import { listSupportedLang } from "../../../../lang";

export default component$(
  ({ courseData, formSteps }: { courseData: NewContentIndex; formSteps: Signal<number> }) => {
    return (
      <div class="relative h-[100vh] w-[80vw]">
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
                Choose Course Language
              </h1>
              <br />
              <div class="flex flex-col items-center justify-center space-y-6">
                {listSupportedLang.length > 0 && (
                  <ul class="flex max-w-[500px] flex-wrap gap-2">
                    {listSupportedLang.map((lang) => (
                      <li
                        onClick$={() => {
                          courseData.lang = lang.value;
                        }}
                        key={`Lang${lang.value}`}
                        class={
                          "relative cursor-pointer rounded-lg border-2 border-primary-dark-gray bg-background-light-gray px-4 py-3 transition-all hover:bg-primary-dark-gray hover:text-background-light-gray dark:bg-primary-dark-gray dark:hover:bg-background-light-gray dark:hover:text-primary-dark-gray " +
                          (courseData.lang === lang.value
                            ? " bg-primary-dark-gray text-background-light-gray  dark:!bg-background-light-gray dark:!text-tomato "
                            : "")
                        }
                      >
                        <span>{lang.label}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <br />
                <div class="flex flex-col items-center justify-center gap-3">
                  <button
                    onClick$={async () => {
                      formSteps.value++;
                    }}
                    type="button"
                    class="block w-[300px] rounded-lg bg-primary-dark-gray p-4 text-background-light-gray dark:bg-primary-dark-gray"
                  >
                    <span>Next</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
);
