import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { Link, loadClientData, type DocumentHead } from "@builder.io/qwik-city";
import { Speak } from "qwik-speak";
import { Footer } from "~/components/site/footer/footer";
import { Hero } from "~/components/site/hero/hero";
import { Navigation } from "~/components/site/navigation/navigation";
import { ButtonAction } from "~/components/ui/button-action";

export default component$(() => {
  useVisibleTask$(() => {
    setTimeout(async () => {
      const a = await loadClientData(new URL("http://localhost:5173/login"), null);
      console.log(a);
    }, 1000);
  });
  return (
    <Speak assets={["main"]}>
      <main>
        <Navigation />
        <section>
          <Hero />
          <div class="flex w-full justify-center py-12">
            <Link prefetch href="/members/dashboard">
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
