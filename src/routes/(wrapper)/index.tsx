import { component$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import { Speak } from "qwik-speak";
import { Footer } from "~/components/site/footer/footer";
import { Hero } from "~/components/site/hero/hero";
import { Navigation } from "~/components/site/navigation/navigation";
import { ButtonAction } from "~/components/ui/button-action";

export default component$(() => {
  // useVisibleTask$(() => {
  //   fetch('https://api.github.com/repos/samyung0/Template_react_1/git/trees/main?recursive=1').then(x => x.json()).then(x => {
  //     console.log(x);
  //   })
  // })
  return (
    <Speak assets={["main"]}>
      <main>
        <Navigation />
        <section>
          <Hero />
          <div class="flex w-full justify-center py-12">
            <Link href="/members/dashboard">
              <ButtonAction label="Dashboard" />
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    </Speak>
  );
});

export const head: DocumentHead = {
  title: "runtime.head.title@@Partialty",
  meta: [{ name: "description", content: "runtime.head.description@@Quick start" }],
};
