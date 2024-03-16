import { component$ } from "@builder.io/qwik";

export default component$(({ innerHTML }: { innerHTML: string }) => {
  return (
    <section
      // SHOULD add a background
      id="sectionProse"
      class="prose w-full max-w-[800px] bg-background-light-gray px-6 py-10 text-base prose-a:decoration-wavy
    prose-a:underline-offset-4 prose-blockquote:pr-[1em]
    prose-strong:tracking-wider
    prose-code:text-[unset]
    prose-pre:bg-code-editor-one-dark-pro
    prose-pre:text-base prose-pre:font-bold prose-img:m-0
    dark:bg-primary-dark-gray
    dark:text-background-light-gray
    md:px-10 md:py-12 lg:text-lg 2xl:ml-[10%]"
      dangerouslySetInnerHTML={innerHTML}
    ></section>
  );
});
