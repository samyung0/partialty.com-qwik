import { component$ } from "@builder.io/qwik";

export default component$(({ innerHTML }: { innerHTML: string }) => {
  return (
    <section
      // SHOULD add a background
      id="sectionProse"
      class="prose mx-auto w-full bg-background-light-gray px-4 py-6 text-base prose-a:decoration-wavy
    prose-a:underline-offset-4 prose-blockquote:pr-[1em]
    prose-strong:tracking-wider
    prose-code:text-[unset]
    prose-pre:bg-code-editor-one-dark-pro
    prose-pre:text-base prose-pre:font-bold prose-img:m-0
    dark:bg-primary-dark-gray
    dark:text-background-light-gray
    md:px-10 md:py-12 lg:text-lg"
      dangerouslySetInnerHTML={innerHTML}
    ></section>
  );
});
