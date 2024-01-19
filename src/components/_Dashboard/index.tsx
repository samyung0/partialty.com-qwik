import { component$ } from "@builder.io/qwik";
import Footer from "~/components/Footer";
import Nav from "~/components/Nav";
import Courses from "~/components/_Dashboard/Courses";
import GettingStarted from "~/components/_Dashboard/GettingStarted";
import type { LuciaSession } from "~/types/LuciaSession";
import Projects from "./Projects";

export default component$(({ user }: { user: LuciaSession["user"] }) => {
  return (
    <section class="min-h-[100vh] bg-light-yellow">
      <Nav user={user} />
      <GettingStarted />
      <Courses />
      <Projects />
      <Footer />
    </section>
  );
});
