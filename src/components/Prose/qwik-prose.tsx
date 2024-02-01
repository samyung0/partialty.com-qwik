import { component$ } from "@builder.io/qwik";

export default component$(({ children }: { children: string }) => {
  return (
    <section
      // SHOULD add a background
      id="sectionProse"
      class="prose mx-auto w-full bg-background-light-gray py-12 text-lg
    prose-a:decoration-wavy prose-a:underline-offset-4
    prose-blockquote:pr-[1em]
    prose-strong:tracking-wider
    prose-code:text-[unset]
    prose-pre:bg-code-editor-one-dark-pro prose-pre:text-base prose-pre:font-bold
    prose-img:m-0"
      dangerouslySetInnerHTML={children}
    ></section>
  );
});
