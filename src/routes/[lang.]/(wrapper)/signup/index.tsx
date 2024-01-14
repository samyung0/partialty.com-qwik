import { component$, useSignal, useStore } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";

import { useSignupWithPassword } from "~/auth/signup";
import SignupComponent from "~/components/_Signup";
import { useCloudinaryDefaultPic } from "~/routes/[lang.]/(wrapper)/signup/layout";

export default component$(() => {
  const cloudinaryDefaultPics = useCloudinaryDefaultPic();

  const message = useStore<any>({ message: undefined, status: "error" });
  const isLoading = useSignal(false);
  const nav = useNavigate();
  const termsChecked = useSignal(false);
  const signup = useSignupWithPassword();

  // useTask$(({ track }) => {
  //   track(() => signup.status);
  //   if (signup.status === 400)
  //     message.message = Object.values(signup.value?.fieldErrors ?? {})
  //       .flat()
  //       .join("\n");
  //   if (signup.status === 500) message.message = signup.value?.message;
  //   if (signup.status === 200) nav("/members/dashboard/");
  // });

  return <SignupComponent cloudinaryDefaultPics={cloudinaryDefaultPics}></SignupComponent>;
});
