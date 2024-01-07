import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <nav class="absolute right-0 top-0 z-20 p-8 pr-[15vw]">
      <ul class="flex items-center gap-10 text-lg font-bold">
        <li>
          <Link prefetch href={"/"}>
            Courses
          </Link>
        </li>
        <li>
          <Link prefetch href={"/"}>
            Playground
          </Link>
        </li>
        <li>
          <Link prefetch href={"/"}>
            Pricing
          </Link>
        </li>
        <li>
          <Link prefetch href={"/"}>
            Login
          </Link>
        </li>
      </ul>
    </nav>
  );
});
