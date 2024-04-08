/** @jsxImportSource react */

import { useEffect, useRef } from 'react';
import { EMBED_URL } from '~/const';

const Prose = ({
  chapter,
  children,
  innerHTML,
}: {
  chapter: string;
  children: React.ReactNode;
  innerHTML?: string;
}) => {
  const interval = useRef<any>();
  const isDark = useRef<boolean>(false);
  useEffect(() => {
    console.log('hydrate embed');
    const darkThemeDiv = document.getElementById('darkThemeDiv');
    if (!darkThemeDiv) return;
    clearInterval(interval.current);
    interval.current = setInterval(() => {
      const dark = darkThemeDiv.className;
      const shouldGoDark = dark === 'dark' && !isDark.current;
      const shouldGoLight = dark !== 'dark' && isDark.current;
      const iframeEmbed = Array.from(document.getElementsByClassName('iframeEmbed'));
      iframeEmbed.forEach((iframe) => {
        const iframeSrc = iframe.getAttribute('src');
        if (iframeSrc && iframeSrc.startsWith(EMBED_URL)) {
          if (shouldGoDark) {
            isDark.current = true;
            const url = new URL(iframeSrc);
            url.searchParams.set('dark', '1');
            (iframe as HTMLIFrameElement).src = url.toString();
          } else if (shouldGoLight) {
            isDark.current = false;
            const url = new URL(iframeSrc);
            url.searchParams.delete('dark');
            (iframe as HTMLIFrameElement).src = url.toString();
          }
        }
      });
    }, 100);
    return () => {
      clearInterval(interval.current);
      isDark.current = false;
    };
  }, [chapter]);
  return innerHTML ? (
    // for preview
    <article
      // SHOULD add a background
      id="sectionProse"
      className="prose mx-auto w-[90%] max-w-[unset] bg-background-light-gray px-4 py-6 text-sm
    leading-6 prose-a:underline
    prose-a:underline-offset-4
    prose-blockquote:pr-[1em] prose-figcaption:mt-0 prose-figcaption:text-xs prose-figcaption:italic
    prose-strong:tracking-wider
    prose-pre:bg-code-editor-one-dark-pro prose-pre:font-cascadiaCode prose-pre:text-sm  prose-pre:leading-5
    prose-img:m-0
    dark:bg-primary-dark-gray
    dark:text-background-light-gray dark:prose-figcaption:text-gray-300 md:px-10 md:py-12 lg:text-base lg:leading-7 lg:prose-figcaption:text-sm lg:prose-pre:text-base lg:prose-pre:leading-6 [&_code:not(pre_code)]:rounded-md [&_code:not(pre_code)]:bg-gray-300/70 [&_code:not(pre_code)]:p-[2px] [&_code:not(pre_code)]:text-[unset]  [&_code:not(pre_code)]:before:content-none [&_code:not(pre_code)]:after:content-none dark:[&_code:not(pre_code)]:bg-gray-600/70
    "
      dangerouslySetInnerHTML={{ __html: innerHTML }}
    ></article>
  ) : (
    <section
      // SHOULD add a background
      className="prose mx-auto h-[80vh]
  max-h-[80vh] w-full max-w-[unset] overflow-auto bg-background-light-gray px-4 py-6 text-sm leading-6 prose-a:underline
  prose-a:underline-offset-4 prose-blockquote:pr-[1em]
  prose-figcaption:mt-0
  prose-figcaption:text-xs prose-figcaption:italic prose-strong:tracking-wider prose-pre:bg-code-editor-one-dark-pro
  prose-pre:font-cascadiaCode
  prose-pre:text-sm prose-pre:leading-5 prose-img:m-0  dark:bg-primary-dark-gray dark:text-background-light-gray dark:prose-figcaption:text-gray-300
  md:px-10
  md:py-12
  lg:text-base lg:leading-7 lg:prose-figcaption:text-sm lg:prose-pre:text-base lg:prose-pre:leading-6 [&_code:not(pre_code)]:rounded-md [&_code:not(pre_code)]:bg-gray-300/70 [&_code:not(pre_code)]:p-[2px] [&_code:not(pre_code)]:text-[unset]  [&_code:not(pre_code)]:before:content-none [&_code:not(pre_code)]:after:content-none dark:[&_code:not(pre_code)]:bg-gray-600/70
  "
    >
      {children}
    </section>
  );
};

export default Prose;
