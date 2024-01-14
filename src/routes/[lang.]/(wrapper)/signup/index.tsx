import { component$ } from "@builder.io/qwik";

import SignupComponent from "~/components/_Signup";
import { useCloudinaryDefaultPic } from "~/routes/[lang.]/(wrapper)/signup/layout";

export default component$(() => {
  const cloudinaryDefaultPics = useCloudinaryDefaultPic();

  return <SignupComponent cloudinaryDefaultPics={cloudinaryDefaultPics}></SignupComponent>;
});
