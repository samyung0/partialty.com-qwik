import { $, component$ } from "@builder.io/qwik";
import { Link, removeClientDataCache, useNavigate } from "@builder.io/qwik-city";

import ArrowDown from "~/assets/svg/caret-down-outline.svg";
import NavCourses from "~/components/NavCourses";
import type { LuciaSession } from "~/types/LuciaSession";

import LogoutSVG from "~/assets/svg/log-out-outline.svg";
import PersonSVG from "~/assets/svg/person-outline.svg";
import { logout } from "~/auth/logout";

export default component$(({ user }: { user: LuciaSession["user"] }) => {
  const nav = useNavigate();
  const handleLogout = $(async () => {
    await logout();
    removeClientDataCache();
    nav("/");
  });
  return (
    <nav>
      <ul class="m-auto flex w-[80%] items-center gap-6 py-6 text-base font-bold tracking-wide">
        <li class="relative px-6 py-2 pl-0 [&:hover>div]:flex [&:hover_img]:rotate-180">
          <div class={"flex gap-2"}>
            <span>Courses</span>
            <img
              src={ArrowDown}
              alt="arrowDown"
              width={16}
              height={16}
              class="transition-transform"
            />
          </div>
          <div class="absolute left-0 top-[100%] hidden w-[600px] pt-3">{NavCourses}</div>
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
        <li class="px-2 py-2">
          <Link prefetch href={"/"}>
            Pricing
          </Link>
        </li>
        <li class="relative ml-auto px-6 py-2 [&:hover>div>img]:rotate-180 [&:hover>div]:flex">
          <div class={"flex gap-2"}>
            <span>
              <img
                src={user.avatar_url}
                alt="Avatar"
                width={40}
                height={40}
                class="rounded-full object-contain"
                referrerPolicy="no-referrer"
              />
            </span>
            <img
              src={ArrowDown}
              alt="arrowDown"
              width={16}
              height={16}
              class="transition-transform"
            />
          </div>
          <div class="absolute left-[50%] top-[100%] hidden w-[180px] -translate-x-[50%] pt-2">
            <div class="flex-1 rounded-xl border-2 border-primary-dark-gray bg-background-light-gray">
              <ul>
                <li class="p-4">
                  <Link prefetch href="/profile/" class="flex items-center gap-2">
                    <img src={PersonSVG} alt="Profile" width={25} height={25} />
                    <span class="whitespace-nowrap">My Profile</span>
                  </Link>
                </li>
                <div></div>
                <li class="p-4 pt-0">
                  <button onClick$={handleLogout} class="flex items-center gap-2">
                    <img src={LogoutSVG} alt="Profile" width={25} height={25} />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  );
});
