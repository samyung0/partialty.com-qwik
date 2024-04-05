import type { Signal } from '@builder.io/qwik';
import { component$ } from '@builder.io/qwik';
import { LuArrowLeft } from '@qwikest/icons/lucide';
import type { NewContentIndex } from '../../../../drizzle_turso/schema/content_index';
import { listSupportedLang } from '../../../../lang';

export default component$(({ courseData, formSteps }: { courseData: NewContentIndex; formSteps: Signal<number> }) => {
  return (
    <div class="relative h-[100vh] w-[95vw] md:w-[80vw]">
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
              Choose Course Language
            </h1>
            <br />
            <div class="flex flex-col items-center justify-center space-y-6">
              {listSupportedLang.length > 0 && (
                <ul class="flex max-w-[500px] flex-wrap gap-2 px-6">
                  {listSupportedLang.map((lang) => (
                    <li
                      onClick$={() => {
                        courseData.lang = lang.value;
                      }}
                      key={`Lang${lang.value}`}
                      class={
                        'relative cursor-pointer rounded-lg border-2 border-primary-dark-gray bg-background-light-gray px-3 py-2 text-[0.875rem] transition-all hover:bg-primary-dark-gray hover:text-background-light-gray dark:bg-primary-dark-gray dark:hover:bg-background-light-gray dark:hover:text-primary-dark-gray md:px-4 md:py-3 md:text-[1rem] ' +
                        (courseData.lang === lang.value
                          ? ' bg-primary-dark-gray text-background-light-gray  dark:!bg-background-light-gray dark:!text-tomato '
                          : '')
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
                  class="block w-[250px] rounded-lg bg-primary-dark-gray p-2 text-background-light-gray dark:bg-primary-dark-gray md:w-[300px] md:p-4"
                >
                  <span class="text-[0.875rem] md:text-[1rem]">Next</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});
