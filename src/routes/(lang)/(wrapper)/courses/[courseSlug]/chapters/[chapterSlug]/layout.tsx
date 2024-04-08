import {
  $,
  Slot,
  component$,
  createContextId,
  useContext,
  useContextProvider,
  useOnDocument,
  useSignal,
  useStore,
  useVisibleTask$,
} from '@builder.io/qwik';
import { Link, removeClientDataCache, routeLoader$, useLocation, useNavigate } from '@builder.io/qwik-city';
import { eq } from 'drizzle-orm';
import SmallNav from '~/components/SmallNav';
import { useCourseLoader, useUserLoaderNullable } from '~/routes/(lang)/(wrapper)/courses/[courseSlug]/layout';
import drizzleClient from '~/utils/drizzleClient';
import type { Content } from '../../../../../../../../drizzle_turso/schema/content';
import { content } from '../../../../../../../../drizzle_turso/schema/content';

import {
  LuAlignJustify,
  LuArrowRight,
  LuCheck,
  LuFileText,
  LuGem,
  LuGoal,
  LuHome,
  LuLogOut,
  LuMoon,
  LuPencilLine,
  LuShield,
  LuSun,
  LuUser2,
  LuX,
} from '@qwikest/icons/lucide';
import CrownPNG from '~/assets/img/crown.png';
import Checkbox from '~/components/_Courses/Chapter/checkbox';
import { themeContext } from '~/context/themeContext';
import { cn } from '~/utils/cn';

export const useCurrentChapter = routeLoader$(async (event) => {
  const _user = await event.resolveValue(useUserLoaderNullable);
  const { course, chapters } = await event.resolveValue(useCourseLoader);
  const currentChapterSlug = event.params.chapterSlug;

  const currentChapterFiltered = chapters.find((c) => c.slug === currentChapterSlug);
  if (!currentChapterFiltered) throw event.redirect(302, '/notfound/');

  if (course.content_index.is_premium && !_user) throw event.redirect(302, '/login/');
  if (currentChapterFiltered.is_premium && !_user) throw event.redirect(302, '/login/');

  const ret: { subscriptionNeeded: boolean; loaded: boolean; currentChapter: Content | null } = {
    subscriptionNeeded: false,
    loaded: false,
    currentChapter: null,
  };

  if ((course.content_index.is_premium || currentChapterFiltered.is_premium) && _user && _user.role === 'free')
    ret.subscriptionNeeded = true;
  else {
    const chapter = (
      await drizzleClient(event.env, import.meta.env.VITE_USE_PROD_DB === '1')
        .select()
        .from(content)
        .where(eq(content.id, currentChapterFiltered.id))
    )[0];
    if (!chapter) throw event.redirect(302, '/notfound/');
    ret.currentChapter = chapter;
    ret.loaded = true;
  }

  return ret;
});

// export const useDBLoader = routeLoader$(async (event) => {
//   const _user = await event.resolveValue(useUserLoaderNullable);
//   const { course, chapters } = await event.resolveValue(useCourseLoader);
//   const { subscriptionNeeded, loaded, currentChapter } = await event.resolveValue(useCurrentChapter);
//   if (!loaded || !currentChapter || !_user) return;
//   let newUserProgress: ContentUserProgress | null = course.content_user_progress;
//   if (!course.content_user_progress)
//     newUserProgress = (
//       await drizzleClient(event.env, import.meta.env.VITE_USE_PROD_DB === '1')
//         .insert(content_user_progress)
//         .values({
//           id: v4(),
//           user_id: _user.userId,
//           index_id: course.content_index.id,
//           progress: [],
//         })
//         .returning()
//     )[0];
//   return newUserProgress;
// });

// const setThemeCookie = server$(function (theme: 'light' | 'dark') {
//   this.cookie.set('theme', theme, {
//     path: '/',
//     maxAge: [7, 'days'],
//     httpOnly: false,
//     sameSite: 'lax',
//     secure: true,
//   });
// });

const setThemeCookie = $(async (themeValue: (typeof theme)[number]) => {
  const d = new FormData();
  d.append('theme', themeValue);
  return await fetch('/api/courses/chapters/setThemeCookie/', {
    method: 'POST',
    body: d,
    // headers: {
    //   'Content-Type': 'application/json',
    // },
  }).then((x) => x.json());
});

// const setShowAllHighlightsCookie = server$(function (value: boolean) {
//   this.cookie.set('showAllHighlights', value.toString(), {
//     path: '/',
//     maxAge: [7, 'days'],
//     httpOnly: false,
//     sameSite: 'lax',
//     secure: true,
//   });
// });

const setShowAllHighlightsCookie = $(async (value: boolean) => {
  const d = new FormData();
  d.append('value', value.toString());
  return await fetch('/api/courses/chapters/setShowAudioHighlightsCookie/', {
    method: 'POST',
    body: d,
    // headers: {
    //   'Content-Type': 'application/json',
    // },
  }).then((x) => x.json());
});

// const getShowAudioHighlightsCookie = server$(function () {
//   return this.cookie.get('showAllHighlights')?.value;
// });

const getShowAudioHighlightsCookie = $(async () => {
  return readCookie('showAllHighlights', document.cookie);
  // return await fetch('/api/courses/chapters/getShowAudioHighlightsCookie/').then((x) => x.json());
});

import LoadingSVG from '~/components/LoadingSVG';
// import getUser from '~/components/_Index/Nav/getUser';
import type theme from '~/const/theme';
import readCookie from '~/utils/readCookie';
import { ContentUserProgress } from '../../../../../../../../drizzle_turso/schema/content_user_progress';

// export { getUser };

interface ChapterActions {
  showAllHighlights: boolean;
}

export const chapterContext = createContextId<ChapterActions>('chapterContext');

const setThemeCookieFn = $(async (themeValue: any) => {
  const d = new FormData();
  d.append('theme', themeValue);
  return await fetch('/api/courses/chapters/setThemeCookie/', {
    method: 'POST',
    body: d,
    // headers: {
    //   'Content-Type': 'application/json',
    // },
  }).then((x) => x.json());
});

const getProgressFn = $((courseId: string, userId: string) => {
  const d = new FormData();
  d.append('courseId', courseId);
  d.append('userId', userId);
  return fetch('/api/courses/chapters/getProgress', {
    method: 'POST',
    body: d,
  }).then((x) => x.json());
});

const logout = $(() => {
  return fetch('/api/courses/logout/', {
    method: 'POST',
  });
});

export default component$(() => {
  const openSideNav = useSignal(false);
  const userNullable = useUserLoaderNullable().value;
  const { course, preview, chapters } = useCourseLoader().value;
  const { currentChapter, loaded, subscriptionNeeded } = useCurrentChapter().value;
  const chapterSlug = useLocation().params.chapterSlug;
  const cookieProgress = useSignal<string[]>([]);

  const nav = useNavigate();
  const theme = useContext(themeContext);

  const showSideNav = useSignal(false);
  const handleLogout = $(async () => {
    await fetch('/api/courses/logout/', {
      method: 'POST',
    });
    removeClientDataCache();
    nav('/');
  });

  const chapterActions = useStore<ChapterActions>({
    showAllHighlights: false,
  });

  const content_user_progress = useSignal<ContentUserProgress>();

  useContextProvider(chapterContext, chapterActions);

  const setShowAllHighlights = $(() => {
    const t = chapterActions.showAllHighlights;
    setShowAllHighlightsCookie(!t).catch((e) => {
      console.error(e);
      chapterActions.showAllHighlights = t;
    });
    chapterActions.showAllHighlights = !t;
  });

  useOnDocument(
    'qinit',
    $(async () => {
      cookieProgress.value = JSON.parse(readCookie('progress', document.cookie) || '[]') as string[];
      const showAllHighlights = await getShowAudioHighlightsCookie();
      if (showAllHighlights === 'true') {
        chapterActions.showAllHighlights = true;
      }
    })
  );

  const login = useStore({
    isLoading: userNullable === undefined,
    isLoggedIn: userNullable !== undefined,
    user: userNullable,
  });

  useVisibleTask$(async () => {
    if (login.isLoggedIn) {
      getProgressFn(course.content_index.id, login.user!.userId)
        .then((r) => {
          content_user_progress.value = r[0];
        })
        .catch((e) => {
          console.error(e);
        });
    }
    const res = await fetch('/api/courses/chapters/getUser/', {
      credentials: 'include',
    }).then((x) => x.json());
    login.isLoading = false;
    if (res) {
      login.isLoggedIn = true;
      login.user = res.user;
      getProgressFn(course.content_index.id, login.user!.userId)
        .then((r) => {
          content_user_progress.value = r[0];
        })
        .catch((e) => {
          console.error(e);
        });
    }
  });

  return (
    <>
      <section class="flex min-h-[100dvh] flex-col bg-background-light-gray dark:bg-primary-dark-gray dark:text-background-light-gray">
        <div class="flex max-h-[100dvh] flex-1 flex-col lg:flex-row">
          <nav class="hidden max-h-[100dvh] min-h-full w-[20%] min-w-[300px] max-w-[500px] overflow-auto bg-pale-yellow/50 pl-6 pr-6 dark:bg-disabled-dark lg:block lg:w-[20%] 2xl:w-[30%] 2xl:pl-[10%]">
            <div class="flex h-full flex-col items-start gap-4 py-6">
              <SmallNav login={login} setThemeCookieFn={setThemeCookieFn} logoutFn={logout} />
              <div class="flex h-full w-full flex-col gap-2 py-2  lg:gap-3 lg:py-4">
                <div class="flex flex-col">
                  <Link
                    href={'/catalog/'}
                    class="mb-6 flex items-center gap-2 text-sm tracking-wide text-gray-500 dark:text-background-light-gray"
                  >
                    <span>All courses</span>{' '}
                    <span class="-mt-[4px] block text-[15px] text-gray-500 dark:text-background-light-gray">
                      <LuArrowRight />
                    </span>
                  </Link>
                  {preview && <p class="font-mosk text-xs tracking-wide text-deep-sea lg:text-sm">Preview Mode</p>}
                  {!preview && !course.content_index.is_private && (
                    <p class="font-mosk text-xs tracking-wide text-deep-sea ">Public</p>
                  )}
                  {!preview && course.content_index.is_private && (
                    <p class="dark:text-pink font-mosk text-xs tracking-wide text-tomato">Private</p>
                  )}

                  <p class="text-base lg:text-lg">{course.content_index.name}</p>
                </div>
                {!course.content_index.is_single_page && (
                  <ul class="flex flex-col gap-3 border-l-2 border-gray-300 py-2 text-sm text-gray-400 dark:border-gray-500 dark:text-gray-500 lg:text-base">
                    {course.content_index.chapter_order.map((chapterId) => {
                      const chapter = chapters.find((c) => c.id === chapterId);
                      if (!chapter) return null;
                      const isActive = chapter.slug === chapterSlug;
                      return (
                        <li
                          key={chapter.id}
                          class={cn(
                            'relative flex items-center gap-3 pl-6 after:absolute after:left-[-4px] after:top-[50%] after:z-10 after:hidden after:size-[8px] after:translate-y-[-4px] after:rounded-full after:bg-middle-yellow hover:after:block lg:after:left-[-5px] lg:after:size-[10px] lg:after:translate-y-[-5px] ',
                            (content_user_progress.value?.progress.includes(chapter.id) ||
                              cookieProgress.value.includes(chapter.id)) &&
                              'text-dark-mint after:block after:bg-dark-mint dark:text-mint',
                            isActive && 'text-deep-sea after:block after:bg-deep-sea dark:text-sea'
                          )}
                        >
                          <Link prefetch href={chapter.link || undefined}>
                            <span class="flex items-center gap-2">
                              <span>{chapter.name}</span>
                              {chapter.is_checkpoint && (
                                <span class=" text-[15px] text-tomato dark:text-custom-pink">
                                  <LuGoal />
                                </span>
                              )}
                              {chapter.is_premium && (
                                <span class=" text-[15px] text-tomato dark:text-custom-pink">
                                  <LuGem />
                                </span>
                              )}
                            </span>
                          </Link>
                          {(content_user_progress.value?.progress.includes(chapter.id) ||
                            cookieProgress.value.includes(chapter.id)) && (
                            <span class="text-[15px] text-dark-mint dark:text-mint">
                              <LuCheck />
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
                <section class="mt-auto flex flex-col gap-3 pt-3">
                  <button
                    class="flex items-center"
                    onClick$={(e, currentTarget) => {
                      setShowAllHighlights();
                    }}
                  >
                    <span class="inline-block w-[200px] text-left">Show audio highlights</span>
                    <Checkbox checked={chapterActions.showAllHighlights} />
                  </button>
                </section>
              </div>
            </div>
          </nav>
          {showSideNav.value && (
            <nav
              class="fixed left-0 top-0 z-[9999] flex h-[100dvh] w-[100vw] justify-start backdrop-blur-md lg:hidden"
              onClick$={() => {
                showSideNav.value = false;
              }}
            >
              <button
                onClick$={() => (showSideNav.value = false)}
                class={'absolute right-5 top-5 text-[20px] text-primary-dark-gray dark:text-background-light-gray'}
              >
                <LuX />
              </button>
              <div
                class={
                  'w-[80%] overflow-auto border-r-2 border-primary-dark-gray dark:border-gray-300 bg-[rgb(249_247_240)] dark:bg-disabled-dark'
                }
                onClick$={(e) => e.stopPropagation()}
              >
                <ul class="mx-auto flex h-full w-[90%] flex-col gap-6 py-6">
                  <li class="flex items-center gap-6">
                    <label class="flex cursor-pointer items-center gap-2 text-[20px] text-primary-dark-gray dark:text-background-light-gray">
                      <LuSun />
                      <input
                        onChange$={(e, cTarget) => {
                          if (cTarget.checked) {
                            theme.value = 'dark';
                          } else {
                            theme.value = 'light';
                          }
                          setThemeCookie(theme.value);
                        }}
                        checked={theme.value.includes('dark')}
                        type="checkbox"
                        class="peer sr-only"
                      ></input>
                      <div class="peer-checked:after:border-backgroundbg-background-light-gray peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-background-light-gray after:transition-all after:content-[''] peer-checked:bg-highlight-dark peer-checked:after:translate-x-full peer-focus:outline-none"></div>
                      <LuMoon />
                    </label>
                    {login.isLoading && (
                      <span class="ml-auto">
                        <LoadingSVG />
                      </span>
                    )}
                    {login.isLoggedIn && login.user ? (
                      <div class={' ml-auto flex -translate-x-[8px] gap-2 sm:translate-x-0'}>
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
                        <Link prefetch href={'/login/'} class="whitespace-nowrap py-2 px-6 underline underline-offset-4">
                          Login
                        </Link>
                      </span>
                    )}
                  </li>
                  <li>
                    <Link prefetch href={'/members/dashboard/'} class="flex items-center gap-4">
                      Home
                      <span class={'text-[20px] text-primary-dark-gray dark:text-background-light-gray'}>
                        <LuHome />
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link prefetch href={'/catalog/'} class="flex items-center gap-4">
                      Courses
                      <span class={'text-[20px] text-primary-dark-gray dark:text-background-light-gray'}>
                        <LuFileText />
                      </span>
                    </Link>
                  </li>
                  {/* <li>
                    <Link prefetch href={'/members/dashboard/'} class="flex items-center gap-4">
                      Projects
                      <span class={'text-[20px] text-primary-dark-gray dark:text-background-light-gray'}>
                        <LuFile />
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link prefetch href={'/members/dashboard/'} class="flex items-center gap-4">
                      Playground
                      <span class={'text-[20px] text-primary-dark-gray dark:text-background-light-gray'}>
                        <LuFileTerminal />
                      </span>
                    </Link>
                  </li> */}
                  {userNullable && (
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
                      {userNullable.role === 'admin' && (
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
                        <Link prefetch href="/creator/" class="flex items-center gap-4">
                          <span class="whitespace-nowrap">Creator</span>
                          <span class="text-[20px]">
                            <LuPencilLine />
                          </span>
                        </Link>
                      </li>
                      {userNullable.role === 'admin' && (
                        <li>
                          <Link prefetch href="/admin/courseapproval" class="flex items-center gap-4">
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
                  <div class="flex w-[100%] justify-center">
                    <div class="h-[2px] w-[100%] bg-gray-300">&nbsp;</div>
                  </div>
                  <li class="flex h-full w-full flex-col gap-1">
                    <div class="flex flex-col">
                      <Link
                        href={'/catalog/'}
                        class="mb-6 flex items-center gap-2 text-sm tracking-wide text-gray-500 dark:text-background-light-gray"
                      >
                        <span>All courses</span>{' '}
                        <span class="-mt-[4px] block text-[15px] text-gray-500 dark:text-background-light-gray">
                          <LuArrowRight />
                        </span>
                      </Link>
                      {preview && <p class="font-mosk text-xs tracking-wide text-deep-sea lg:text-sm">Preview Mode</p>}
                      {!preview && !course.content_index.is_private && (
                        <p class="font-mosk text-xs tracking-wide text-deep-sea ">Public</p>
                      )}
                      {!preview && course.content_index.is_private && (
                        <p class="dark:text-pink font-mosk text-xs tracking-wide text-tomato">Private</p>
                      )}

                      <p class="text-base lg:text-lg">{course.content_index.name}</p>
                    </div>
                    {!course.content_index.is_single_page && (
                      <ul class="flex flex-col gap-3 border-l-2 border-gray-300 py-2 text-sm text-gray-400 dark:border-gray-500 dark:text-gray-500 lg:text-base">
                        {course.content_index.chapter_order.map((chapterId) => {
                          const chapter = chapters.find((c) => c.id === chapterId);
                          if (!chapter) return null;
                          const isActive = chapter.slug === chapterSlug;
                          return (
                            <li
                              key={chapter.id}
                              class={cn(
                                'relative flex items-center gap-3 pl-6 after:absolute after:left-[-4px] after:top-[50%] after:z-10 after:hidden after:size-[8px] after:translate-y-[-4px] after:rounded-full after:bg-middle-yellow hover:after:block lg:after:left-[-5px] lg:after:size-[10px] lg:after:translate-y-[-5px] ',
                                isActive && 'text-deep-sea after:block after:bg-deep-sea dark:text-sea',
                                (content_user_progress.value?.progress.includes(chapter.id) ||
                                  cookieProgress.value.includes(chapter.id)) &&
                                  'text-dark-mint after:block after:bg-dark-mint dark:text-mint'
                              )}
                            >
                              <Link prefetch href={chapter.link || undefined}>
                                <span class="flex items-center gap-2">
                                  <span>{chapter.name}</span>
                                  {chapter.is_checkpoint && (
                                    <span class="text-[15px] text-tomato dark:text-custom-pink">
                                      <LuGoal />
                                    </span>
                                  )}
                                  {chapter.is_premium && (
                                    <span class="text-[15px] text-tomato dark:text-custom-pink">
                                      <LuGem />
                                    </span>
                                  )}
                                </span>
                              </Link>
                              {(content_user_progress.value?.progress.includes(chapter.id) ||
                                cookieProgress.value.includes(chapter.id)) && (
                                <span class="text-[15px] text-dark-mint dark:text-mint">
                                  <LuCheck />
                                </span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                    <section class="mt-auto flex flex-col gap-3 pt-3">
                      <button
                        class="flex items-center"
                        onClick$={() => {
                          setShowAllHighlights();
                          console.log('yo');
                        }}
                      >
                        <span class="inline-block w-[200px] text-left">Show audio highlights</span>
                        <Checkbox checked={chapterActions.showAllHighlights} />
                      </button>
                    </section>
                  </li>
                </ul>
              </div>
            </nav>
          )}
          <nav class="shadow shadow-slate-200/80 ring-1 ring-slate-900/5 backdrop-blur-sm dark:text-background-light-gray">
            <div class="mx-auto flex w-[90%] items-center justify-between py-6 text-[25px]  md:w-[80%] lg:hidden">
              <h1 class="font-mosk text-3xl font-bold tracking-wide">
                <Link href="/members/dashboard/">Partialty.com</Link>
              </h1>
              <button
                class={'p-2 text-primary-dark-gray dark:text-background-light-gray'}
                onClick$={() => (showSideNav.value = !showSideNav.value)}
              >
                <LuAlignJustify />
              </button>
            </div>
          </nav>
          <div class="flex flex-1 overflow-hidden">
            {loaded && <Slot />}
            {!loaded && (
              <section class="flex h-full flex-col items-center justify-center gap-2 px-3 text-center md:gap-4 md:px-6 lg:px-8">
                <h1 class="flex flex-wrap items-center justify-center font-mosk text-lg font-bold tracking-wide md:text-xl lg:text-3xl">
                  <span class="whitespace-nowrap">Aiya, Looks Like You Need to&nbsp;</span>
                  <span class="highlight-mint flex items-center px-6 dark:highlight-mint-down dark:px-6">
                    <span>Subscribe&nbsp;</span>
                    <span class="text-[15px] md:text-[20px]">
                      <LuGem />
                    </span>
                  </span>
                  <span>&nbsp;First</span>
                </h1>
                <p class="text-sm md:text-base lg:text-lg">
                  This part of the content requires a subscription. Head over to{' '}
                  <Link href={'/profile/'} class="underline decoration-wavy underline-offset-4">
                    profiles
                  </Link>{' '}
                  and subscribe at only $5 per month. You can cancel anytime.{' '}
                </p>
              </section>
            )}
          </div>
        </div>
      </section>
    </>
  );
});
