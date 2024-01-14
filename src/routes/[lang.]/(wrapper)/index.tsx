import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";

import ContentAudio from "~/components/_Index/ContentAudio";
import ContentInteractive from "~/components/_Index/ContentInteractive";
import ContentVariaties from "~/components/_Index/ContentVarieties";
import Footer from "~/components/_Index/Footer";
import Hero from "~/components/_Index/Hero";
import Nav from "~/components/_Index/Nav";

export default component$(() => {
  const params = useLocation().url.searchParams;

  // eslint-disable-next-line qwik/no-use-visible-task
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
  return (
    <main class="relative min-h-[100vh] bg-background-light-gray">
      <Nav />
      <Hero />
      <ContentVariaties />
      <ContentInteractive />
      <ContentAudio />
      <Footer />
    </main>
  );
});
