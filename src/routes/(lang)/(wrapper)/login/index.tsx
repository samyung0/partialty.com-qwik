import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

import LoginComponent from "~/components/_Login";

export default component$(() => {
  return <LoginComponent></LoginComponent>;
});

export const head: DocumentHead = {
  title: "Login",
  meta: [
    {
      name: "description",
      content: "Login Page.",
    },
  ],
};
