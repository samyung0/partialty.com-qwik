import type { Signal } from '@builder.io/qwik';
import { $, component$, useSignal, useStore } from '@builder.io/qwik';
import { server$, z } from '@builder.io/qwik-city';
import { LuArrowLeft, LuTrash, LuX } from '@qwikest/icons/lucide';
import { and, eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import LoadingSVG from '~/components/LoadingSVG';
import { useCategories } from '~/routes/(lang)/(wrapper)/(authRoutes)/creator/layout';
import { useUserLoader } from '~/routes/(lang)/(wrapper)/(authRoutes)/layout';
import drizzleClient from '~/utils/drizzleClient';
import type { ContentCategory } from '../../../../drizzle_turso/schema/content_category';
import { content_category } from '../../../../drizzle_turso/schema/content_category';
import type { NewContentIndex } from '../../../../drizzle_turso/schema/content_index';
import type { NewTag } from '../../../../drizzle_turso/schema/tag';

const checkExistingCourseFromCategory = server$(async function (id: string) {
  return (
    await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === '1')
      .select()
      .from(content_category)
      .where(eq(content_category.id, id))
  )[0].content_index_id;
});

const deleteCategoryAction = server$(async function (id: string) {
  return await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === '1')
    .delete(content_category)
    .where(eq(content_category.id, id))
    .returning();
});

const addCategoryAction = server$(async function (formData: NewTag) {
  return await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === '1')
    .insert(content_category)
    .values(formData)
    .returning();
});

const checkExistingCategory = server$(async function (slug: string) {
  return await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === '1')
    .select({ id: content_category.id })
    .from(content_category)
    .where(and(eq(content_category.slug, slug), eq(content_category.approved, true)));
});

const checkExistingCategoryLink = server$(async function (link: string) {
  return await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === '1')
    .select({ id: content_category.id })
    .from(content_category)
    .where(and(eq(content_category.link, link), eq(content_category.approved, true)));
});

const addCategorySchema = z.object({
  name: z.string().min(1, 'A name is required').max(35, 'Name is too long (max. 35 chars)'),
  slug: z
    .string()
    .min(2, 'A slug is required')
    .regex(/^[a-zA-Z0-9]+.*[a-zA-Z0-9]+$/, 'The slug must start and end with characters!')
    .regex(/^[a-zA-Z0-9]+[-a-zA-Z]*[a-zA-Z0-9]+$/, 'No special characters except hyphens are allowed'),
  link: z
    .string()
    .min(1, 'A link is required')
    .regex(/^\//, 'The link needs to start with a slash')
    .regex(/^\/[a-zA-Z0-9]+[-?=&/a-zA-Z0-9]*$/, 'No special characters except -?=& are allowed'),
});

export const AddCategory = component$(
  ({
    showAddCategory,
    categories,
    createdCategory,
    courseData,
  }: {
    showAddCategory: Signal<boolean>;
    categories: ContentCategory[];
    createdCategory: Signal<ContentCategory | undefined>;
    courseData: NewContentIndex;
  }) => {
    const userRole = useUserLoader().value.role;
    const formData = useStore<ContentCategory>({
      id: uuidv4(),
      name: '',
      slug: '',
      link: '/catalog?category=',
      content_index_id: [],
      approved: false,
    });
    const formError = useStore({
      name: '',
      slug: '',
      link: '',
    });
    const ref = useSignal<HTMLInputElement>();
    const ref2 = useSignal<HTMLInputElement>();
    const loading = useSignal(false);

    const handleSubmit = $(async () => {
      loading.value = true;
      formError.name = '';
      formError.slug = '';
      formError.link = '';
      const result = addCategorySchema.safeParse(formData);
      if (!result.success) {
        formError.name = result.error.formErrors.fieldErrors.name?.join('\n') || '';
        formError.slug = result.error.formErrors.fieldErrors.slug?.join('\n') || '';
        formError.link = result.error.formErrors.fieldErrors.link?.join('\n') || '';
        loading.value = false;
        return;
      }
      if (!formData.link.startsWith('/catalog') && !window.confirm('Are you sure you want to use a custom link?')) {
        loading.value = false;
        return;
      }
      const dup = await checkExistingCategory(formData.slug);
      if (dup.length > 0) {
        formError.slug = 'Slug already exists!';
        loading.value = false;
        return;
      }
      const dup2 = await checkExistingCategoryLink(formData.link);
      if (dup2.length > 0) {
        formError.link = 'Link already exists!';
        loading.value = false;
        return;
      }
      // const ret = await addCategoryAction(formData);
      categories.push(formData);
      createdCategory.value = formData;
      loading.value = false;
      showAddCategory.value = false;
      if (!courseData.category) courseData.category = formData.id;
    });
    return (
      <div class="absolute left-0 top-0 z-10 flex h-[100vh] w-full items-center justify-center backdrop-blur-sm">
        <div class="relative flex w-[40vw] min-w-[350px] max-w-[600px] flex-col items-center justify-center gap-3 rounded-lg border-2 border-black bg-white py-16 dark:bg-highlight-dark">
          <button
            onClick$={() => (showAddCategory.value = false)}
            class="absolute right-5 top-5 block p-1 text-[15px] text-primary-dark-gray dark:text-background-light-gray md:text-[20px]"
          >
            <LuX />
          </button>
          <h2 class="pb-3 text-center font-mosk text-[1.5rem] font-bold tracking-wider md:pb-6 md:text-[2rem]">
            Add Category
          </h2>
          <div>
            <div>
              <label for="categoryName" class="cursor-pointer text-base md:text-lg">
                Name
              </label>
              <div class="pt-1">
                <input
                  id="categoryName"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onInput$={(_, el) => {
                    formData.name = el.value;
                    formData.slug = el.value.toLowerCase().replace(/ /g, '-');
                    formData.link = `/catalog?category=${formData.slug}`;
                    if (ref.value) ref.value.scrollLeft += 99999;
                    if (ref2.value) ref2.value.scrollLeft += 99999;
                  }}
                  required
                  class={
                    'w-[250px] rounded-md border-2 px-3 py-2 dark:border-background-light-gray dark:bg-highlight-dark  dark:text-background-light-gray dark:disabled:border-disabled-dark dark:disabled:bg-disabled-dark md:w-[300px] ' +
                    (formError.name ? 'border-tomato dark:border-tomato' : 'border-black/10')
                  }
                />
              </div>
              <p class="w-[250px] whitespace-pre-wrap break-words pt-1 tracking-wide text-tomato md:w-[300px]">
                {formError.name}
              </p>
            </div>
            <div>
              <label for="categorySlug" class="cursor-pointer text-base md:text-lg">
                Slug
              </label>
              <div class="pt-1">
                <input
                  ref={ref}
                  id="categorySlug"
                  disabled={userRole !== 'admin'}
                  name="slug"
                  type="text"
                  value={formData.slug}
                  onInput$={(_, el) => {
                    formData.slug = el.value;
                  }}
                  required
                  class={
                    'w-[250px] rounded-md border-2 px-3 py-2 dark:border-background-light-gray dark:bg-highlight-dark  dark:text-background-light-gray dark:disabled:border-disabled-dark dark:disabled:bg-disabled-dark md:w-[300px] ' +
                    (formError.slug ? 'border-tomato dark:border-tomato' : 'border-black/10')
                  }
                />
              </div>
              <p class="w-[250px] whitespace-pre-wrap break-words pt-1 tracking-wide text-tomato md:w-[300px]">
                {formError.slug}
              </p>
            </div>
            <div>
              <label for="categorLink" class="cursor-pointer text-base md:text-lg">
                Link
              </label>
              <div class="pt-1">
                <input
                  ref={ref2}
                  id="categorLink"
                  name="link"
                  type="text"
                  disabled={userRole !== 'admin'}
                  value={formData.link}
                  onInput$={(_, el) => {
                    formData.link = el.value;
                  }}
                  required
                  class={
                    'w-[250px] rounded-md border-2 px-3 py-2 dark:border-background-light-gray dark:bg-highlight-dark  dark:text-background-light-gray dark:disabled:border-disabled-dark dark:disabled:bg-disabled-dark md:w-[300px] ' +
                    (formError.link ? 'border-tomato dark:border-tomato' : 'border-black/10')
                  }
                />
              </div>
              <p class="w-[250px] whitespace-pre-wrap break-words pt-1 tracking-wide text-tomato md:w-[300px]">
                {formError.link}
              </p>
            </div>
            <br />
            <button
              type="button"
              onClick$={handleSubmit}
              class="block w-[250px] rounded-lg bg-primary-dark-gray p-2 text-background-light-gray dark:bg-primary-dark-gray md:w-[300px] md:p-4"
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
    );
  }
);

function remove_duplicates_safe(arr: any[]) {
  const seen: any = {};
  const ret_arr: any = [];
  for (let i = 0; i < arr.length; i++) {
    if (!(arr[i].id in seen)) {
      ret_arr.push(arr[i]);
      seen[arr[i].id] = true;
    }
  }
  return ret_arr;
}

export default component$(
  ({
    courseData,
    courseDataError,
    formSteps,
    createdCategory,
    isEditing = false,
    isPublished = false,
  }: {
    courseData: NewContentIndex;
    courseDataError: {
      name: string;
      chapter_order: string;
      description: string;
    };
    createdCategory: Signal<ContentCategory | undefined>;
    formSteps: Signal<number>;
    isPublished?: boolean;
    isEditing?: boolean;
  }) => {
    const _categories = useCategories().value.filter((cat) => cat.approved);
    const categories = useStore(() => {
      if (createdCategory.value) {
        const t = [..._categories, createdCategory.value];
        return remove_duplicates_safe(t) as ContentCategory[];
      } else return _categories;
    });
    const loading = useSignal(false);
    const showAddCategory = useSignal(false);

    const handleDeleteCategory = $(async (id: string) => {
      // const coursesWithCategory = await checkExistingCourseFromCategory(id);
      // if (coursesWithCategory.length > 0) {
      //   return alert(
      //     "Course(s) with category exists! Please remove all courses with this category first."
      //   );
      // }
      // await deleteCategoryAction(id);
      if (courseData.category === id) courseData.category = '';
      const index = categories.findIndex((category) => category.id === id);
      createdCategory.value = undefined;
      categories.splice(index, 1);
      // return alert("Category deleted successfully.");
    });

    return (
      <div class="relative h-[100vh] w-[95vw] md:w-[80vw]">
        {showAddCategory.value && !createdCategory.value && (
          <AddCategory
            createdCategory={createdCategory}
            showAddCategory={showAddCategory}
            categories={categories}
            courseData={courseData}
          />
        )}
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
                Choose a category
              </h1>
              <br />
              <div class="flex flex-col items-center justify-center space-y-6">
                {!createdCategory.value && (
                  <button
                    onClick$={() => {
                      if (isEditing && isPublished) return window.alert('Cannot add new category after publishing!');
                      showAddCategory.value = true;
                    }}
                    class="w-[250px] rounded-md bg-primary-dark-gray px-4 py-2 text-[0.875rem] text-background-light-gray md:w-[300px] md:px-6 md:text-[1rem]"
                  >
                    Add New Category
                  </button>
                )}
                {categories.length > 0 && (
                  <ul class="flex max-w-[500px] flex-wrap gap-2 px-6">
                    {categories.map((category) => (
                      <li
                        onClick$={() => {
                          if (courseData.category === category.id) courseData.category = '';
                          else courseData.category = category.id;
                        }}
                        key={`Category${category.id}`}
                        class={
                          'relative cursor-pointer rounded-lg border-2 border-primary-dark-gray bg-background-light-gray px-3 py-2 text-[0.875rem] transition-all hover:bg-primary-dark-gray hover:text-background-light-gray dark:bg-primary-dark-gray dark:hover:bg-background-light-gray dark:hover:text-primary-dark-gray md:px-4 md:py-3 md:text-[1rem] ' +
                          (courseData.category === category.id
                            ? ' bg-primary-dark-gray text-background-light-gray  dark:!bg-background-light-gray dark:!text-tomato '
                            : '') +
                          (createdCategory.value && createdCategory.value.id === category.id && ' pr-10 md:pr-12')
                        }
                      >
                        <span>{category.name}</span>
                        {createdCategory.value && createdCategory.value.id === category.id && (
                          <span
                            onClick$={(e) => {
                              e.stopPropagation();
                              handleDeleteCategory(category.id);
                            }}
                            class="absolute right-[6px] top-[50%] block translate-y-[-50%] rounded-md bg-tomato p-1 text-[12px] text-background-light-gray md:text-[15px]"
                          >
                            <LuTrash />
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                <br />
                <div class="flex flex-col items-center justify-center gap-3">
                  <button
                    onClick$={() => formSteps.value++}
                    class="text-sm underline decoration-wavy underline-offset-[6px] md:text-base"
                  >
                    Skip for now
                  </button>
                  <button
                    onClick$={() => {
                      formSteps.value++;
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
          </div>
        </section>
      </div>
    );
  }
);
