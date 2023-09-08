import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { ButtonStd } from "~/components/ui/button-std";

export const Hero = component$(() => {
  return (
    <section class="w-full bg-gradient-to-br from-gray-900 to-sky-900 py-24 shadow-xl">
      <div class="flex h-full w-full flex-col items-center justify-center">
        <div class="font-sans text-4xl font-extrabold tracking-tighter text-white md:text-5xl lg:text-7xl">
          Lorem, ipsum dolor.
        </div>
        <div class="relative flex justify-center font-sans text-5xl font-extrabold tracking-tight text-white md:text-6xl lg:text-8xl">
          <div class="text-green-500 ">Lorem, ipsum dolor.</div>
        </div>
        <div class="mt-24 text-xl font-light italic text-slate-300">Lorem, ipsum.</div>
        <div class="itali mt-24 text-xl italic text-white">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nisi, maiores?
        </div>
        <Link href="/signup">
          <ButtonStd
            title="Join"
            classText="bg-sky-500 hover:bg-sky-400 mt-5 shadow-xl hover:shadow-none"
          />
        </Link>
      </div>
    </section>
  );
});
