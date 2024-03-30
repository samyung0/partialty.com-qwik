/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { component$, useComputed$, useStore } from '@builder.io/qwik';
import { IoCaretDown } from '@qwikest/icons/ionicons';
import { LuEye, LuEyeOff, LuGem, LuGoal, LuHourglass, LuLock, LuUnlock } from '@qwikest/icons/lucide';

import DropDownTransition from '~/components/_Creator/Course/DropDownTransition';

import { routeLoader$, server$, useNavigate } from '@builder.io/qwik-city';
import { adminCourseApprovalLoader } from '~/loader/admin/courseapproval';
import { categoryLoader, tagLoader } from '~/loader/db';
import { useUserLoader } from '~/routes/(lang)/(wrapper)/(authRoutes)/layout';
import { displayNamesLang, listSupportedLang } from '../../../../../../../lang';

import _handleAmendmentNeeded from '~/routes/(lang)/(wrapper)/(authRoutes)/admin/courseapproval/handleAmendmentNeeded';
import _handleConfirmPublish from '~/routes/(lang)/(wrapper)/(authRoutes)/admin/courseapproval/handleConfirmPublish';
import _handleRejectPublish from '~/routes/(lang)/(wrapper)/(authRoutes)/admin/courseapproval/handleRejectPublish';

export const useCourseApproval = routeLoader$((event) => adminCourseApprovalLoader(event));
export const useTags = routeLoader$((event) => tagLoader(event));
export const useCategories = routeLoader$((event) => categoryLoader(event));
export const handleAmendmentNeeded = server$(async function (
  userRole: string,
  approvalId: string,
  need_amendment_reason: string
) {
  return await _handleAmendmentNeeded(this, userRole, approvalId, need_amendment_reason);
});
export const handleConfirmPublish = server$(async function (
  userRole: string,
  addedCategory: string | null,
  addedTags: string[],
  approvalId: string
) {
  return await _handleConfirmPublish(this, userRole, addedCategory, addedTags, approvalId);
});
export const handleRejectPublish = server$(async function (
  userRole: string,
  approvalId: string,
  rejected_reason: string
) {
  return await _handleRejectPublish(this, userRole, approvalId, rejected_reason);
});

export default component$(() => {
  const loader = useCourseApproval();
  const _courseState = useComputed$(() =>
    Object.fromEntries(
      loader.value.map((loaderEntry) => [
        loaderEntry.content_index.id,
        {
          isOpen: false,
          actionsOpened: false,
          chapterActionsOpened: null as string | null,
        },
      ])
    )
  );
  const courseState = useStore(() => JSON.parse(JSON.stringify(_courseState)));
  const user = useUserLoader().value;
  const tags = useTags().value;
  const categories = useCategories().value;
  const nav = useNavigate();

  return (
    <div class="mx-auto flex w-[90%] flex-col lg:w-[80%]">
      <h1 class="font-mosk text-2xl font-bold tracking-wide lg:text-3xl">Course Approval</h1>
      <div class="mt-1 h-[2px] w-full bg-primary-dark-gray dark:bg-background-light-gray lg:mt-3"></div>
      <main>
        {loader.value.length === 0 && <p class="mt-3 lg:mt-6">No courses are ready for approval yet. ヾ(•ω•`)o</p>}
        {loader.value.length > 0 && (
          <ul class="flex flex-col gap-2 py-3 pb-48 lg:py-6 lg:pb-48">
            {loader.value.map((loaderEntry) => {
              const currentCourse = loaderEntry.content_index;
              const profile = loaderEntry.profiles;
              const courseApproval = loaderEntry.course_approval;
              const chapters = loaderEntry.chapters;

              const displayChapters = currentCourse.chapter_order.filter((chapter) => {
                return !!chapters.find((c) => c.id === chapter);
              });
              return (
                <li
                  class={
                    'flex flex-col gap-2 rounded-xl border-2 border-primary-dark-gray bg-background-light-gray px-4 py-2 dark:bg-highlight-dark dark:text-background-light-gray md:gap-4 md:px-6 md:py-3'
                  }
                  key={`currentCourses${currentCourse.slug}`}
                >
                  <div
                    onClick$={() => {
                      courseState.value[currentCourse.id].isOpen = !courseState.value[currentCourse.id].isOpen;
                    }}
                    class="flex cursor-pointer items-center justify-between"
                    role="button"
                  >
                    <div class="flex flex-col lg:gap-1">
                      <h2 class="text-lg font-bold tracking-wide">{currentCourse.name}</h2>
                      <p class="flex items-center gap-2">
                        <span class="text-xs tracking-wide lg:text-sm">
                          {new Date(currentCourse.updated_at).toDateString()},{' '}
                          {displayNamesLang[currentCourse.lang as keyof typeof displayNamesLang]}
                        </span>
                        <span>
                          <img
                            src={profile.avatar_url}
                            alt=""
                            width={20}
                            height={20}
                            class="h-[16px] w-[16px] rounded-full lg:h-[20px] lg:w-[20px]"
                          />
                        </span>
                      </p>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="flex items-center gap-2">
                        <div class="p-1 md:p-2">
                          <span
                            style={{
                              transform: courseState.value[currentCourse.id].isOpen ? 'rotateZ(180deg)' : '',
                            }}
                            class={'inline-block text-[15px] text-primary-dark-gray dark:text-background-light-gray'}
                          >
                            <IoCaretDown />
                          </span>
                        </div>
                        <div class="relative inline-block text-left">
                          <div>
                            <button
                              type="button"
                              class="flex items-center rounded-full p-1 focus:outline-none "
                              id={'menu-button-course' + currentCourse.id}
                              aria-expanded={courseState.value[currentCourse.id].actionsOpened}
                              aria-haspopup={courseState.value[currentCourse.id].actionsOpened}
                              onClick$={(e) => {
                                e.stopPropagation();
                                courseState.value[currentCourse.id].actionsOpened =
                                  !courseState.value[currentCourse.id].actionsOpened;
                              }}
                            >
                              <span class="sr-only">Open options</span>
                              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                              </svg>
                            </button>
                          </div>
                          <DropDownTransition
                            open={courseState.value[currentCourse.id].actionsOpened}
                            class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg border-2 border-primary-dark-gray bg-background-light-gray dark:bg-primary-dark-gray"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby={'menu-button-course' + currentCourse.id}
                            tabIndex={-1}
                          >
                            <div class="flex flex-col py-1 [&>button]:text-left" role="none">
                              <a
                                target="_blank"
                                href={currentCourse.link!}
                                class="block px-4 py-2 text-sm "
                                role="menuitem"
                                tabIndex={-1}
                                id={'menu-item-0' + currentCourse.id}
                                onClick$={(e) => e.stopPropagation()}
                              >
                                View {currentCourse.is_guide ? 'Guide' : 'Course'}
                              </a>
                              <button
                                class="block px-4 py-2 text-sm "
                                role="menuitem"
                                tabIndex={-1}
                                id={'menu-item-1' + currentCourse.id}
                                onClick$={async (e) => {
                                  e.stopPropagation();
                                  try {
                                    await handleConfirmPublish(
                                      user.role,
                                      courseApproval.added_categories,
                                      courseApproval.added_tags || [],
                                      courseApproval.id
                                    );
                                    alert('Course Published Successfully!');
                                    nav();
                                  } catch (e) {
                                    console.error(e);
                                    alert('Unable to publish course!');
                                  }
                                }}
                              >
                                Confirm Publish
                              </button>
                              <button
                                class="block px-4 py-2 text-sm "
                                role="menuitem"
                                tabIndex={-1}
                                id={'menu-item-2' + currentCourse.id}
                                onClick$={async (e) => {
                                  e.stopPropagation();
                                  const reason = window.prompt('Why is amendment needed?');
                                  if (!reason) return;
                                  try {
                                    await handleAmendmentNeeded(user.role, courseApproval.id, reason);
                                    alert('Course Updated Successfully!');
                                    nav();
                                  } catch (e) {
                                    console.error(e);
                                    alert('Unable to update course!');
                                  }
                                }}
                              >
                                Amendment Needed
                              </button>
                              <button
                                class="block px-4 py-2 text-sm "
                                role="menuitem"
                                tabIndex={-1}
                                id={'menu-item-3' + currentCourse.id}
                                onClick$={async (e) => {
                                  e.stopPropagation();
                                  const reason = window.prompt('Why is the course rejected?');
                                  if (!reason) return;
                                  try {
                                    await handleRejectPublish(user.role, courseApproval.id, reason);
                                    alert('Course Updated Successfully!');
                                    nav();
                                  } catch (e) {
                                    console.error(e);
                                    alert('Unable to update course!');
                                  }
                                }}
                              >
                                Reject Publish
                              </button>
                            </div>
                          </DropDownTransition>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col gap-2">
                    <p class="flex flex-col gap-2 text-[0.875rem] lg:gap-3 lg:text-[1rem]">
                      <span class="inline-flex items-center gap-2">
                        <span class=" text-[16px] text-primary-dark-gray dark:text-background-light-gray lg:text-[20px]">
                          <LuHourglass />
                        </span>
                        Pending for Approval
                      </span>
                    </p>
                  </div>
                  {courseState.value[currentCourse.id].isOpen && (
                    <div class="text-[0.875rem] lg:text-[1rem]">
                      <div class="flex items-center pb-2">
                        <h3 class="w-[30%]">Author:</h3>
                        <p class={`w-[70%]`}>
                          <span class="flex items-center gap-2">
                            <span>
                              <img
                                src={profile.avatar_url}
                                alt=""
                                width={30}
                                height={30}
                                class="h-[25px] w-[25px] rounded-full lg:h-[30px] lg:w-[30px]"
                              />
                            </span>
                            <span>{profile.nickname}</span>
                          </span>
                        </p>
                      </div>
                      <div class="flex gap-4 pb-2">
                        <h3 class="w-[30%]">Course Language:</h3>
                        <p class={`w-[70%]`}>
                          {listSupportedLang.find((lang) => lang.value === currentCourse.lang)!.label}
                        </p>
                      </div>
                      {user.role === 'admin' && (
                        <div class="flex gap-4 pb-2">
                          <h3 class="w-[30%]">Supported Languages:</h3>
                          <p class={`w-[70%]`}>
                            {currentCourse.supported_lang
                              .filter((_lang) => listSupportedLang.find(({ value }) => value === _lang))
                              .map((_lang) => listSupportedLang.find((lang) => lang.value === _lang)!.label)
                              .join(', ')}
                          </p>
                        </div>
                      )}
                      <div class="flex gap-4 pb-2">
                        <h3 class="w-[30%]">Created At:</h3>
                        <p class={`w-[70%]`}>{new Date(currentCourse.created_at).toDateString()}</p>
                      </div>
                      <div class="flex gap-4 pb-2">
                        <h3 class="w-[30%]">Updated At:</h3>
                        <p class={`w-[70%]`}>{new Date(currentCourse.updated_at).toDateString()}</p>
                      </div>
                      {currentCourse.category && (
                        <div class="flex gap-4 pb-2">
                          <h3 class="w-[30%]">Category:</h3>
                          <p class={`w-[70%]`}>
                            {categories.find((category) => category.id === currentCourse.category) && (
                              <a
                                target="_blank"
                                href={categories.find((category) => category.id === currentCourse.category)!.link}
                                class={`border-b-2 border-primary-dark-gray dark:border-background-light-gray`}
                              >
                                {categories.find((category) => category.id === currentCourse.category)!.name}
                              </a>
                            )}
                          </p>
                        </div>
                      )}
                      <div class="flex gap-4 pb-2">
                        <h3 class="w-[30%]">Added Category:</h3>
                        <p class={`w-[70%]`}>
                          {categories.find((category) => category.id === courseApproval.added_categories) && (
                            <a
                              target="_blank"
                              href={categories.find((category) => category.id === currentCourse.category)!.link}
                              class={`border-b-2 border-primary-dark-gray dark:border-background-light-gray`}
                            >
                              {categories.find((category) => category.id === currentCourse.category)!.name}
                            </a>
                          )}
                        </p>
                      </div>
                      {currentCourse.tags &&
                        currentCourse.tags!.filter((tag) => tags.find((tag2) => tag2.id === tag)).length > 0 && (
                          <div class="flex gap-4 pb-2">
                            <h3 class="w-[30%]">Tags:</h3>
                            <ul class="flex w-[70%] flex-wrap gap-x-4 gap-y-2">
                              {(currentCourse.tags || [])
                                .filter((tag) => tags.find((tag2) => tag2.id === tag))
                                .map((tag) => (
                                  <li key={`Course${currentCourse.id}Tag${tag}`}>
                                    <a
                                      target="_blank"
                                      class="border-b-2 border-primary-dark-gray dark:border-background-light-gray"
                                      href={tags.find((tag2) => tag2.id === tag)!.link}
                                    >
                                      {tags.find((tag2) => tag2.id === tag)!.name}
                                    </a>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}
                      <div class="flex gap-4 pb-2">
                        <h3 class="w-[30%]">Added Tags:</h3>
                        <ul class="flex w-[70%] flex-wrap gap-x-4 gap-y-2">
                          {(courseApproval.added_tags || [])
                            .filter((tag) => tags.find((tag2) => tag2.id === tag))
                            .map((tag) => (
                              <li key={`Course${currentCourse.id}Tag${tag}`}>
                                <a
                                  target="_blank"
                                  class="border-b-2 border-primary-dark-gray dark:border-background-light-gray"
                                  href={tags.find((tag2) => tag2.id === tag)!.link}
                                >
                                  {tags.find((tag2) => tag2.id === tag)!.name}
                                </a>
                              </li>
                            ))}
                        </ul>
                      </div>
                      <div class="mt-4 flex gap-4 pb-2 lg:mt-6" title="Checks if the course is visible to everyone.">
                        <p class="flex items-center gap-2">
                          {currentCourse.is_private && (
                            <span class="text-[15px] text-primary-dark-gray dark:text-background-light-gray lg:text-[20px]">
                              <LuEyeOff />
                            </span>
                          )}
                          {!currentCourse.is_private && (
                            <span class="text-[15px] text-primary-dark-gray dark:text-background-light-gray lg:text-[20px]">
                              <LuEye />
                            </span>
                          )}
                          <span>
                            {currentCourse.is_private ? 'Only people with invite codes can view' : 'Open to everyone'}
                          </span>
                        </p>
                      </div>
                      {user.role === 'admin' && (
                        <div
                          class="flex gap-4 pb-2"
                          title="Checks if a subscription is needed to read the course content."
                        >
                          <p class="flex items-center gap-2">
                            <span
                              class={
                                'text-[15px] lg:text-[20px] ' +
                                (currentCourse.is_premium ? 'text-tomato' : 'text-gray-300')
                              }
                            >
                              <LuGem />
                            </span>
                            <span>
                              {currentCourse.is_premium ? 'Subscription Required' : 'Subscription Not Required'}
                            </span>
                          </p>
                        </div>
                      )}
                      <div class="flex gap-4" title="If a course is locked, the content cannot be edited.">
                        <p class="flex items-center gap-2">
                          <span
                            class={'text-[15px] text-primary-dark-gray dark:text-background-light-gray lg:text-[20px]'}
                          >
                            {currentCourse.is_locked ? <LuLock /> : <LuUnlock />}
                          </span>
                          <span>
                            {currentCourse.is_locked ? 'Only you can edit' : 'Anyone with permission can edit'}
                          </span>
                        </p>
                      </div>
                      <div class="mt-4 flex flex-col gap-2 py-2 lg:mt-6">
                        <div class="flex items-start gap-4">
                          <h3 class="w-[30%] leading-5">Short Description:</h3>
                          <p class={`w-[80%] whitespace-pre-line leading-5`}>{currentCourse.short_description}</p>
                        </div>
                        <div class="flex items-start gap-4">
                          <h3 class="w-[30%] leading-5">Description:</h3>
                          <p class={`w-[80%] whitespace-pre-line leading-5`}>{currentCourse.description}</p>
                        </div>
                      </div>
                      {!currentCourse.is_single_page && displayChapters && (
                        <>
                          <div class="flex items-center gap-2 py-4">
                            <h3 class="font-bold tracking-wide">Chapters</h3>
                          </div>
                          {displayChapters.length === 0 && <p class="pb-4">No chapters yet</p>}
                          {displayChapters.length > 0 && (
                            <ul class="flex flex-col gap-3 pb-4 lg:gap-4">
                              {displayChapters.map((_chapterId) => {
                                const chapter = chapters.find((c) => c.id === _chapterId);
                                if (!chapter) return;
                                return (
                                  <li
                                    key={`Course${currentCourse.id}Chapter${chapter.id}`}
                                    class="flex items-center justify-between gap-2"
                                  >
                                    <div class="flex items-center gap-1 lg:gap-2">
                                      <h4 class="border-b-2 border-primary-dark-gray dark:border-background-light-gray">
                                        <a target="_blank" href={chapter.link || undefined}>
                                          {chapter.name ? chapter.name : ''}
                                        </a>
                                      </h4>
                                      <p class="flex items-center gap-2">
                                        {chapter.is_locked && (
                                          <span class={'text-[14px] text-tomato lg:text-[18px]'}>
                                            <LuLock />
                                          </span>
                                        )}
                                        {chapter.is_checkpoint && (
                                          <span class={'text-[14px] text-tomato lg:text-[18px]'}>
                                            <LuGoal />
                                          </span>
                                        )}
                                        {user.role === 'admin' && chapter.is_premium && (
                                          <span class={'text-[14px] text-tomato lg:text-[18px]'}>
                                            <LuGem />
                                          </span>
                                        )}
                                      </p>
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
});
