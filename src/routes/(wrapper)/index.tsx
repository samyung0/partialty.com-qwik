import { component$ } from "@builder.io/qwik";
import { Hero } from "~/components/site/hero/hero";
import { ButtonAction } from "~/components/ui/button-action";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import { Navigation } from "~/components/site/navigation/navigation";
import { Footer } from "~/components/site/footer/footer";

export default component$(() => {
  return (
    <main>
      <Navigation />
      <section>
        <Hero />
        <div class="flex justify-center py-12 w-full">
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
