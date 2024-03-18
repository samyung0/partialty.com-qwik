/** @jsxImportSource react */

import { qwikify$ } from "@builder.io/qwik-react";
import { useEffect, useRef } from "react";
import { EMBED_URL } from "~/const";

export const EmbedHydrate = () => {
  const interval = useRef<any>();
  const isDark = useRef<boolean>(false);
  useEffect(() => {
    console.log("hydrate embed");
    const iframeEmbed = Array.from(document.getElementsByClassName("iframeEmbed"));
    const darkThemeDiv = document.getElementById("darkThemeDiv");
    if (!darkThemeDiv) return;
    iframeEmbed.forEach((iframe) => {
      const iframeSrc = iframe.getAttribute("src");
      if (iframeSrc && iframeSrc.startsWith(EMBED_URL)) {
        interval.current = setInterval(() => {
          const dark = darkThemeDiv.className;
          if (dark === "dark" && !isDark.current) {
            isDark.current = true;
            const url = new URL(iframeSrc);
            url.searchParams.set("dark", "1");
            (iframe as HTMLIFrameElement).src = url.toString();
          } else if (dark !== "dark" && isDark.current) {
            isDark.current = false;
            const url = new URL(iframeSrc);
            url.searchParams.delete("dark");
            (iframe as HTMLIFrameElement).src = url.toString();
          }
        }, 100);
      }
    });
  }, []);
  return null;
};

export default EmbedHydrate;
export const QwikEmbedHydrate = qwikify$(EmbedHydrate);
