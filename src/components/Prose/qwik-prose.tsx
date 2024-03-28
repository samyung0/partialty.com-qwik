import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { EMBED_URL } from '~/const';

export default component$(({ innerHTML }: { innerHTML: string }) => {
  const interval = useSignal<any>();
  const isDark = useSignal<boolean>(false);
  useVisibleTask$(({ cleanup, track }) => {
    track(() => innerHTML);
    console.log('hydrate embed');
    const darkThemeDiv = document.getElementById('darkThemeDiv');
    if (!darkThemeDiv) return;
    clearInterval(interval.value);
    interval.value = setInterval(() => {
      const dark = darkThemeDiv.className;
      const shouldGoDark = dark === 'dark' && !isDark.value;
      const shouldGoLight = dark !== 'dark' && isDark.value;
      const iframeEmbed = Array.from(document.getElementsByClassName('iframeEmbed'));
      iframeEmbed.forEach((iframe) => {
        const iframeSrc = iframe.getAttribute('src');
        if (iframeSrc && iframeSrc.startsWith(EMBED_URL)) {
          if (shouldGoDark) {
            isDark.value = true;
            const url = new URL(iframeSrc);
            url.searchParams.set('dark', '1');
            (iframe as HTMLIFrameElement).src = url.toString();
          } else if (shouldGoLight) {
            isDark.value = false;
            const url = new URL(iframeSrc);
            url.searchParams.delete('dark');
            (iframe as HTMLIFrameElement).src = url.toString();
          }
        }
      });
    }, 100);
    cleanup(() => {
      clearInterval(interval.value);
      isDark.value = false;
    });
  });
  return (
    <article
      // SHOULD add a background
      id="sectionProse"
      class="prose mx-auto w-[90%] max-w-[unset] bg-background-light-gray px-0 pt-6 text-base prose-a:decoration-wavy prose-a:underline-offset-4 prose-blockquote:pr-[1em]
    prose-strong:tracking-wider prose-code:text-[unset]
    prose-pre:bg-code-editor-one-dark-pro
    prose-pre:font-cascadiaCode
     prose-pre:text-xs prose-pre:leading-5  prose-img:m-0
    dark:bg-primary-dark-gray
    dark:text-background-light-gray dark:prose-figcaption:text-gray-300 md:w-[80%]
    md:pt-12
    lg:w-full
    lg:max-w-[800px] lg:px-10 lg:text-lg lg:prose-pre:text-sm lg:prose-pre:leading-6 2xl:mx-0 2xl:ml-[10%]"
      dangerouslySetInnerHTML={innerHTML}
    ></article>
  );
});
