import { $, component$, useContext } from "@builder.io/qwik";
import { Link, removeClientDataCache, server$, useNavigate } from "@builder.io/qwik-city";

import NavCourses from "~/components/NavCourses";
import type { LuciaSession } from "~/types/LuciaSession";

import { IoCaretDown } from "@qwikest/icons/ionicons";
import { LuHome, LuMoon, LuSun } from "@qwikest/icons/lucide";
import CrownPNG from "~/assets/img/crown.png";
import LogoutSVG from "~/assets/svg/log-out-outline.svg";
import PersonSVG from "~/assets/svg/person-outline.svg";
import { logout } from "~/auth/logout";
import { themeContext } from "~/context/themeContext";

const setThemeCookie = server$(function (theme: "light" | "dark") {
  this.cookie.set("theme", theme, {
    path: "/",
  });
});

export default component$(({ user }: { user: LuciaSession["user"] }) => {
  const nav = useNavigate();
  const theme = useContext(themeContext);
  const handleLogout = $(async () => {
    await logout();
    removeClientDataCache();
    nav("/");
  });
  return (
    <nav class="dark:text-background-light-gray">
      <ul class="m-auto flex w-[80%] items-center gap-6 py-6 text-base font-bold tracking-wide">
        <li class="px-2 py-2">
          <Link prefetch href={"/members/dashboard/"} class="flex gap-2">
            Home
            <span class="text-[20px] text-primary-dark-gray dark:text-background-light-gray">
              <LuHome />
            </span>
          </Link>
        </li>
        <li class="relative py-2 [&:hover>div]:flex [&:hover_span:last-child]:rotate-180">
          <div class={"flex gap-2"}>
            <span>Courses</span>
            <span
              class={
                "inline-flex items-center text-[16px] text-primary-dark-gray transition-transform dark:text-background-light-gray"
              }
            >
              <IoCaretDown />
            </span>
          </div>
          <div class="absolute left-0 top-[100%] z-[100] hidden w-[600px] pt-3">{NavCourses}</div>
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
        <li class="ml-auto">
          <label class="flex cursor-pointer items-center gap-2 text-[20px] text-primary-dark-gray dark:text-background-light-gray">
            <LuSun />
            <input
              onChange$={(e, cTarget) => {
                if (cTarget.checked) {
                  theme.value = "dark";
                } else {
                  theme.value = "light";
                }
                setThemeCookie(theme.value);
              }}
              checked={theme.value === "dark"}
              type="checkbox"
              class="peer sr-only"
            ></input>
            <div class="peer-checked:after:border-backgroundbg-background-light-gray peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-background-light-gray after:transition-all after:content-[''] peer-checked:bg-highlight-dark peer-checked:after:translate-x-full peer-focus:outline-none"></div>
            <LuMoon />
          </label>
        </li>
        <li class="relative flex gap-3 px-6 py-2 [&:hover>div>span:last-child]:rotate-180 [&:hover>div]:flex">
          <div class={"flex gap-2"}>
            <span class="relative">
              <img
                src={user.avatar_url}
                alt="Avatar"
                width={40}
                height={40}
                class="rounded-full object-contain"
                referrerPolicy="no-referrer"
              />
              {user.role !== "free" && (
                <img
                  src={CrownPNG}
                  width={20}
                  height={20}
                  alt="Crown"
                  class="absolute right-[-15px] top-[-15px]"
                />
              )}
            </span>
            <span
              class={
                "inline-flex items-center text-[16px] text-primary-dark-gray transition-transform"
              }
            >
              <IoCaretDown />
            </span>
          </div>
          <div class="absolute left-[50%] top-[100%] hidden w-[180px] -translate-x-[50%] pt-2">
            <div class="flex-1 rounded-xl border-2 border-primary-dark-gray bg-background-light-gray text-primary-dark-gray dark:border-black">
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
