import { $, component$, PropFunction, useContext, useSignal, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { Link, removeClientDataCache, server$, useNavigate } from '@builder.io/qwik-city';

import type { LuciaSession } from '~/types/LuciaSession';

import {
  LuAlignJustify,
  LuFileText,
  LuHome,
  LuLogOut,
  LuMoon,
  LuPencilLine,
  LuShield,
  LuSun,
  LuUser2,
  LuX,
} from '@qwikest/icons/lucide';
import { logout } from '~/auth/logout';
import { themeContext } from '~/context/themeContext';

import { IoCaretDown } from '@qwikest/icons/ionicons';
import CrownPNG from '~/assets/img/crown.png';

import getUser from '~/components/_Index/Nav/getUser';
import LoadingSVG from '~/components/LoadingSVG';

export { getUser };

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
  (props: {
    user?: LuciaSession['user'] | undefined;
    disableTheme?: true;
    getUserFn?: PropFunction<() => any>;
    setThemeCookieFn?: PropFunction<(themeValue: any) => any>;
    logoutFn?: PropFunction<() => any>;
  }) => {
    const nav = useNavigate();
    const theme = useContext(themeContext);
    const showSideNav = useSignal(false);
    const handleLogout = $(async () => {
      if (props.logoutFn) await props.logoutFn();
      else await logout();
      removeClientDataCache();
      nav('/');
    });
    const login = useStore({
      isLoading: props.user === undefined,
      isLoggedIn: props.user !== undefined,
      user: props.user,
    });
    useVisibleTask$(async () => {
      if (login.isLoggedIn) return;
      const res = props.getUserFn ? await props.getUserFn() : await getUser();
      login.isLoading = false;
      if (res) {
        login.isLoggedIn = true;
        login.user = res.user;
      }
    });
    return (
      <>
        {showSideNav.value && (
          <nav
            class="fixed left-0 top-0 z-[9999] flex h-[100vh] w-[100vw] justify-start backdrop-blur-md lg:hidden"
            onClick$={() => {
              showSideNav.value = false;
            }}
          >
            <button
              onClick$={() => (showSideNav.value = false)}
              class={
                'absolute right-5 top-5 text-[20px] text-primary-dark-gray ' +
                (!props.disableTheme ? ' dark:text-background-light-gray' : '')
              }
            >
              <LuX />
            </button>
            <div
              class={
                'w-[80%] overflow-auto border-r-2 border-primary-dark-gray bg-background-light-gray ' +
                (!props.disableTheme ? ' dark:border-gray-300 dark:bg-primary-dark-gray' : '')
              }
              onClick$={(e) => e.stopPropagation()}
            >
              <ul class="mx-auto flex w-[90%] flex-col gap-6 py-6">
                <li class="flex items-center gap-6">
                  {!props.disableTheme && (
                    <label class="flex cursor-pointer items-center gap-2 text-[20px] text-primary-dark-gray dark:text-background-light-gray">
                      <LuSun />
                      <input
                        onChange$={(e, cTarget) => {
                          if (cTarget.checked) {
                            theme.value = 'dark';
                          } else {
                            theme.value = 'light';
                          }
                          if (props.setThemeCookieFn) props.setThemeCookieFn(theme.value);
                          else setThemeCookie(theme.value);
                        }}
                        checked={theme.value.includes('dark')}
                        type="checkbox"
                        class="peer sr-only"
                      ></input>
                      <div class="peer-checked:after:border-backgroundbg-background-light-gray peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-background-light-gray after:transition-all after:content-[''] peer-checked:bg-highlight-dark peer-checked:after:translate-x-full peer-focus:outline-none"></div>
                      <LuMoon />
                    </label>
                  )}
                  {login.isLoading ? (
                    <span>
                      <LoadingSVG />
                    </span>
                  ) : login.isLoggedIn && login.user ? (
                    <div
                      class={
                        ' flex -translate-x-[8px] gap-2 sm:translate-x-0' + (!props.disableTheme ? ' ml-auto' : '')
                      }
                    >
                      <span class="relative">
                        <img
                          src={login.user.avatar_url}
                          alt="Avatar"
                          width={35}
                          height={35}
                          class="rounded-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                        {login.user.role !== 'free' && (
                          <img
                            src={CrownPNG}
                            width={15}
                            height={15}
                            alt="Crown"
                            class="absolute right-[-12px] top-[-12px]"
                          />
                        )}
                      </span>
                    </div>
                  ) : (
                    <span>
                      <Link prefetch href={'/login'} class="whitespace-nowrap">
                        Login | Signup
                      </Link>
                    </span>
                  )}
                </li>
                <li>
                  <Link
                    prefetch
                    href={login.isLoggedIn ? '/members/dashboard/' : '/login/'}
                    class="flex items-center gap-4"
                  >
                    Home
                    <span
                      class={
                        'text-[20px] text-primary-dark-gray' +
                        (!props.disableTheme ? '  dark:text-background-light-gray' : '')
                      }
                    >
                      <LuHome />
                    </span>
                  </Link>
                </li>
                <li>
                  <Link prefetch href={'/catalog/'} class="flex items-center gap-4">
                    Courses
                    <span
                      class={
                        'text-[20px] text-primary-dark-gray' +
                        (!props.disableTheme ? '  dark:text-background-light-gray' : '')
                      }
                    >
                      <LuFileText />
                    </span>
                  </Link>
                </li>
                {/* <li>
                <Link prefetch href={'/catalog/?type=project'} class="flex items-center gap-4">
                  Projects
                  <span
                    class={
                      'text-[20px] text-primary-dark-gray' +
                      (!props.disableTheme ? '  dark:text-background-light-gray' : '')
                    }
                  >
                    <LuFile />
                  </span>
                </Link>
              </li>
              <li>
                <Link prefetch href={'/members/dashboard/'} class="flex items-center gap-4">
                  Playground
                  <span
                    class={
                      'text-[20px] text-primary-dark-gray' +
                      (!props.disableTheme ? '  dark:text-background-light-gray' : '')
                    }
                  >
                    <LuFileTerminal />
                  </span>
                </Link>
              </li> */}
                {login.isLoggedIn && login.user && (
                  <>
                    <div class="flex w-[100%] justify-center">
                      <div class="h-[2px] w-[100%] bg-gray-300">&nbsp;</div>
                    </div>
                    <li>
                      <Link prefetch href="/profile/" class="flex items-center gap-4">
                        <span class="whitespace-nowrap">My Profile</span>
                        <span class="text-[20px]">
                          <LuUser2 />
                        </span>
                      </Link>
                    </li>
                    {login.user.role !== 'free' && (
                      <li>
                        <Link prefetch href="/creator/" class="flex items-center gap-4">
                          <span class="whitespace-nowrap">Creator</span>
                          <span class="text-[20px]">
                            <LuPencilLine />
                          </span>
                        </Link>
                      </li>
                    )}
                    {login.user.role === 'admin' && (
                      <li>
                        <Link prefetch href="/admin/courseapproval/" class="flex items-center gap-4">
                          <span class="whitespace-nowrap">Admin</span>
                          <span class="text-[20px]">
                            <LuShield />
                          </span>
                        </Link>
                      </li>
                    )}
                    <li>
                      <button onClick$={handleLogout} class="flex items-center gap-4">
                        <span>Logout</span>
                        <span class="text-[20px]">
                          <LuLogOut />
                        </span>
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </nav>
        )}
        <nav class={!props.disableTheme ? 'dark:text-background-light-gray' : ''}>
          <div class=" mx-auto flex max-w-7xl items-center justify-between px-4 py-6 text-[25px] sm:px-6 lg:hidden lg:px-8">
            <h1 class="font-mosk text-3xl font-bold tracking-wide">
              <Link href="/members/dashboard/">Partialty.com</Link>
            </h1>
            <button
              class={'p-2 text-primary-dark-gray' + (!props.disableTheme ? ' dark:text-background-light-gray' : '')}
              onClick$={() => (showSideNav.value = !showSideNav.value)}
            >
              <LuAlignJustify />
            </button>
          </div>
          <ul class="mx-auto hidden max-w-7xl items-center gap-6 px-4 py-6 text-base font-bold tracking-wide sm:px-6 lg:flex lg:px-8">
            <li class="px-2 py-2">
              <Link prefetch href={login.isLoggedIn ? '/members/dashboard/' : '/login/'} class="flex gap-2">
                Home
                <span
                  class={
                    'text-[20px] text-primary-dark-gray' +
                    (!props.disableTheme ? '  dark:text-background-light-gray' : '')
                  }
                >
                  <LuHome />
                </span>
              </Link>
            </li>
            <li class="relative py-2">
              <Link prefetch href={'/catalog/'} class={'flex gap-2'}>
                <span>Courses</span>
                {/* <span
                  class={
                    "inline-flex items-center text-[16px] text-primary-dark-gray transition-transform " +
                    (!props.disableTheme ? " dark:text-background-light-gray" : "")
                  }
                >
                  <IoCaretDown />
                </span> */}
              </Link>
              {/* <div class="absolute left-0 top-[100%] z-[100] hidden w-[600px] pt-3">
                {NavCourses}
              </div> */}
            </li>
            {/* <li class="px-2 py-2">
            <Link prefetch href={'/catalog/?type=project'}>
              Projects
            </Link>
          </li>
          <li class="px-2 py-2">
            <Link prefetch href={'/'}>
              Playground
            </Link>
          </li> */}
            {!props.disableTheme && (
              <li class="ml-auto">
                <label class="flex cursor-pointer items-center gap-2 text-[20px] text-primary-dark-gray dark:text-background-light-gray">
                  <LuSun />
                  <input
                    onChange$={(e, cTarget) => {
                      if (cTarget.checked) {
                        theme.value = 'dark';
                      } else {
                        theme.value = 'light';
                      }
                      if (props.setThemeCookieFn) props.setThemeCookieFn(theme.value);
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
            )}
            {login.isLoading ? (
              <span class={props.disableTheme ? 'ml-auto  ' : ''}>
                <LoadingSVG />
              </span>
            ) : login.isLoggedIn && login.user ? (
              <li
                class={
                  (props.disableTheme ? 'ml-auto  ' : '') +
                  'relative flex gap-3 px-6 py-2 [&:hover>div>span:last-child]:rotate-180 [&:hover>div]:flex'
                }
              >
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
                      'inline-flex items-center text-[16px] text-primary-dark-gray transition-transform ' +
                      (!props.disableTheme ? ' dark:text-background-light-gray' : '')
                    }
                  >
                    <IoCaretDown />
                  </span>
                </div>
                <div class="absolute left-[30%] top-[100%] z-[50] hidden w-[180px] -translate-x-[50%] pt-2 2xl:left-[50%]">
                  <div
                    class={
                      'flex-1 rounded-xl border-2 border-primary-dark-gray bg-background-light-gray text-primary-dark-gray ' +
                      (!props.disableTheme
                        ? ' dark:border-disabled-dark dark:bg-highlight-dark dark:text-background-light-gray'
                        : '')
                    }
                  >
                    <ul class="flex flex-col p-2 [&>li]:p-2">
                      <li>
                        <Link
                          prefetch
                          href={login.isLoggedIn ? '/members/dashboard/' : '/login/'}
                          class="flex items-center gap-3"
                        >
                          <span class="text-[25px]">
                            <LuHome />
                          </span>
                          <span class="whitespace-nowrap  ">Home</span>
                        </Link>
                      </li>
                      <li>
                        <Link prefetch href="/profile/" class="flex items-center gap-3">
                          <span class="text-[25px]">
                            <LuUser2 />
                          </span>
                          <span class="whitespace-nowrap">My Profile</span>
                        </Link>
                      </li>
                      {login.user.role !== 'free' && (
                        <li>
                          <Link prefetch href="/creator/" class="flex items-center gap-3">
                            <span class="text-[25px]">
                              <LuPencilLine />
                            </span>
                            <span class="whitespace-nowrap">Creator</span>
                          </Link>
                        </li>
                      )}
                      {login.user.role === 'admin' && (
                        <li>
                          <Link prefetch href="/admin/courseapproval/" class="flex items-center gap-3">
                            <span class="text-[25px]">
                              <LuShield />
                            </span>
                            <span class="whitespace-nowrap">Admin</span>
                          </Link>
                        </li>
                      )}
                      <li>
                        <button onClick$={handleLogout} class="flex items-center gap-3">
                          <span class="text-[25px]">
                            <LuLogOut />
                          </span>
                          <span>Logout</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
            ) : (
              <li
                class={
                  (props.disableTheme ? 'ml-auto ' : '') +
                  ''
                }
              >
                <Link prefetch href={'/login'} class="whitespace-nowrap rounded-lg bg-disabled-dark px-4 py-3 font-normal tracking-normal text-background-light-gray shadow-md">
                  Login | Signup
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </>
    );
  }
);
