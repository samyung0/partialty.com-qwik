import { component$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import { Footer } from "~/components/site/footer/footer";
import { Hero } from "~/components/site/hero/hero";
import { Navigation } from "~/components/site/navigation/navigation";
import { ButtonAction } from "~/components/ui/button-action";

export default component$(() => {
  return (
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
  );
});

export const head: DocumentHead = {
  title: "Qwik Demo App",
  meta: [
    {
      name: "description",
      content: "Demo Qwik app made with qwik, supabase, tailwind, vite.",
    },
  ],
};
