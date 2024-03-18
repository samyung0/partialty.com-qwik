import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { EMBED_URL } from "~/const";

export default component$(({ innerHTML }: { innerHTML: string }) => {
  const interval = useSignal<any>();
  const isDark = useSignal<boolean>(false);
  useVisibleTask$(() => {
    const iframeEmbed = Array.from(document.getElementsByClassName("iframeEmbed"));
    const darkThemeDiv = document.getElementById("darkThemeDiv");
    if (!darkThemeDiv) return;
    iframeEmbed.forEach((iframe) => {
      const iframeSrc = iframe.getAttribute("src");
      if (iframeSrc && iframeSrc.startsWith(EMBED_URL)) {
        interval.value = setInterval(() => {
          const dark = darkThemeDiv.className;
          if (dark === "dark" && !isDark.value) {
            isDark.value = true;
            const url = new URL(iframeSrc);
            url.searchParams.set("dark", "1");
            (iframe as HTMLIFrameElement).src = url.toString();
          } else if (dark !== "dark" && isDark.value) {
            isDark.value = false;
            const url = new URL(iframeSrc);
            url.searchParams.delete("dark");
            (iframe as HTMLIFrameElement).src = url.toString();
          }
        }, 100);
      }
    });
  });
  return (
    <>
      <section
        // SHOULD add a background
        id="sectionProse"
        class="prose mx-auto w-[90%] max-w-[unset] bg-background-light-gray px-0 pt-6 text-base prose-a:decoration-wavy prose-a:underline-offset-4 prose-blockquote:pr-[1em]
    prose-strong:tracking-wider prose-code:text-[unset]
    prose-pre:bg-code-editor-one-dark-pro
    prose-pre:text-base
    prose-pre:font-bold
    prose-img:m-0 dark:bg-primary-dark-gray dark:text-background-light-gray
    md:w-[80%]
    md:pt-12
    lg:w-full lg:max-w-[800px] lg:px-10 lg:text-lg 2xl:mx-0 2xl:ml-[10%]"
        dangerouslySetInnerHTML={innerHTML}
      ></section>
    </>
  );
});
