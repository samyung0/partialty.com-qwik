import { component$, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

import { IoCaretDown } from "@qwikest/icons/ionicons";
import { LuHome } from "@qwikest/icons/lucide";
import LoadingSVG from "~/components/LoadingSVG";
import NavCourses from "~/components/NavCourses";
import getUser from "~/components/_Index/Nav/getUser";

export { getUser };

export default component$(() => {
  const login = useStore({
    isLoading: true,
    isLoggedIn: false,
    avatarUrl: "",
  });

  useVisibleTask$(async () => {
    const res = await getUser();
    login.isLoading = false;
    if (res) {
      login.isLoggedIn = true;
      login.avatarUrl = res.user.avatar_url;
    }
  });
  return (
    <nav class="absolute left-0 top-0 z-20 flex w-full p-6">
      <div class="w-[50%] pr-[6vw]"></div>
      <ul class="flex w-[50%] items-center gap-6 text-base font-bold tracking-wide">
        <li class="px-2 py-2">
          <Link prefetch href={"/members/dashboard/"} class="flex gap-2">
            Home
            <span class="text-[20px] text-primary-dark-gray">
              <LuHome />
            </span>
          </Link>
        </li>
        <li class="relative px-6 py-2 [&:hover>div]:flex [&:hover_span:last-child]:rotate-180">
          <div class={"flex gap-2"}>
            <span>Courses</span>
            <span
              class={
                "inline-flex items-center text-[16px] text-primary-dark-gray transition-transform"
              }
            >
              <IoCaretDown />
            </span>
          </div>
          <div class="absolute left-[50%] top-[100%] z-[100] hidden w-[600px] -translate-x-[50%] pt-3">
            {NavCourses}
          </div>
        </li>
        <li class="px-2 py-2">
          <Link prefetch href={"/"}>
            Projects
          </Link>
        </li>
        <li class="px-2 py-2">
          <Link prefetch href={"/"}>
            Playground
          </Link>
        </li>
        {login.isLoading ? (
          <span>
            <LoadingSVG />
          </span>
        ) : login.isLoggedIn ? (
          <li>
            <Link prefetch href={"/members/dashboard/"} aria-label="Go to profile">
              <img
                src={login.avatarUrl}
                alt="Avatar"
                width={40}
                height={40}
                class="rounded-full object-contain"
              />
            </Link>
          </li>
        ) : (
          <li class="rounded-lg bg-primary-dark-gray px-4 py-2 font-normal tracking-normal text-background-light-gray shadow-md">
            <Link prefetch href={"/login"} class="whitespace-nowrap">
              Login | Signup
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
});
