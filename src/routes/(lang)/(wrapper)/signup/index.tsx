import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

import SignupComponent from "~/components/_Signup";
import { getCloudinaryDefaultPic } from "~/routes/(lang)/(wrapper)/signup/layout";
import type { CloudinaryDefaultPic } from "~/types/Cloudinary";
export { getCloudinaryDefaultPic };

export default component$(() => {
  const cloudinaryDefaultPics = useSignal<CloudinaryDefaultPic[] | null>();

  useVisibleTask$(async () => {
    cloudinaryDefaultPics.value = await getCloudinaryDefaultPic();
  });

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
