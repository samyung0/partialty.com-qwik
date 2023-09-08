import { component$, useStylesScoped$ } from "@builder.io/qwik";
import Image from "~/assets/img/icon.png?jsx";
import styles from "./logo.css?inline";

export const Logo = component$(() => {
  useStylesScoped$(styles);

  return (
    <div class="flex items-center justify-start">
      <div class="mr-2 h-12 w-12">
        <Image />
      </div>
      <div>
        <div class="logo-title text-lg text-gray-800">Lorem, ipsum.</div>
        <div class="logo-subtitle -mt-2 text-[10pt] italic text-gray-500">Lorem, ipsum dolor.</div>
      </div>
    </div>
  );
});
