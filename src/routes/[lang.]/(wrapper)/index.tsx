import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";

import UnderConstruction from "~/assets/img/under_construction.png";
import Footer from "~/components/Footer";
import ContentAudio from "~/components/_Index/ContentAudio";
import ContentInteractive from "~/components/_Index/ContentInteractive";
import ContentVarieties from "~/components/_Index/ContentVarieties";
import Hero from "~/components/_Index/Hero";
import Nav from "~/components/_Index/Nav";

export default component$(() => {
  const params = useLocation().url.searchParams;

  useVisibleTask$(() => {
    if (params.get("errMessage")) alert(params.get("errMessage"));
  });

  // useVisibleTask$(() => {
  //   bunApp.mirror.post({
  //     id: 123,
  //     name: "dsadsa"
  //   })
  // })
  // useVisibleTask$(() => {
  //   setTimeout(async () => {
  //     const a = await loadClientData(new URL("http://localhost:5173/login"), null);
  //     console.log(a);
  //   }, 1000);
  // });
  return import.meta.env.MODE === "production" ? (
    <main class="flex h-[100vh] items-center justify-center overflow-hidden">
      <img
        src={UnderConstruction}
        width={500}
        height={500}
        class="hidden h-full w-auto object-contain xl:block"
      />
      <div class="flex h-full w-full items-center justify-center bg-light-yellow xl:hidden">
        <div class="flex flex-col items-center justify-center gap-8 text-center">
          <h1 class="font-mosk text-[3rem]">! Under Construction !</h1>
          <p class="max-w-[500px] text-lg tracking-wide">
            We are building an e-learning platform that teaches web development, such as React, Vue
            and Next JS. The biggest difference is that there will be audio tracks that explain
            everything. Want to know more? Send an email to{" "}
            <a
              href="mailto:yungchinpang999@gmail.com"
              class="underline decoration-wavy underline-offset-[6px]"
            >
              yungchinpang999@gmail.com
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  ) : (
    <main class="relative min-h-[100vh] bg-background-light-gray">
      <Nav />
      <Hero />
      <ContentVarieties />
      <ContentInteractive />
      <ContentAudio />
      <Footer />
    </main>
  );
});
