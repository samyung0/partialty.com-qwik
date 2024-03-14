import { $, component$, useContext } from "@builder.io/qwik";
import { Link, removeClientDataCache, server$, useNavigate } from "@builder.io/qwik-city";

import type { LuciaSession } from "~/types/LuciaSession";

import { IoCaretDown } from "@qwikest/icons/ionicons";
import { LuHome, LuLogOut, LuMoon, LuPencilLine, LuSun, LuUser2 } from "@qwikest/icons/lucide";
import CrownPNG from "~/assets/img/crown.png";
import { logout } from "~/auth/logout";
import { themeContext } from "~/context/themeContext";

const setThemeCookie = server$(function (theme: "light" | "dark") {
  this.cookie.set("theme", theme, {
    path: "/",
    maxAge: [7, "days"],
    httpOnly: false,
    sameSite: "lax",
    secure: true,
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
      <ul class="flex items-center gap-6 text-base font-bold tracking-wide">
        <li>
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
        <li class="relative flex gap-3 py-2 pl-6 [&:hover>div>span:last-child]:rotate-180 [&:hover>div]:flex">
          <div class={"flex gap-2"}>
            <span class="relative">
              <img
                src={user.avatar_url}
                alt="Avatar"
                width={30}
                height={30}
                class="rounded-full object-contain"
                referrerPolicy="no-referrer"
              />
              {user.role !== "free" && (
                <img
                  src={CrownPNG}
                  width={16}
                  height={16}
                  alt="Crown"
                  class="absolute right-[-14px] top-[-14px]"
                />
              )}
            </span>
            <span
              class={
                "inline-flex items-center text-[16px] text-primary-dark-gray transition-transform dark:text-background-light-gray"
              }
            >
              <IoCaretDown />
            </span>
          </div>
          <div class="absolute left-[0] top-[100%] z-10 hidden w-[180px] -translate-x-[50%] pt-2">
            <div class="flex-1 rounded-xl border-2 border-primary-dark-gray bg-background-light-gray text-primary-dark-gray dark:border-black/40 dark:bg-primary-dark-gray dark:text-background-light-gray ">
              <ul class="flex flex-col p-2 text-base [&>li]:p-1">
                <li>
                  <Link prefetch href="/members/dashboard/" class="flex items-center gap-3">
                    <span class="text-[20px]">
                      <LuHome />
                    </span>
                    <span class="whitespace-nowrap">Home</span>
                  </Link>
                </li>
                <li>
                  <Link prefetch href="/profile/" class="flex items-center gap-3">
                    <span class="text-[20px]">
                      <LuUser2 />
                    </span>
                    <span class="whitespace-nowrap">My Profile</span>
                  </Link>
                </li>
                <li>
                  <Link prefetch href="/creator/" class="flex items-center gap-3">
                    <span class="text-[20px]">
                      <LuPencilLine />
                    </span>
                    <span class="whitespace-nowrap">Creator</span>
                  </Link>
                </li>
                <li>
                  <button onClick$={handleLogout} class="flex items-center gap-3">
                    <span class="text-[20px]">
                      <LuLogOut />
                    </span>
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
