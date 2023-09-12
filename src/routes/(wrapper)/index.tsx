import { component$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import { Footer } from "~/components/site/footer/footer";
import { Hero } from "~/components/site/hero/hero";
import { Navigation } from "~/components/site/navigation/navigation";
import { ButtonAction } from "~/components/ui/button-action";

import { Speak } from "qwik-speak";

export default component$(() => {
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
  title: "runtime.home.head.title@@Partialty",
  meta: [{ name: "description", content: "runtime.home.head.description@@Quick start" }],
};
