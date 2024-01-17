import { Link } from "@builder.io/qwik-city";

export default (
  <div class="rounded-md border-4 border-primary-dark-gray bg-primary-dark-gray text-background-light-gray">
    <ul class="flex flex-col">
      <li class="flex items-stretch justify-center">
        <div class="w-[30%] pt-8 text-center">The Basics</div>
        <div class="flex w-[70%] items-center bg-background-light-gray p-4 pl-6 pt-8 text-primary-dark-gray">
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
        <div class="w-[30%] p-4 text-center">Front-end libraries</div>
        <div class="flex w-[70%] items-center bg-background-light-gray p-4 pl-6 text-primary-dark-gray">
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
        <div class="w-[30%] p-4 text-center">Front-end frameworks</div>
        <div class="flex w-[70%] items-center bg-background-light-gray p-4 pl-6 text-primary-dark-gray">
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
        <div class="w-[30%] p-4 text-center">Back-ends</div>
        <div class="flex w-[70%] items-center bg-background-light-gray p-4 pb-8 pl-6 text-primary-dark-gray">
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
      <li class="flex items-stretch justify-end">
        <Link href="/" class="p-3 text-sm">
          View All Courses
        </Link>
      </li>
    </ul>
  </div>
);
