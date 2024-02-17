import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

import SignupComponent from "~/components/_Signup";
import { useCloudinaryDefaultPic } from "~/routes/[lang.]/(wrapper)/signup/layout";

export default component$(() => {
  const cloudinaryDefaultPics = useCloudinaryDefaultPic();

  return <SignupComponent cloudinaryDefaultPics={cloudinaryDefaultPics}></SignupComponent>;
});

export const head: DocumentHead = {
  title: "Signup",
  meta: [
    {
      name: "description",
      content: "Signup Page",
    },
  ],
};
