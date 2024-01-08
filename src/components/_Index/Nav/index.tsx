import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

import ArrowDown from "~/assets/svg/caret-down-outline.svg";

const Courses = (
  <div class="rounded-md border-4 border-primary-dark-gray bg-primary-dark-gray text-background-light-gray">
    <ul class="flex flex-col">
      <li class="flex items-stretch justify-center">
        <div class="w-[30%] pt-12 text-center">The Basics</div>
        <div class="flex w-[70%] items-center bg-background-light-gray p-6 pt-12 text-primary-dark-gray">
          <ul class="flex flex-wrap gap-x-8 gap-y-2">
            <li>
              <Link href={"/"}>HTML</Link>
            </li>
            <li>
              <Link href={"/"}>JS</Link>
            </li>
            <li>
              <Link href={"/"}>CSS</Link>
            </li>
          </ul>
        </div>
      </li>
      <li class="flex items-stretch justify-center">
        <div class="w-[30%] p-6 text-center">Front-end libraries</div>
        <div class="flex w-[70%] items-center bg-background-light-gray p-6 text-primary-dark-gray">
          <ul class="flex flex-wrap gap-x-8 gap-y-2">
            <li>
              <Link href={"/"}>React</Link>
            </li>
            <li>
              <Link href={"/"}>Vue</Link>
            </li>
            <li>
              <Link href={"/"}>Angular</Link>
            </li>
            <li>
              <Link href={"/"}>Solid JS</Link>
            </li>
          </ul>
        </div>
      </li>
      <li class="flex items-stretch justify-center">
        <div class="w-[30%] p-6 text-center">Front-end frameworks</div>
        <div class="flex w-[70%] items-center bg-background-light-gray p-6 text-primary-dark-gray">
          <ul class="flex flex-wrap gap-x-8 gap-y-2">
            <li>
              <Link href={"/"}>Next.js</Link>
            </li>
            <li>
              <Link href={"/"}>Nuxt</Link>
            </li>
            <li>
              <Link href={"/"}>Analog</Link>
            </li>
            <li>
              <Link href={"/"}>Solid Start</Link>
            </li>
            <li>
              <Link href={"/"}>Qwik</Link>
            </li>
            <li>
              <Link href={"/"}>Astro</Link>
            </li>
          </ul>
        </div>
      </li>
      <li class="flex items-stretch justify-center">
        <div class="w-[30%] p-6 pb-12 text-center">Back-ends</div>
        <div class="flex w-[70%] items-center bg-background-light-gray p-6 pb-12 text-primary-dark-gray">
          <ul class="flex flex-wrap gap-x-8 gap-y-2">
            <li>
              <Link href={"/"}>Express</Link>
            </li>
            <li>
              <Link href={"/"}>Fastify</Link>
            </li>
            <li>
              <Link href={"/"}>Hono</Link>
            </li>
            <li>
              <Link href={"/"}>Bun</Link>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
);

const Projects = (
  <div class="rounded-md border-4 border-primary-dark-gray bg-primary-dark-gray text-background-light-gray">
    <ul class="flex flex-col">
      <li class="flex items-stretch justify-center">
        <div class="w-[30%] pt-12 text-center">The Basics</div>
        <div class="flex w-[70%] items-center bg-background-light-gray p-6 pt-12 text-primary-dark-gray">
          <ul class="flex flex-wrap gap-x-8 gap-y-2">
            <li>
              <Link href={"/"}>HTML</Link>
            </li>
            <li>
              <Link href={"/"}>JS</Link>
            </li>
            <li>
              <Link href={"/"}>CSS</Link>
            </li>
          </ul>
        </div>
      </li>
      <li class="flex items-stretch justify-center">
        <div class="w-[30%] p-6 text-center">Front-end libraries</div>
        <div class="flex w-[70%] items-center bg-background-light-gray p-6 text-primary-dark-gray">
          <ul class="flex flex-wrap gap-x-8 gap-y-2">
            <li>
              <Link href={"/"}>React</Link>
            </li>
            <li>
              <Link href={"/"}>Vue</Link>
            </li>
            <li>
              <Link href={"/"}>Angular</Link>
            </li>
            <li>
              <Link href={"/"}>Solid JS</Link>
            </li>
          </ul>
        </div>
      </li>
      <li class="flex items-stretch justify-center">
        <div class="w-[30%] p-6 text-center">Front-end frameworks</div>
        <div class="flex w-[70%] items-center bg-background-light-gray p-6 text-primary-dark-gray">
          <ul class="flex flex-wrap gap-x-8 gap-y-2">
            <li>
              <Link href={"/"}>Next.js</Link>
            </li>
            <li>
              <Link href={"/"}>Nuxt</Link>
            </li>
            <li>
              <Link href={"/"}>Analog</Link>
            </li>
            <li>
              <Link href={"/"}>Solid Start</Link>
            </li>
            <li>
              <Link href={"/"}>Qwik</Link>
            </li>
            <li>
              <Link href={"/"}>Astro</Link>
            </li>
          </ul>
        </div>
      </li>
      <li class="flex items-stretch justify-center">
        <div class="w-[30%] p-6 pb-12 text-center">Back-ends</div>
        <div class="flex w-[70%] items-center bg-background-light-gray p-6 pb-12 text-primary-dark-gray">
          <ul class="flex flex-wrap gap-x-8 gap-y-2">
            <li>
              <Link href={"/"}>Express</Link>
            </li>
            <li>
              <Link href={"/"}>Fastify</Link>
            </li>
            <li>
              <Link href={"/"}>Hono</Link>
            </li>
            <li>
              <Link href={"/"}>Bun</Link>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
);

export default component$(() => {
  return (
    <nav class="absolute right-0 top-0 z-20 p-6 pr-[15vw]">
      <ul class="flex items-center gap-10 text-lg font-bold">
        <li class="relative px-2 py-2 [&:hover>div]:flex [&:hover_img]:rotate-180">
          <Link prefetch href={"/"} class={"flex gap-2"}>
            <span>Courses</span>
            <img
              src={ArrowDown}
              alt="arrowDown"
              width={20}
              height={20}
              class="transition-transform"
            />
          </Link>
          <div class="absolute left-[50%] top-[100%] hidden w-[600px] -translate-x-[50%] pt-3">
            {Courses}
          </div>
        </li>
        <li class="relative px-2 py-2 [&:hover>div]:flex [&:hover_img]:rotate-180">
          <Link prefetch href={"/"} class="flex gap-2">
            <span>Projects</span>
            <img
              src={ArrowDown}
              alt="arrowDown"
              width={20}
              height={20}
              class="transition-transform"
            />
          </Link>
          <div class="absolute left-[50%] top-[100%] hidden w-[600px] -translate-x-[50%] pt-3">
            {Projects}
          </div>
        </li>
        <li class="px-2 py-2">
          <Link prefetch href={"/"}>
            Playground
          </Link>
        </li>
        <li class="px-2 py-2">
          <Link prefetch href={"/"}>
            Pricing
          </Link>
        </li>
        <li class="px-2 py-2">
          <Link prefetch href={"/"}>
            Login
          </Link>
        </li>
      </ul>
    </nav>
  );
});
