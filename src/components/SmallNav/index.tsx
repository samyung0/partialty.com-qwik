import { $, component$, QRL, useContext } from '@builder.io/qwik';
import { Link, removeClientDataCache, server$, useNavigate } from '@builder.io/qwik-city';

import type { LuciaSession } from '~/types/LuciaSession';

import { IoCaretDown } from '@qwikest/icons/ionicons';
import { LuHome, LuLogOut, LuMoon, LuPencilLine, LuShield, LuSun, LuUser2 } from '@qwikest/icons/lucide';
import CrownPNG from '~/assets/img/crown.png';
import { logout } from '~/auth/logout';
import LoadingSVG from '~/components/LoadingSVG';
import theme from '~/const/theme';
import { themeContext } from '~/context/themeContext';

const setThemeCookie = server$(function (theme: 'light' | 'dark') {
  this.cookie.set('theme', theme, {
    path: '/',
    maxAge: [480, 'weeks'],
    httpOnly: false,
    sameSite: 'lax',
    secure: true,
  });
});

export default component$(
  ({
    login,
    setThemeCookieFn,
    logoutFn,
  }: {
    login: { user?: LuciaSession['user'] | undefined; isLoading: boolean; isLoggedIn: boolean };
    setThemeCookieFn?: QRL<(themeValue: (typeof theme)[number]) => any>;
    logoutFn?: QRL<() => any>;
  }) => {
    const nav = useNavigate();
    const theme = useContext(themeContext);
    const handleLogout = $(async () => {
      if (logoutFn) logoutFn();
      else await logout();
      removeClientDataCache();
      nav('/');
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
                    theme.value = 'dark';
                  } else {
                    theme.value = 'light';
                  }
                  if (setThemeCookieFn) setThemeCookieFn(theme.value);
                  else setThemeCookie(theme.value);
                }}
                checked={theme.value.includes('dark')}
                type="checkbox"
                class="peer sr-only"
              ></input>
              <div class="peer-checked:after:border-backgroundbg-background-light-gray peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-background-light-gray after:transition-all after:content-[''] peer-checked:bg-highlight-dark peer-checked:after:translate-x-full peer-focus:outline-none"></div>
              <LuMoon />
            </label>
          </li>
          {login.isLoading && (
            <span class="py-2 pl-6">
              <LoadingSVG />
            </span>
          )}
          {!login.isLoading && login.isLoggedIn && login.user && (
            <li class="relative flex gap-3 py-2 pl-6 [&:hover>div>span:last-child]:rotate-180 [&:hover>div]:flex">
              <div class={'flex gap-2'}>
                <span class="relative">
                  <img
                    src={login.user.avatar_url}
                    alt="Avatar"
                    width={40}
                    height={40}
                    class="rounded-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                  {login.user.role !== 'free' && (
                    <img src={CrownPNG} width={16} height={16} alt="Crown" class="absolute right-[-14px] top-[-14px]" />
                  )}
                </span>
                <span
                  class={
                    'inline-flex items-center text-[16px] text-primary-dark-gray transition-transform dark:text-background-light-gray'
                  }
                >
                  <IoCaretDown />
                </span>
              </div>
              <div class="absolute left-[0] top-[100%] z-10 hidden w-[180px] -translate-x-[50%] pt-2">
                <div class="flex-1 rounded-xl border-2 border-primary-dark-gray bg-background-light-gray text-primary-dark-gray dark:border-black/40 dark:bg-highlight-dark dark:text-background-light-gray ">
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
                      <Link prefetch href="/admin/couseapproval/" class="flex items-center gap-3">
                        <span class="text-[20px]">
                          <LuShield />
                        </span>
                        <span class="whitespace-nowrap">Admin</span>
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
          )}
          {!login.isLoading && !login.isLoggedIn && (
            <Link class="py-2 pl-6" href={'/login/'}>
              Login | Signup
            </Link>
          )}
        </ul>
      </nav>
    );
  }
);
