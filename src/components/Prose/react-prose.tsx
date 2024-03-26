/** @jsxImportSource react */

import { useEffect, useRef } from 'react';
import { EMBED_URL } from '~/const';

const Prose = ({ children, innerHTML }: { children: React.ReactNode; innerHTML?: string }) => {
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
  }, []);
  return innerHTML ? (
    // for preview
    <section
      // SHOULD add a background
      id="sectionProse"
      className="prose mx-auto w-full bg-background-light-gray px-4 py-6 text-base prose-a:decoration-wavy
    prose-a:underline-offset-4 prose-blockquote:pr-[1em]
    prose-strong:tracking-wider
    prose-code:text-[unset]
    prose-pre:bg-code-editor-one-dark-pro prose-pre:font-cascadiaCode prose-pre:text-xs prose-pre:font-bold prose-pre:leading-5
    prose-img:m-0
    dark:bg-primary-dark-gray
    dark:text-background-light-gray md:px-10 md:py-12 lg:text-lg lg:prose-pre:text-sm lg:prose-pre:leading-6
    "
      dangerouslySetInnerHTML={{ __html: innerHTML }}
    ></section>
  ) : (
    <section
      // SHOULD add a background
      className="prose mx-auto h-[80vh] 
  max-h-[80vh] w-full max-w-[unset] overflow-auto bg-background-light-gray px-4 py-6 text-base prose-a:decoration-wavy
  prose-a:underline-offset-4 prose-blockquote:pr-[1em]
  prose-strong:tracking-wider
  prose-code:text-[unset]
  prose-pre:bg-code-editor-one-dark-pro prose-pre:font-cascadiaCode prose-pre:text-xs prose-pre:font-bold prose-pre:leading-5
  prose-img:m-0
  dark:bg-primary-dark-gray
  dark:text-background-light-gray md:px-10 md:py-12 lg:text-lg lg:prose-pre:text-sm lg:prose-pre:leading-6
  "
    >
      {children}
    </section>
  );
};

export default Prose;
