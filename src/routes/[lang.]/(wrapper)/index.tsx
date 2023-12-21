import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
// import { Speak } from "qwik-speak";
import { Footer } from "~/components/site/footer/footer";
import { Hero } from "~/components/site/hero/hero";
import { Navigation } from "~/components/site/navigation/navigation";
import { ButtonAction } from "~/components/ui/button-action";

export default component$(() => {
  // useVisibleTask$(() => {
  //   setTimeout(async () => {
  //     const a = await loadClientData(new URL("http://localhost:5173/login"), null);
  //     console.log(a);
  //   }, 1000);
  // });
  return (
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
  );
});
