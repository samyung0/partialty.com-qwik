import type { Signal } from "@builder.io/qwik";
import { $, component$, useSignal, useStore } from "@builder.io/qwik";
import { server$, z } from "@builder.io/qwik-city";
import { LuArrowLeft, LuTrash, LuX } from "@qwikest/icons/lucide";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import LoadingSVG from "~/components/LoadingSVG";
import { useTags } from "~/routes/[lang.]/(wrapper)/(authRoutes)/creator/layout";
import drizzleClient from "~/utils/drizzleClient";
import type { NewContentIndex } from "../../../../drizzle_turso/schema/content_index";
import type { NewTag, Tag } from "../../../../drizzle_turso/schema/tag";
import { tag } from "../../../../drizzle_turso/schema/tag";

const checkExistingCourseFromTag = server$(async (id: string) => {
  return (await drizzleClient().select().from(tag).where(eq(tag.id, id)))[0].content_index_id;
});

const deleteTagAction = server$(async (id: string) => {
  return await drizzleClient().delete(tag).where(eq(tag.id, id)).returning();
});

const addTagAction = server$(async (formData: NewTag) => {
  return await drizzleClient().insert(tag).values(formData).returning();
});

const checkExistingTag = server$(async (slug: string) => {
  return await drizzleClient().select({ id: tag.id }).from(tag).where(eq(tag.slug, slug));
});

const checkExistingTagLink = server$(async (link: string) => {
  return await drizzleClient().select({ id: tag.id }).from(tag).where(eq(tag.link, link));
});

const addTagSchema = z.object({
  name: z.string().min(1, "A name is required").max(35, "Name is too long (max. 35 chars)"),
  slug: z
    .string()
    .min(1, "A slug is required")
    .regex(/^[a-zA-Z]+.*[a-zA-Z ]+$/, "The slug must start and end with characters!")
    .regex(/^[a-zA-Z]+[-a-zA-Z]*[a-zA-Z ]+$/, "No special characters except hyphens are allowed"),
  link: z
    .string()
    .min(1, "A link is required")
    .regex(/^\//, "The link needs to start with a slash")
    .regex(/[a-zA-Z ]+$/, "The link needs to end with a character")
    .regex(
      /^\/[a-zA-Z]+[-?=&/a-zA-Z]*[a-zA-Z ]+$/,
      "No special characters except -?=& are allowed"
    ),
});

export const AddTag = component$(
  ({
    showAddTag,
    tags,
    createdTags,
  }: {
    showAddTag: Signal<boolean>;
    tags: Tag[];
    createdTags: Signal<Tag[]>;
  }) => {
    const formData = useStore<NewTag>({
      id: uuidv4(),
      name: "",
      slug: "",
      link: "/catalog?tag=",
      content_index_id: [],
    });
    const formError = useStore({
      name: "",
      slug: "",
      link: "",
    });
    const ref = useSignal<HTMLInputElement>();
    const ref2 = useSignal<HTMLInputElement>();
    const loading = useSignal(false);

    const handleSubmit = $(async () => {
      loading.value = true;
      formError.name = "";
      formError.slug = "";
      formError.link = "";
      const result = addTagSchema.safeParse(formData);
      if (!result.success) {
        formError.name = result.error.formErrors.fieldErrors.name?.join("\n") || "";
        formError.slug = result.error.formErrors.fieldErrors.slug?.join("\n") || "";
        formError.link = result.error.formErrors.fieldErrors.link?.join("\n") || "";
        loading.value = false;
        return;
      }
      if (
        !formData.link.startsWith("/catalog") &&
        !window.confirm("Are you sure you want to use a custom link?")
      ) {
        loading.value = false;
        return;
      }
      const dup = await checkExistingTag(formData.slug);
      if (
        dup.length > 0 ||
        createdTags.value.filter((tag) => tag.slug === formData.slug).length > 0
      ) {
        formError.slug = "Slug already exists!";
        loading.value = false;
        return;
      }
      const dup2 = await checkExistingTagLink(formData.link);
      if (
        dup2.length > 0 ||
        createdTags.value.filter((tag) => tag.link === formData.link).length > 0
      ) {
        formError.link = "Link already exists!";
        loading.value = false;
        return;
      }
      // const ret = await addTagAction(formData);
      tags.push(formData);
      createdTags.value.push(formData);
      loading.value = false;
      showAddTag.value = false;
    });
    return (
      <div class="absolute left-0 top-0 z-10 flex h-[100vh] w-full items-center justify-center backdrop-blur-sm">
        <div class="relative flex w-[40vw] min-w-[400px] max-w-[600px] flex-col items-center justify-center gap-3 rounded-lg border-2 border-black bg-white py-16 dark:bg-highlight-dark">
          <button
            onClick$={() => (showAddTag.value = false)}
            class="absolute right-5 top-5 block p-1 text-[20px] text-primary-dark-gray dark:text-background-light-gray"
          >
            <LuX />
          </button>
          <h2 class="pb-6 text-center font-mosk text-[2rem] font-bold tracking-wider">Add Tag</h2>
          <div>
            <div>
              <label for="TagName" class="cursor-pointer text-lg">
                Name
              </label>
              <div class="pt-1">
                <input
                  id="TagName"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onInput$={(_, el) => {
                    formData.name = el.value;
                    formData.slug = el.value.toLowerCase().replace(/ /g, "-");
                    formData.link = `/catalog?tag=${formData.slug}`;
                    if (ref.value) ref.value.scrollLeft += 99999;
                    if (ref2.value) ref2.value.scrollLeft += 99999;
                  }}
                  required
                  class={
                    "w-[300px] rounded-md border-2 px-3 py-2 dark:border-background-light-gray  dark:bg-highlight-dark dark:text-background-light-gray dark:disabled:border-black/20 " +
                    (formError.name ? "border-tomato dark:border-tomato" : "border-black/10")
                  }
                />
              </div>
              <p class="w-[300px] whitespace-pre-wrap break-words pt-1 tracking-wide text-tomato">
                {formError.name}
              </p>
            </div>
            <div>
              <label for="TagSlug" class="cursor-pointer text-lg">
                Slug
              </label>
              <div class="pt-1">
                <input
                  ref={ref}
                  id="TagSlug"
                  name="slug"
                  type="text"
                  value={formData.slug}
                  required
                  class={
                    "w-[300px] rounded-md border-2 px-3 py-2 dark:border-background-light-gray  dark:bg-highlight-dark dark:text-background-light-gray dark:disabled:border-black/20 " +
                    (formError.slug ? "border-tomato dark:border-tomato" : "border-black/10")
                  }
                />
              </div>
              <p class="w-[300px] whitespace-pre-wrap break-words pt-1 tracking-wide text-tomato">
                {formError.slug}
              </p>
            </div>
            <div>
              <label for="categorLink" class="cursor-pointer text-lg">
                Link
              </label>
              <div class="pt-1">
                <input
                  ref={ref2}
                  id="categorLink"
                  name="link"
                  type="text"
                  value={formData.link}
                  required
                  class={
                    "w-[300px] rounded-md border-2 px-3 py-2 dark:border-background-light-gray  dark:bg-highlight-dark dark:text-background-light-gray dark:disabled:border-black/20 " +
                    (formError.link ? "border-tomato dark:border-tomato" : "border-black/10")
                  }
                />
              </div>
              <p class="w-[300px] whitespace-pre-wrap break-words pt-1 tracking-wide text-tomato">
                {formError.link}
              </p>
            </div>
            <br />
            <button
              type="button"
              onClick$={handleSubmit}
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
    );
  }
);

export default component$(
  ({
    courseData,
    formSteps,
    createdTags,
  }: {
    courseData: NewContentIndex;
    formSteps: Signal<number>;
    createdTags: Signal<Tag[]>;
  }) => {
    const _tags = useTags().value;
    const tags = useStore(() => _tags);
    const loading = useSignal(false);
    const showAddTag = useSignal(false);

    const handleDeleteTag = $(async (id: string) => {
      // const coursesWithTag = await checkExistingCourseFromTag(id);
      // if (coursesWithTag.length > 0) {
      //   return alert("Course(s) with tag exists! Please remove all courses with this tag first.");
      // }
      // await deleteTagAction(id);
      const index = tags.findIndex((tag) => tag.id === id);
      const index2 = createdTags.value.findIndex((tag) => tag.id === id);
      createdTags.value.splice(index2, 1);
      tags.splice(index, 1);
      // return shouldAlert && alert("Tag deleted successfully.");
    });

    return (
      <div class="relative h-[100vh] w-[80vw]">
        {showAddTag.value && (
          <AddTag createdTags={createdTags} showAddTag={showAddTag} tags={tags} />
        )}
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
                Choose tags (up to 5)
              </h1>
              <br />
              <div class="flex flex-col items-center justify-center space-y-6">
                <button
                  onClick$={() => (showAddTag.value = true)}
                  class="w-[300px] rounded-md bg-primary-dark-gray px-6 py-2 text-background-light-gray"
                >
                  Add New Tag
                </button>
                {tags.length > 0 && (
                  <ul class="flex max-w-[500px] flex-wrap gap-2">
                    {tags.map((tag) => (
                      <li
                        onClick$={() => {
                          if (courseData.tags!.includes(tag.id))
                            courseData.tags!.splice(courseData.tags!.indexOf(tag.id), 1);
                          else if (courseData.tags!.length < 5) courseData.tags!.push(tag.id);
                        }}
                        key={`Tag${tag.id}`}
                        class={
                          "relative cursor-pointer rounded-lg border-2 border-primary-dark-gray bg-background-light-gray px-4 py-3 transition-all hover:bg-primary-dark-gray hover:text-background-light-gray dark:bg-primary-dark-gray dark:hover:bg-background-light-gray dark:hover:text-primary-dark-gray " +
                          (courseData.tags!.includes(tag.id)
                            ? " bg-primary-dark-gray text-background-light-gray  dark:!bg-background-light-gray dark:!text-tomato "
                            : "") +
                          (createdTags.value.find((tag2) => tag2.id === tag.id) && " pr-12")
                        }
                      >
                        <span>{tag.name}</span>
                        {createdTags.value.find((tag2) => tag2.id === tag.id) && (
                          <span
                            onClick$={(e) => {
                              e.stopPropagation();
                              handleDeleteTag(tag.id);
                            }}
                            class="absolute right-[6px] top-[50%] block translate-y-[-50%] rounded-md bg-tomato p-1 text-[15px] text-background-light-gray"
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
                    class="text-base underline decoration-wavy underline-offset-[6px]"
                  >
                    Skip for now
                  </button>
                  <button
                    onClick$={async () => {
                      loading.value = true;
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
          </div>
        </section>
      </div>
    );
  }
);
