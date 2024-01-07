import { component$, useVisibleTask$ } from "@builder.io/qwik";
import bunApp from "~/_api/bun/util/edenTreaty";
import Hero from "~/components/_Index/hero/index";
import Nav from "~/components/_Index/nav/index";

export default component$(() => {
  useVisibleTask$(() => {
    bunApp.mirror.post({
      id: 123,
      name: "dsadsa"
    })
  })
  // useVisibleTask$(() => {
  //   setTimeout(async () => {
  //     const a = await loadClientData(new URL("http://localhost:5173/login"), null);
  //     console.log(a);
  //   }, 1000);
  // });
  return (
    <main class="min-h-[100vh] bg-background-light-gray">
      <Nav />
      <Hero />
    </main>
  );
});
