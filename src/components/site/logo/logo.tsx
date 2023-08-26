import { component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from "./logo.css?inline";
import Image from "~/assets/img/icon.png?jsx";

export const Logo = component$(() => {
  useStylesScoped$(styles);

  return (
    <div class="flex justify-start items-center">
      <div class="w-12 h-12 mr-2">
        <Image />
      </div>
      <div>
        <div class="text-lg logo-title text-gray-800">Lorem, ipsum.</div>
        <div class="-mt-2 text-[10pt] logo-subtitle text-gray-500 italic">
          Lorem, ipsum dolor.
        </div>
      </div>
    </div>
  );
});
