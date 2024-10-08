/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { NoSerialize, QRL, Signal } from '@builder.io/qwik';
import { $, component$, useComputed$, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { server$, useNavigate, z } from '@builder.io/qwik-city';
import { IoCaretDown } from '@qwikest/icons/ionicons';
import {
  LuAlertTriangle,
  LuBan,
  LuCheck,
  LuEye,
  LuEyeOff,
  LuGem,
  LuGoal,
  LuHourglass,
  LuInfo,
  LuLock,
  LuUnlock,
} from '@qwikest/icons/lucide';
import { and, eq } from 'drizzle-orm';

import { isServer } from '@builder.io/qwik/build';
import { generateRandomString, isWithinExpiration } from 'lucia/utils';
import verifyContentShareToken from '~/auth/verifyContentShareToken';
import LoadingSVG from '~/components/LoadingSVG';
import AddChapter from '~/components/_Creator/Course/AddChapter';
import DropDownTransition from '~/components/_Creator/Course/DropDownTransition';
import EditChapter from '~/components/_Creator/Course/EditChapter';
import GetCode from '~/components/_Creator/Course/GetCode';
import { useUserLoader } from '~/routes/(lang)/(wrapper)/(authRoutes)/layout';
import drizzleClient from '~/utils/drizzleClient';
import getSQLTimeStamp from '~/utils/getSQLTimeStamp';
import tursoClient from '~/utils/tursoClient';
import type { Content, NewContent } from '../../../../drizzle_turso/schema/content';
import { content } from '../../../../drizzle_turso/schema/content';
import type { ContentCategory } from '../../../../drizzle_turso/schema/content_category';
import { content_index, type ContentIndex } from '../../../../drizzle_turso/schema/content_index';
import { content_share_token } from '../../../../drizzle_turso/schema/content_share_token';
import type { CourseApproval } from '../../../../drizzle_turso/schema/course_approval';
import { course_approval } from '../../../../drizzle_turso/schema/course_approval';
import { profiles, type Profiles } from '../../../../drizzle_turso/schema/profiles';
import type { Tag } from '../../../../drizzle_turso/schema/tag';
import { displayNamesLang, listSupportedLang } from '../../../../lang';

export type IsLockedValidation = {
  userRole: string;
  userId: string;
  author: string;
  isLocked: boolean;
};

const EXPIRES_IN = 1000 * 60 * 30; // 30 minutes
export const generateToken = server$(async function (contentId: string) {
  const storedUserTokens = await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === '1')
    .select()
    .from(content_share_token)
    .where(eq(content_share_token.index_id, contentId));
  if (storedUserTokens.length > 0) {
    const reusableStoredToken = storedUserTokens.find((token) => {
      // check if expiration is within 15 minutes
      // and reuse the token if true
      return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
    });
    await Promise.allSettled(
      storedUserTokens
        .filter((token) => token.id !== reusableStoredToken?.id || '')
        .map(async (token) => {
          await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === '1')
            .delete(content_share_token)
            .where(eq(content_share_token.id, token.id));
        })
    );
    if (reusableStoredToken) return reusableStoredToken.id;
  }
  const token = generateRandomString(6).toUpperCase();
  // await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === "1").transaction(async (tx) => {
  //   await tx.insert(content_share_token).values({
  //     id: token,
  //     expires: BigInt(new Date().getTime() + EXPIRES_IN),
  //     index_id: contentId,
  //   }).returning();
  // });

  // idk why i cant use drizzle, it returns cannot read from undefined (reading from) in prod mode
  const client = tursoClient(this.env, import.meta.env.VITE_USE_PROD_DB === '1');
  await client.execute({
    sql: 'INSERT INTO content_share_token (id, index_id, expires) VALUES (?, ?, ?)',
    args: [token, contentId, BigInt(new Date().getTime() + EXPIRES_IN)],
  });

  return token;
});

export const addEditableCourse = server$(async function (
  code: string,
  accessible_courses: string[],
  accessible_courses_read: string[],
  userId: string
) {
  try {
    const contentId = await verifyContentShareToken(this.env, code);
    await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === '1')
      .update(profiles)
      .set({
        accessible_courses: JSON.stringify([...accessible_courses, contentId]),
        accessible_courses_read: JSON.stringify([...accessible_courses_read, contentId]),
      })
      .where(eq(profiles.id, userId));
    return { success: true, userId };
  } catch (e) {
    return { success: false, error: e };
  }
});

export const getChapters = server$(async function (courseId: string) {
  return await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === '1')
    .select()
    .from(content)
    .where(eq(content.index_id, courseId));
});

export const deleteCourse = server$(async function (courseId: string) {
  await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === '1').transaction(async (tx) => {
    await tx
      .update(content_index)
      .set({ is_deleted: true, updated_at: getSQLTimeStamp() })
      .where(eq(content_index.id, courseId));
    await tx
      .update(content)
      .set({ is_deleted: true, updated_at: getSQLTimeStamp() })
      .where(eq(content.index_id, courseId));
  });
  // DO NOT DELETE the course, it will fail due to foreign key constraints, instead set the delete flag
});

export const deleteChapter = server$(async function (chapterId: string) {
  await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === '1')
    .update(content)
    .set({ is_deleted: true, updated_at: getSQLTimeStamp() })
    .where(eq(content.id, chapterId));
  // DO NOT DELETE the course, it will fail due to foreign key constraints, instead set the delete flag
});

export const createChapter = server$(async function (newChapter: NewContent, chapter_order: string[]) {
  return await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === '1').transaction(async (tx) => {
    await tx
      .update(content_index)
      .set({ chapter_order, updated_at: getSQLTimeStamp() })
      .where(eq(content_index.id, newChapter.index_id));
    return await tx.insert(content).values(newChapter).returning();
  });
});

export const saveChapter = server$(async function (newChapter: Content) {
  return await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === '1')
    .update(content)
    .set(newChapter)
    .where(eq(content.id, newChapter.id))
    .returning();
});

export const checkExistingChapter = server$(async function (slug: string, courseId: string) {
  return await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === '1')
    .select({ id: content.id })
    .from(content)
    .where(and(eq(content.slug, slug), eq(content.index_id, courseId), eq(content.is_deleted, false)));
});

export const checkExistingChapterLink = server$(async function (link: string) {
  return await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === '1')
    .select({ id: content.id })
    .from(content)
    .where(and(eq(content.link, link), eq(content.is_deleted, false)));
});

export const addCategorySchema = z.object({
  name: z.string().trim().min(2, 'A name is required').max(50, 'Name is too long (max. 50 chars)'),
  slug: z
    .string()
    .trim()
    .min(2, 'A slug is required')
    // .regex(/^[a-za-z0-9]+.*[a-za-z0-9]+$/, 'The slug must start and end with characters!')
    .regex(/^[-_a-z0-9]+$/, 'No special characters except hyphens and underscores are allowed'),
  link: z
    .string()
    .min(2, 'A link is required')
    .regex(/^\//, 'The link needs to start with a slash')
    .regex(/^\/[-_a-z0-9/]+$/, 'No special characters except hyphens and underscores are allowed'),
});

export const publishCourse = server$(async function (courseId: string) {
  await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === '1')
    .update(course_approval)
    .set({ ready_for_approval: true, updated_at: getSQLTimeStamp() })
    .where(eq(course_approval.course_id, courseId));
});

export const amendCourse = server$(async function (courseId: string) {
  await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === '1')
    .update(course_approval)
    .set({ status: 'pending', updated_at: getSQLTimeStamp() })
    .where(eq(course_approval.course_id, courseId));
});

export const unpublishCourse = server$(async function (courseId: string) {
  await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === '1')
    .update(course_approval)
    .set({ ready_for_approval: false, status: 'pending', updated_at: getSQLTimeStamp() })
    .where(eq(course_approval.course_id, courseId));
});

export const unlockChapter = server$(async function (chapterId: string) {
  await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === '1')
    .update(content)
    .set({ is_locked: false })
    .where(eq(content.id, chapterId));
});

export const lockChapter = server$(async function (chapterId: string) {
  await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === '1')
    .update(content)
    .set({ is_locked: true })
    .where(eq(content.id, chapterId));
});

export const unlockCourse = server$(async function (courseId: string) {
  await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === '1')
    .update(content_index)
    .set({ is_locked: false })
    .where(eq(content_index.id, courseId));
});

export const lockCourse = server$(async function (courseId: string) {
  await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === '1')
    .update(content_index)
    .set({ is_locked: true })
    .where(eq(content_index.id, courseId));
});

export const updateCourse = server$(async function (courseId: string, courseData: Partial<Omit<ContentIndex, 'id'>>) {
  await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === '1')
    .update(content_index)
    .set(courseData)
    .where(eq(content_index.id, courseId));
});

export default component$(
  ({
    ws,
    userAccessibleCourseWrite,
    userAccessibleCourseWriteResolved,
    userAccessibleCourseRead,
    tags,
    categories,
    courseIdToEditingUser,
  }: {
    ws: Signal<NoSerialize<WebSocket>>;
    userAccessibleCourseWrite: Signal<string[]>;
    userAccessibleCourseRead: Signal<string[]>;
    userAccessibleCourseWriteResolved: Signal<
      {
        content_index: ContentIndex;
        profiles: Profiles;
        course_approval: CourseApproval;
      }[]
    >;
    tags: Tag[];
    categories: ContentCategory[];
    courseIdToEditingUser: Record<string, [string, string]>;
  }) => {
    const nav = useNavigate();
    const user = useUserLoader().value;
    const courses = useStore(() =>
      Object.fromEntries(
        userAccessibleCourseWriteResolved.value.map(({ content_index, profiles, course_approval }) => {
          return [
            content_index.id,
            Object.assign({}, content_index, {
              isOpen: false,
              chapters: [] as Content[],
              isLoadingChapter: false,
              hasLoadedChapter: false,
              profile: profiles,
              chaptersMap: {} as Record<
                string,
                {
                  isDeleting: boolean;
                  movingUp: boolean;
                  movingDown: boolean;
                  lockUnlockContentCallback: QRL<() => any> | null;
                  lockContentTimeout: ReturnType<typeof setTimeout> | null;
                  lockContentError: QRL<() => any> | null;
                }
              >,
              courseApproval: course_approval,
              isPublishing: false,
              openedChaptersActions: null as null | string,
              openedCourseActions: false,
              lockUnlockContentIndexCallback: $(() => {}) as QRL<() => any> | null,
              lockContentIndexTimeout: null as ReturnType<typeof setTimeout> | null,
              lockContentIndexError: $(() => {}) as QRL<() => any> | null,
            }),
          ];
        })
      )
    );
    useTask$(({ track }) => {
      track(userAccessibleCourseWriteResolved);
      if (isServer) return;
      const keys = Object.keys(courses);
      userAccessibleCourseWriteResolved.value.forEach(async ({ content_index, profiles, course_approval }) => {
        keys.splice(keys.indexOf(content_index.id), 1);
        const hasLoadedChapter = courses[content_index.id]?.hasLoadedChapter || false;
        if (hasLoadedChapter) {
          const chapters = await getChapters(content_index.id);
          courses[content_index.id] = Object.assign({}, content_index, {
            isOpen: courses[content_index.id]?.isOpen || false,
            chapters,
            isLoadingChapter: courses[content_index.id]?.isLoadingChapter || false,
            hasLoadedChapter: true,
            profile: profiles,
            chaptersMap: Object.fromEntries(
              chapters.map((c) => [
                c.id,
                {
                  isDeleting: false,
                  movingUp: false,
                  movingDown: false,
                  lockUnlockContentCallback: courses[content_index.id]?.chaptersMap[c.id]?.lockUnlockContentCallback,
                  lockContentTimeout: courses[content_index.id]?.chaptersMap[c.id]?.lockContentTimeout,
                  lockContentError: courses[content_index.id]?.chaptersMap[c.id]?.lockContentError,
                },
              ])
            ),
            courseApproval: course_approval,
            isPublishing: courses[content_index.id]?.isPublishing || false,
            openedChaptersActions: courses[content_index.id]?.openedChaptersActions,
            openedCourseActions: !!courses[content_index.id]?.openedCourseActions,
            lockUnlockContentIndexCallback: courses[content_index.id]?.lockUnlockContentIndexCallback,
            lockContentIndexTimeout: courses[content_index.id]?.lockContentIndexTimeout,
            lockContentIndexError: courses[content_index.id]?.lockContentIndexError,
          });
        } else {
          courses[content_index.id] = Object.assign({}, content_index, {
            isOpen: courses[content_index.id]?.isOpen || false,
            chapters: [],
            isLoadingChapter: courses[content_index.id]?.isLoadingChapter || false,
            hasLoadedChapter: false,
            profile: profiles,
            chaptersMap: {},
            courseApproval: course_approval,
            isPublishing: courses[content_index.id]?.isPublishing || false,
            openedChaptersActions: courses[content_index.id]?.openedChaptersActions,
            openedCourseActions: !!courses[content_index.id]?.openedCourseActions,
            lockUnlockContentIndexCallback: courses[content_index.id]?.lockUnlockContentIndexCallback,
            lockContentIndexTimeout: courses[content_index.id]?.lockContentIndexTimeout,
            lockContentIndexError: courses[content_index.id]?.lockContentIndexError,
          });
        }
      });
      for (const i of keys) {
        delete courses[i];
      }
    });

    const displayCourses = useComputed$(() =>
      Object.values(courses).toSorted((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    );

    const isDeletingChapterCallback = useSignal<QRL<() => any> | undefined>(undefined);
    const isDeletingChapterCallbackErr = useSignal<QRL<() => any> | undefined>(undefined);
    const isDeletingChapterTimeout = useSignal<any>();

    const isDeletingChapterIndex = useSignal('');
    const isDeletingChapterIndexCallback = useSignal<QRL<() => any> | undefined>(undefined);
    const isDeletingChapterIndexTimeout = useSignal<any>();

    const showGetCode = useSignal(false);
    const showGetCodeCourseId = useSignal('');

    const showAddChapter = useSignal(false);
    const showAddCourseId = useSignal('');
    const showAddCourseChapters = useComputed$<string[]>(() =>
      showAddCourseId.value === '' ? [] : courses[showAddCourseId.value].chapter_order
    );
    const showAddCourseSlug = useComputed$<string>(() =>
      showAddCourseId.value === '' ? '' : courses[showAddCourseId.value].slug
    );

    const showEditChapter = useSignal(false);
    const showEditChapterId = useSignal('');
    const showEditCourseId = useSignal('');
    const showEditCourseData = useComputed$(() => {
      if (showEditCourseId.value === '' || showEditChapterId.value === '') return undefined;
      return courses[showEditCourseId.value].chapters.find((c) => c.id === showEditChapterId.value);
    });
    const showEditCourseSlug = useComputed$<string>(() =>
      showEditChapterId.value === '' ? '' : courses[showEditCourseId.value].slug
    );

    useTask$(({ track }) => {
      track(ws);
      if (!ws.value) return;

      ws.value.addEventListener('message', ({ data }) => {
        try {
          const d = JSON.parse(data);
          if (d.type === 'deleteContentSuccess') {
            if (isDeletingChapterCallback.value) isDeletingChapterCallback.value();
            isDeletingChapterCallback.value = undefined;
            isDeletingChapterCallbackErr.value = undefined;
            clearTimeout(isDeletingChapterTimeout.value);
            return;
          }
          if (d.type === 'deleteContentError') {
            alert(d.message);
            if (isDeletingChapterCallbackErr.value) isDeletingChapterCallbackErr.value();
            isDeletingChapterCallback.value = undefined;
            isDeletingChapterCallbackErr.value = undefined;
            clearTimeout(isDeletingChapterTimeout.value);
            return;
          }
          if (d.type === 'deleteContentIndexSuccess') {
            if (isDeletingChapterIndexCallback.value) isDeletingChapterIndexCallback.value();
            isDeletingChapterIndexCallback.value = undefined;
            clearTimeout(isDeletingChapterIndexTimeout.value);
            return;
          }
          if (d.type === 'deleteContentIndexError') {
            alert(d.message);
            isDeletingChapterIndex.value = '';
            isDeletingChapterIndexCallback.value = undefined;
            clearTimeout(isDeletingChapterIndexTimeout.value);
            return;
          }
          if (d.type === 'lockContentIndexSuccess' || d.type === 'unlockContentIndexSuccess') {
            const courseId = d.message?.courseId;
            if (courseId && courses[courseId].lockUnlockContentIndexCallback) {
              courses[courseId].lockUnlockContentIndexCallback!();
            }
            courses[courseId].lockUnlockContentIndexCallback = null;
            if (courses[courseId].lockContentIndexTimeout) clearTimeout(courses[courseId].lockContentIndexTimeout!);
            return;
          }
          if (d.type === 'lockContentIndexFailed' || d.type === 'unlockContentIndexFailed') {
            alert(d.message);
            const courseId = d.courseId;
            courses[courseId].lockUnlockContentIndexCallback = null;
            if (courses[courseId].lockContentIndexTimeout) clearTimeout(courses[courseId].lockContentIndexTimeout!);
            return;
          }

          if (d.type === 'lockContentSuccess' || d.type === 'unlockContentSuccess') {
            const courseId = d.message?.courseId;
            const chapterId = d.message?.contentId;
            if (courseId && chapterId && courses[courseId].chaptersMap[chapterId].lockUnlockContentCallback) {
              courses[courseId].chaptersMap[chapterId].lockUnlockContentCallback!();
            }
            courses[courseId].chaptersMap[chapterId].lockUnlockContentCallback = null;
            if (courses[courseId].chaptersMap[chapterId].lockContentTimeout)
              clearTimeout(courses[courseId].chaptersMap[chapterId].lockContentTimeout!);
            return;
          }
          if (d.type === 'lockContentFailed' || d.type === 'unlockContentFailed') {
            alert(d.message);
            const courseId = d.courseId;
            const chapterId = d.contentId;
            courses[courseId].chaptersMap[chapterId].lockUnlockContentCallback = null;
            if (courses[courseId].chaptersMap[chapterId].lockContentTimeout)
              clearTimeout(courses[courseId].chaptersMap[chapterId].lockContentTimeout!);
            return;
          }
          if (
            d.type === 'contentDeleted' ||
            d.type === 'contentIndexDeleted' ||
            d.type === 'contentIndexDetailsEdited' ||
            d.type === 'chapterCreated' ||
            d.type === 'contentCreated' ||
            d.type === 'contentIndexLockedUnlocked' ||
            d.type === 'contentLockedUnlocked' ||
            d.type === 'contentDetailsEdited' ||
            d.type === 'contentPositionMoved'
          ) {
            nav();
            return;
          }
        } catch (e) {
          console.error(e);
        }
      });
    });

    const handleDeleteContentIndex = $(async (courseId: string) => {
      if (isDeletingChapterIndex.value || !ws.value) return;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!courses[courseId]) return alert('Something went wrong! Please refresh the page and try again.');
      if (!window.confirm('Are you sure you want to delete this course?')) return;
      isDeletingChapterIndex.value = courseId;
      isDeletingChapterIndexCallback.value = $(async () => {
        try {
          await deleteCourse(courseId);
        } catch (e) {
          console.error(e);
          return alert('An error occurred! Please refresh the page and try again or contact support.');
        }
        isDeletingChapterIndex.value = '';
        ws.value?.send(
          JSON.stringify({
            type: 'deleteContentIndexCB',
            courseId,
          })
        );
      });
      isDeletingChapterIndexTimeout.value = setTimeout(() => {
        alert('Server Timeout! Please try again later or contact support.');
        isDeletingChapterIndexCallback.value = undefined;
        isDeletingChapterIndex.value = '';
      }, 7000);
      ws.value.send(
        JSON.stringify({
          type: 'deleteContentIndex',
          userId: user.userId,
          courseId,
          contentId: courses[courseId].chapter_order,
        })
      );
    });

    const refreshChapters = $(async (id: string) => {
      courses[id].isLoadingChapter = true;
      const chapters = await getChapters(id);
      courses[id].chapters = chapters;
      courses[id].chaptersMap = Object.fromEntries(
        chapters.map((c) => [
          c.id,
          {
            isDeleting: false,
            movingUp: false,
            movingDown: false,
            lockUnlockContentCallback: null,
            lockContentTimeout: null,
            lockContentError: null,
          },
        ])
      );
      courses[id].isLoadingChapter = false;
      courses[id].hasLoadedChapter = true;
    });

    const handleDeleteContent = $(async (chapterId: string, courseId: string) => {
      if (courses[courseId].chaptersMap[chapterId].isDeleting || !ws.value || !!isDeletingChapterCallback.value) return;

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!courses[courseId]) return alert('Something went wrong! Please refresh the page and try again.');
      if (!window.confirm('Are you sure you want to delete this chapter?')) return;
      courses[courseId].chaptersMap[chapterId].isDeleting = true;
      isDeletingChapterCallback.value = $(async () => {
        try {
          await deleteChapter(chapterId);
          ws.value?.send(
            JSON.stringify({
              type: 'deleteContentCB',
              courseId,
              contentId: chapterId,
            })
          );
          // courses[courseId].chaptersMap[chapterId].isDeleting = false;
          // refreshChapters(courseId);
        } catch (e) {
          console.error(e);
          return alert('An error occurred! Please refresh the page and try again or contact support.');
        }
      });
      isDeletingChapterCallbackErr.value = $(() => {
        courses[courseId].chaptersMap[chapterId].isDeleting = false;
      });
      isDeletingChapterTimeout.value = setTimeout(() => {
        alert('Server Timeout! Please try again later or contact support.');
        isDeletingChapterCallback.value = undefined;
        if (isDeletingChapterCallbackErr.value) isDeletingChapterCallbackErr.value();
        isDeletingChapterCallbackErr.value = undefined;
      }, 7000);
      ws.value.send(
        JSON.stringify({
          type: 'deleteContent',
          userId: user.userId,
          courseId,
          contentId: chapterId,
        })
      );
    });

    const handlePublish = $(async (courseId: string, userId: string) => {
      if (courses[courseId].isPublishing) return;
      if (courses[courseId].is_locked && courses[courseId].author !== userId && user.role !== 'admin')
        return alert('Course is locked. You cannot publish the course!');
      if (!window.confirm('Are you sure you want to publish this course?')) return;

      if (courses[courseId].isPublishing) return;
      courses[courseId].isPublishing = true;
      try {
        await publishCourse(courseId);
        courses[courseId].courseApproval.ready_for_approval = true;
      } catch (e) {
        console.error(e);
        alert('Something went wrong! Please refresh the page and try again or contact support!');
      }
      courses[courseId].isPublishing = false;
      nav();
    });

    const handleAmendment = $(async (courseId: string, userId: string) => {
      if (courses[courseId].is_locked && courses[courseId].author !== userId && user.role !== 'admin')
        return alert('Course is locked. You cannot re-publish the course!');
      if (!window.confirm('Are you sure you want to re-publish this course?')) return;

      if (courses[courseId].isPublishing) return;
      courses[courseId].isPublishing = true;
      try {
        await amendCourse(courseId);
        courses[courseId].courseApproval.ready_for_approval = true;
      } catch (e) {
        console.error(e);
        alert('Something went wrong! Please refresh the page and try again or contact support!');
      }
      courses[courseId].isPublishing = false;
      nav();
    });

    const handleUnpublish = $(async (courseId: string, userId: string) => {
      if (courses[courseId].is_locked && courses[courseId].author !== userId && user.role !== 'admin')
        return alert('Course is locked. You cannot unpublish the course!');
      if (!window.confirm('Are you sure you want to unpublish this course?')) return;

      if (courses[courseId].isPublishing) return;
      courses[courseId].isPublishing = true;
      try {
        await unpublishCourse(courseId);
        courses[courseId].courseApproval.ready_for_approval = false;
      } catch (e) {
        console.error(e);
        alert('Something went wrong! Please refresh the page and try again or contact support!');
      }
      courses[courseId].isPublishing = false;
      nav();
    });

    const handleLockUnlockChapter = $(async (chapterId: string, courseId: string, userId: string) => {
      if (!courses[courseId] || !ws.value) return alert('Something went wrong! Please refresh the page and try again.');
      if (courses[courseId].profile.id !== userId)
        return alert('You do not have permission to lock/unlock the course!');
      const chapter = courses[courseId].chapters.find((chapter) => chapter.id === chapterId);
      if (!chapter) return alert('Something went wrong! Please refresh the page and try again.');
      if (chapter.is_locked) {
        ws.value.send(
          JSON.stringify({
            type: 'unlockContent',
            contentId: chapterId,
            courseId,
            userId,
          })
        );
        courses[courseId].chaptersMap[chapterId].lockUnlockContentCallback = $(async () => {
          await unlockChapter(chapterId);
          ws.value?.send(
            JSON.stringify({
              type: 'lockUnlockContentCB',
              contentId: chapterId,
              courseId,
            })
          );
        });
      } else {
        if (
          courseIdToEditingUser[chapterId] &&
          !window.confirm(
            'Are you sure you want to lock this chapter? Someone is already editing it and all changes will be lost.'
          )
        )
          return;
        else if (
          !window.confirm('Are you sure you want to lock this chapter? Only you will be able to edit this chapter.')
        )
          return;
        ws.value?.send(
          JSON.stringify({
            type: 'lockContent',
            contentId: chapterId,
            courseId,
            userId,
          })
        );
        courses[courseId].chaptersMap[chapterId].lockUnlockContentCallback = $(async () => {
          await lockChapter(chapterId);
          ws.value?.send(
            JSON.stringify({
              type: 'lockUnlockContentCB',
              contentId: chapterId,
              courseId,
            })
          );
        });
      }
    });

    const handleLockUnlockCourse = $(async (courseId: string, userId: string) => {
      if (!courses[courseId]) return alert('Something went wrong! Please refresh the page and try again.');
      if (courses[courseId].profile.id !== userId)
        return alert('You do not have permission to lock/unlock the course!');
      if (courses[courseId].is_locked) {
        ws.value?.send(
          JSON.stringify({
            type: 'unlockContentIndex',
            contentId: courses[courseId].chapter_order,
            courseId,
            userId,
          })
        );
        courses[courseId].lockUnlockContentIndexCallback = $(async () => {
          await unlockCourse(courseId);
          ws.value?.send(
            JSON.stringify({
              type: 'lockUnlockContentIndexCB',
              courseId,
            })
          );
        });
      } else {
        const isEditing = courses[courseId].chapter_order.filter((id) => !!courseIdToEditingUser[id]);
        if (
          isEditing.length > 0 &&
          !window.confirm(
            'Are you sure you want to lock this course? Someone is already editing it and all changes will be lost.'
          )
        )
          return;
        else if (
          !window.confirm('Are you sure you want to lock this course? Only you will be able to edit this course.')
        )
          return;
        ws.value?.send(
          JSON.stringify({
            type: 'lockContentIndex',
            contentId: courses[courseId].chapter_order,
            courseId,
            userId,
          })
        );
        courses[courseId].lockUnlockContentIndexCallback = $(async () => {
          await lockCourse(courseId);
          ws.value?.send(
            JSON.stringify({
              type: 'lockUnlockContentIndexCB',
              courseId,
            })
          );
        });
      }
    });

    const handleEditChapter = $((chapterId: string, courseId: string) => {
      if (courseIdToEditingUser[chapterId]) {
        return alert('Someone is already editing this chapter!');
      }
      if (courses[courseId].is_locked && user.role !== 'admin' && courses[courseId].author !== user.userId) {
        return alert('This course is locked!');
      }
      window.open(`/contenteditor?courseId=${courseId}&chapterId=${chapterId}`);
    });

    const handleMoveContentUp = $(async (chapterId: string, courseId: string, chapter_order: string[]) => {
      const filteredChapterOrder = chapter_order.filter(
        (chapter) =>
          courses[courseId].chapters.find((c) => c.id === chapter) &&
          !courses[courseId].chapters.find((c) => c.id === chapter)!.is_deleted
      );
      const index = filteredChapterOrder.indexOf(chapterId);
      if (index <= 0) return;
      const mappedChapter = chapter_order.indexOf(filteredChapterOrder[index]);
      const mappedPrevChapter = chapter_order.indexOf(filteredChapterOrder[index - 1]);
      if (mappedPrevChapter < -1 || mappedChapter < -1)
        return window.alert('Something went wrong! Please refresh the page again try again or contact support.');

      courses[courseId].chaptersMap[chapterId].movingUp = true;

      const newChapterOrder = [...chapter_order];
      const temp = newChapterOrder[mappedPrevChapter];
      newChapterOrder[mappedPrevChapter] = newChapterOrder[mappedChapter];
      newChapterOrder[mappedChapter] = temp;

      await updateCourse(courseId, { chapter_order: newChapterOrder } as const);

      ws.value?.send(
        JSON.stringify({
          type: 'moveContentPosition',
          courseId,
          details: {
            chapter_order: newChapterOrder,
          },
        })
      );
    });

    const handleMoveContentDown = $(async (chapterId: string, courseId: string, chapter_order: string[]) => {
      const filteredChapterOrder = chapter_order.filter(
        (chapter) =>
          courses[courseId].chapters.find((c) => c.id === chapter) &&
          !courses[courseId].chapters.find((c) => c.id === chapter)!.is_deleted
      );
      const index = filteredChapterOrder.indexOf(chapterId);
      if (index < 0 || index >= filteredChapterOrder.length - 1) return;
      const mappedChapter = chapter_order.indexOf(filteredChapterOrder[index]);
      const mappedPrevChapter = chapter_order.indexOf(filteredChapterOrder[index + 1]);
      if (mappedPrevChapter < -1 || mappedChapter < -1)
        return window.alert('Something went wrong! Please refresh the page again try again or contact support.');

      courses[courseId].chaptersMap[chapterId].movingDown = true;

      const newChapterOrder = [...chapter_order];
      const temp = newChapterOrder[mappedPrevChapter];
      newChapterOrder[mappedPrevChapter] = newChapterOrder[mappedChapter];
      newChapterOrder[mappedChapter] = temp;

      await updateCourse(courseId, { chapter_order: newChapterOrder } as const);

      ws.value?.send(
        JSON.stringify({
          type: 'moveContentPosition',
          courseId,
          details: {
            chapter_order: newChapterOrder,
          },
        })
      );
    });

    return (
      <>
        {showGetCodeCourseId.value && showGetCode.value && (
          <GetCode
            userRole={user.role}
            userId={user.userId}
            author={courses[showGetCodeCourseId.value].author}
            isLocked={courses[showGetCodeCourseId.value].is_locked}
            showGetCode={showGetCode}
            contentId={showGetCodeCourseId.value}
          />
        )}
        {showAddChapter.value && showAddCourseId.value && (
          <AddChapter
            userRole={user.role}
            userId={user.userId}
            author={courses[showAddCourseId.value].author}
            isLocked={courses[showAddCourseId.value].is_locked}
            showAddChapter={showAddChapter}
            courseId={showAddCourseId}
            courseChapters={showAddCourseChapters}
            courseSlug={showAddCourseSlug}
            callBackOnCreate={$((chapter) => {
              // courses[showAddCourseId.value].chapter_order.push(chapter.id);
              // refreshChapters(showAddCourseId.value);
              ws.value?.send(
                JSON.stringify({
                  type: 'createChapter',
                  courseId: showAddCourseId.value,
                  chapterId: chapter.id,
                  details: chapter,
                })
              );
            })}
          />
        )}
        {showEditChapter.value && showEditChapterId.value && showEditCourseId.value && showEditCourseData.value && (
          <EditChapter
            userRole={user.role}
            userId={user.userId}
            author={courses[showEditCourseId.value].author}
            isLocked={courses[showEditCourseId.value].is_locked}
            showEditChapter={showEditChapter}
            courseId={showEditCourseId}
            callBackOnSave={$((chapter) => {
              // refreshChapters(showEditCourseId.value);
              ws.value?.send(
                JSON.stringify({
                  type: 'editContentDetails',
                  courseId: showEditCourseId.value,
                  chapterId: showEditChapterId.value,
                  details: chapter,
                })
              );
            })}
            courseData={showEditCourseData.value}
            courseSlug={showEditCourseSlug}
          />
        )}
        <div class="mx-auto flex w-full flex-col md:w-[90%] lg:w-[80%]">
          <h1 class="font-mosk text-2xl font-bold tracking-wide lg:text-3xl">Your Courses</h1>
          <div class="mt-3 h-[2px] w-full bg-primary-dark-gray dark:bg-background-light-gray"></div>
          <div class="mt-3 flex items-center gap-3 lg:mt-6">
            <div>
              <a
                target="_blank"
                href={'/creator/create-course/'}
                class="inline-block rounded-lg bg-primary-dark-gray px-4 py-2 text-background-light-gray shadow-lg dark:bg-highlight-dark lg:px-6 lg:py-3 "
              >
                Create New Course
              </a>
            </div>

            <div>
              <button
                onClick$={async () => {
                  const code = window.prompt('Plz enter the code. Courses Only!');
                  if (!code) return;
                  const ret = await addEditableCourse(
                    code,
                    userAccessibleCourseWrite.value,
                    userAccessibleCourseRead.value,
                    user.userId
                  );
                  if (!ret.success) return alert('Unable to add course. Please contact support!');
                  await nav();
                }}
                class="inline-block rounded-lg bg-primary-dark-gray px-4 py-2 text-background-light-gray shadow-lg dark:bg-highlight-dark lg:px-6 lg:py-3 "
              >
                Enter Code
              </button>
            </div>
          </div>
          <section>
            {!ws.value && (
              <span class="mt-3 inline-block lg:mt-6">
                <LoadingSVG />
              </span>
            )}
            {ws.value && (
              <>
                {displayCourses.value.length === 0 && (
                  <p class="mt-3 lg:mt-6">You have not created any courses yet. ヾ(•ω•`)o</p>
                )}
                {displayCourses.value.length > 0 && (
                  <ul class="flex flex-col gap-2 py-3 pb-48 lg:py-6 lg:pb-48">
                    {displayCourses.value.map((currentCourse) => {
                      const displayChapters = courses[currentCourse.id].chapter_order.filter((chapter) => {
                        const t = courses[currentCourse.id].chapters.find((c) => c.id === chapter);
                        return t && !t.is_deleted;
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
                              courses[currentCourse.id].isOpen = !courses[currentCourse.id].isOpen;
                              if (courses[currentCourse.id].hasLoadedChapter) return;
                              refreshChapters(currentCourse.id);
                            }}
                            class="flex cursor-pointer items-center justify-between"
                            role="button"
                          >
                            <div class="flex flex-col lg:gap-1">
                              <h2 class="text-lg font-bold tracking-wide">{courses[currentCourse.id].name}</h2>
                              <p class="flex items-center gap-2">
                                <span class="text-xs tracking-wide lg:text-sm">
                                  {new Date(courses[currentCourse.id].updated_at).toDateString()},{' '}
                                  {displayNamesLang[courses[currentCourse.id].lang as keyof typeof displayNamesLang]}
                                </span>
                                <span>
                                  <img
                                    src={currentCourse.profile.avatar_url}
                                    alt=""
                                    width={20}
                                    height={20}
                                    class="h-[16px] w-[16px] rounded-full lg:h-[20px] lg:w-[20px]"
                                  />
                                </span>
                              </p>
                              {currentCourse.is_single_page && (
                                <p class="-ml-1 mt-2 flex items-center gap-2 p-1 md:hidden">
                                  <span class="items-center gap-3">
                                    <a
                                      class="whitespace-nowrap rounded-lg bg-primary-dark-gray px-3 py-1 text-[0.875rem] text-background-light-gray md:px-6 md:py-3 md:shadow-md lg:text-[1rem]"
                                      href={`/contenteditor?courseId=${currentCourse.id}&chapterId=${
                                        courses[currentCourse.id].chapter_order[0]
                                      }`}
                                      target="_blank"
                                    >
                                      Edit Content
                                    </a>
                                  </span>
                                  {!!courseIdToEditingUser[currentCourse.chapter_order[0]] && (
                                    <span>
                                      <img
                                        src={courseIdToEditingUser[currentCourse.chapter_order[0]][1]}
                                        alt=""
                                        width={30}
                                        height={30}
                                        class="h-[20px] w-[20px] rounded-full"
                                      />
                                    </span>
                                  )}
                                </p>
                              )}
                            </div>
                            <div class="flex items-center gap-2">
                              {currentCourse.is_single_page && (
                                <div class="hidden items-center gap-3 md:flex">
                                  {!!courseIdToEditingUser[currentCourse.chapter_order[0]] && (
                                    <span>
                                      <img
                                        src={courseIdToEditingUser[currentCourse.chapter_order[0]][1]}
                                        alt=""
                                        width={30}
                                        height={30}
                                        class="h-[25px] w-[25px] rounded-full lg:h-[30px] lg:w-[30px]"
                                      />
                                    </span>
                                  )}
                                  <a
                                    class="rounded-lg bg-primary-dark-gray px-4 py-2 text-[0.875rem] text-background-light-gray shadow-md md:px-6 md:py-3 lg:text-[1rem]"
                                    href={`/contenteditor?courseId=${currentCourse.id}&chapterId=${
                                      courses[currentCourse.id].chapter_order[0]
                                    }`}
                                    target="_blank"
                                  >
                                    Edit Content
                                  </a>
                                </div>
                              )}
                              <div class="flex items-center gap-2">
                                <div class="p-1 md:p-2">
                                  <span
                                    style={{
                                      transform: courses[currentCourse.id].isOpen ? 'rotateZ(180deg)' : '',
                                    }}
                                    class={
                                      'inline-block text-[15px] text-primary-dark-gray dark:text-background-light-gray'
                                    }
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
                                      aria-expanded={courses[currentCourse.id].openedCourseActions}
                                      aria-haspopup={courses[currentCourse.id].openedCourseActions}
                                      onClick$={(e) => {
                                        e.stopPropagation();
                                        courses[currentCourse.id].openedCourseActions =
                                          !courses[currentCourse.id].openedCourseActions;
                                      }}
                                    >
                                      <span class="sr-only">Open options</span>
                                      <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                                      </svg>
                                    </button>
                                  </div>
                                  {courses[currentCourse.id].openedCourseActions && (
                                    <DropDownTransition
                                      open={courses[currentCourse.id].openedCourseActions}
                                      class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg border-2 border-primary-dark-gray bg-background-light-gray dark:bg-primary-dark-gray"
                                      role="menu"
                                      aria-orientation="vertical"
                                      aria-labelledby={'menu-button-course' + currentCourse.id}
                                      tabIndex={-1}
                                    >
                                      <div class="flex flex-col py-1 [&>button]:text-left" role="none">
                                        <a
                                          target="_blank"
                                          href={`/creator/edit-course/${currentCourse.id}/`}
                                          class="block px-4 py-2 text-sm "
                                          role="menuitem"
                                          tabIndex={-1}
                                          id={'menu-item-0' + currentCourse.id}
                                          onClick$={(e) => e.stopPropagation()}
                                        >
                                          Edit Settings
                                        </a>
                                        <a
                                          target="_blank"
                                          href={courses[currentCourse.id].link!}
                                          class="block px-4 py-2 text-sm "
                                          role="menuitem"
                                          tabIndex={-1}
                                          id={'menu-item-1' + currentCourse.id}
                                          onClick$={(e) => e.stopPropagation()}
                                        >
                                          View {courses[currentCourse.id].is_guide ? 'Guide' : 'Course'}
                                        </a>
                                        <button
                                          class="block px-4 py-2 text-sm "
                                          role="menuitem"
                                          tabIndex={-1}
                                          id={'menu-item-2' + currentCourse.id}
                                          onClick$={(e) => {
                                            e.stopPropagation();
                                            handleLockUnlockCourse(currentCourse.id, user.userId);
                                          }}
                                        >
                                          {courses[currentCourse.id].is_locked && <span>Unlock Course</span>}
                                          {!courses[currentCourse.id].is_locked && <span>Lock Course</span>}
                                        </button>
                                        <button
                                          class="block px-4 py-2 text-sm "
                                          role="menuitem"
                                          tabIndex={-1}
                                          id={'menu-item-3' + currentCourse.id}
                                          onClick$={(e) => {
                                            e.stopPropagation();
                                            if (
                                              courses[currentCourse.id].is_locked &&
                                              user.userId !== courses[currentCourse.id].author &&
                                              user.role !== 'admin'
                                            )
                                              return alert('The Course is locked! You cannot add a chapter!.');

                                            showAddChapter.value = true;
                                            showAddCourseId.value = currentCourse.id;
                                          }}
                                        >
                                          Add Chapter
                                        </button>
                                        {!courses[currentCourse.id].courseApproval.ready_for_approval &&
                                          courses[currentCourse.id].courseApproval.status === 'pending' && (
                                            <button
                                              class="block px-4 py-2 text-sm "
                                              role="menuitem"
                                              tabIndex={-1}
                                              id={'menu-item-4' + currentCourse.id}
                                              onClick$={(e) => {
                                                e.stopPropagation();
                                                handlePublish(currentCourse.id, user.userId);
                                              }}
                                            >
                                              {courses[currentCourse.id].isPublishing && (
                                                <span>
                                                  <LoadingSVG />
                                                </span>
                                              )}
                                              {!courses[currentCourse.id].isPublishing && <span>Publish Course</span>}
                                            </button>
                                          )}
                                        {courses[currentCourse.id].courseApproval.ready_for_approval &&
                                          courses[currentCourse.id].courseApproval.status === 'pending' && (
                                            <button
                                              class="block px-4 py-2 text-sm "
                                              role="menuitem"
                                              tabIndex={-1}
                                              id={'menu-item-5' + currentCourse.id}
                                              onClick$={(e) => {
                                                e.stopPropagation();
                                                handleUnpublish(currentCourse.id, user.userId);
                                              }}
                                            >
                                              {courses[currentCourse.id].isPublishing && (
                                                <span>
                                                  <LoadingSVG />
                                                </span>
                                              )}
                                              {!courses[currentCourse.id].isPublishing && <span>Cancel Publish</span>}
                                            </button>
                                          )}
                                        {courses[currentCourse.id].courseApproval.status === 'approved' && (
                                          <button
                                            class="block px-4 py-2 text-sm "
                                            role="menuitem"
                                            tabIndex={-1}
                                            id={'menu-item-6' + currentCourse.id}
                                            onClick$={(e) => {
                                              e.stopPropagation();
                                              handleUnpublish(currentCourse.id, user.userId);
                                            }}
                                          >
                                            {courses[currentCourse.id].isPublishing && (
                                              <span>
                                                <LoadingSVG />
                                              </span>
                                            )}
                                            {!courses[currentCourse.id].isPublishing && <span>Unpublish Course</span>}
                                          </button>
                                        )}
                                        {courses[currentCourse.id].courseApproval.status === 'need_amendment' && (
                                          <button
                                            class="block px-4 py-2 text-sm "
                                            role="menuitem"
                                            tabIndex={-1}
                                            id={'menu-item-7' + currentCourse.id}
                                            onClick$={(e) => {
                                              e.stopPropagation();
                                              handleAmendment(currentCourse.id, user.userId);
                                            }}
                                          >
                                            {courses[currentCourse.id].isPublishing && (
                                              <span>
                                                <LoadingSVG />
                                              </span>
                                            )}
                                            {!courses[currentCourse.id].isPublishing && <span>Publish Again</span>}
                                          </button>
                                        )}
                                      </div>
                                    </DropDownTransition>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="flex flex-col gap-2">
                            <p class="flex flex-col gap-2 text-[0.875rem] lg:gap-3 lg:text-[1rem]">
                              {!courses[currentCourse.id].courseApproval.ready_for_approval &&
                                courses[currentCourse.id].courseApproval.status === 'pending' && (
                                  <span class="inline-flex items-center gap-2">
                                    <span class="mt-[-2px] inline-block text-[16px] text-primary-dark-gray dark:text-background-light-gray lg:text-[20px]">
                                      <LuInfo />
                                    </span>
                                    Not Published
                                  </span>
                                )}

                              {courses[currentCourse.id].courseApproval.ready_for_approval &&
                                courses[currentCourse.id].courseApproval.status === 'pending' && (
                                  <span class="inline-flex items-center gap-2">
                                    <span class=" text-[16px] text-primary-dark-gray dark:text-background-light-gray lg:text-[20px]">
                                      <LuHourglass />
                                    </span>
                                    Pending for Approval
                                  </span>
                                )}

                              {courses[currentCourse.id].courseApproval.status === 'approved' && (
                                <span class="inline-flex items-center gap-2">
                                  <span class=" text-[16px] text-mint-down lg:text-[20px]">
                                    <LuCheck />
                                  </span>
                                  Published
                                </span>
                              )}

                              {courses[currentCourse.id].courseApproval.status === 'rejected' && (
                                <span class="inline-flex items-center gap-2 text-tomato">
                                  <span class=" text-[16px] lg:text-[20px]">
                                    <LuBan />
                                  </span>
                                  Unable to Publish
                                </span>
                              )}

                              {courses[currentCourse.id].courseApproval.status === 'need_amendment' && (
                                <span class="inline-flex items-center gap-2 text-tomato">
                                  <span class=" text-[16px] lg:text-[20px]">
                                    <LuAlertTriangle />
                                  </span>
                                  Amendment Needed
                                </span>
                              )}
                            </p>
                            {courses[currentCourse.id].courseApproval.status === 'need_amendment' && (
                              <p class="flex flex-col items-start text-sm  md:flex-row md:gap-2 md:text-base">
                                <span>Details:</span>
                                <span class="inline-block  md:max-w-[350px] ">
                                  {courses[currentCourse.id].courseApproval.need_amendment_reason}
                                </span>
                              </p>
                            )}
                            {courses[currentCourse.id].courseApproval.status === 'rejected' && (
                              <p class="flex flex-col items-start text-sm  md:flex-row md:gap-2 md:text-base">
                                <span>Details:</span>
                                <span class="inline-block  md:max-w-[350px] ">
                                  {courses[currentCourse.id].courseApproval.rejected_reason}
                                </span>
                              </p>
                            )}
                          </div>
                          {courses[currentCourse.id].isOpen ? (
                            courses[currentCourse.id].isLoadingChapter ? (
                              <span class="mt-4 lg:mt-6">
                                <LoadingSVG />
                              </span>
                            ) : (
                              <div class="text-[0.875rem] lg:text-[1rem]">
                                <div class="flex items-center pb-2">
                                  <h3 class="w-[30%]">Author:</h3>
                                  <p class={`w-[70%]`}>
                                    <span class="flex items-center gap-2">
                                      <span>
                                        <img
                                          src={currentCourse.profile.avatar_url}
                                          alt=""
                                          width={30}
                                          height={30}
                                          class="h-[25px] w-[25px] rounded-full lg:h-[30px] lg:w-[30px]"
                                        />
                                      </span>
                                      <span>{currentCourse.profile.nickname}</span>
                                    </span>
                                  </p>
                                </div>
                                <div class="flex gap-4 pb-2">
                                  <h3 class="w-[30%]">Course Language:</h3>
                                  <p class={`w-[70%]`}>
                                    {
                                      listSupportedLang.find((lang) => lang.value === courses[currentCourse.id].lang)!
                                        .label
                                    }
                                  </p>
                                </div>
                                {user.role === 'admin' && (
                                  <div class="flex gap-4 pb-2">
                                    <h3 class="w-[30%]">Supported Languages:</h3>
                                    <p class={`w-[70%]`}>
                                      {courses[currentCourse.id].supported_lang
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
                                  <p class={`w-[70%]`}>
                                    {new Date(courses[currentCourse.id].updated_at).toDateString()}
                                  </p>
                                </div>

                                {courses[currentCourse.id].category && (
                                  <div class="flex gap-4 pb-2">
                                    <h3 class="w-[30%]">Category:</h3>
                                    <p class={`w-[70%]`}>
                                      {categories.find(
                                        (category) => category.id === courses[currentCourse.id].category
                                      ) && (
                                        <a
                                          target="_blank"
                                          href={
                                            categories.find(
                                              (category) => category.id === courses[currentCourse.id].category
                                            )!.link
                                          }
                                          class={`border-b-2 border-primary-dark-gray dark:border-background-light-gray`}
                                        >
                                          {
                                            categories.find(
                                              (category) => category.id === courses[currentCourse.id].category
                                            )!.name
                                          }
                                        </a>
                                      )}
                                    </p>
                                  </div>
                                )}

                                {courses[currentCourse.id].tags &&
                                  courses[currentCourse.id].tags!.filter((tag) => tags.find((tag2) => tag2.id === tag))
                                    .length > 0 && (
                                    <div class="flex gap-4 pb-2">
                                      <h3 class="w-[30%]">Tags:</h3>
                                      <ul class="flex w-[70%] flex-wrap gap-x-4 gap-y-2">
                                        {(courses[currentCourse.id].tags || [])
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

                                <div
                                  class="mt-4 flex gap-4 pb-2 lg:mt-6"
                                  title="Checks if the course is visible to everyone."
                                >
                                  <p class="flex items-center gap-2">
                                    {courses[currentCourse.id].is_private && (
                                      <span class="text-[15px] text-primary-dark-gray dark:text-background-light-gray lg:text-[20px]">
                                        <LuEyeOff />
                                      </span>
                                    )}
                                    {!courses[currentCourse.id].is_private && (
                                      <span class="text-[15px] text-primary-dark-gray dark:text-background-light-gray lg:text-[20px]">
                                        <LuEye />
                                      </span>
                                    )}
                                    <span>
                                      {courses[currentCourse.id].is_private
                                        ? 'Only people with invite codes can view'
                                        : 'Open to everyone'}
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
                                          (courses[currentCourse.id].is_premium ? 'text-tomato' : 'text-gray-300')
                                        }
                                      >
                                        <LuGem />
                                      </span>
                                      <span>
                                        {courses[currentCourse.id].is_premium
                                          ? 'Subscription Required'
                                          : 'Subscription Not Required'}
                                      </span>
                                    </p>
                                  </div>
                                )}

                                <div class="flex gap-4" title="If a course is locked, the content cannot be edited.">
                                  <p class="flex items-center gap-2">
                                    <span
                                      class={
                                        'text-[15px] text-primary-dark-gray dark:text-background-light-gray lg:text-[20px]'
                                      }
                                    >
                                      {courses[currentCourse.id].is_locked ? <LuLock /> : <LuUnlock />}
                                    </span>
                                    <span>
                                      {courses[currentCourse.id].is_locked
                                        ? 'Only you can edit'
                                        : 'Anyone with permission can edit'}
                                    </span>
                                  </p>
                                </div>

                                <div class="mt-4 flex flex-col gap-2 py-2 lg:mt-6">
                                  <div class="flex items-start gap-4">
                                    <h3 class="w-[30%] leading-5">Short Description:</h3>
                                    <p class={`w-[80%] whitespace-pre-line leading-5`}>
                                      {courses[currentCourse.id].short_description}
                                    </p>
                                  </div>
                                  <div class="flex items-start gap-4">
                                    <h3 class="w-[30%] leading-5">Description:</h3>
                                    <p class={`w-[80%] whitespace-pre-line leading-5`}>
                                      {courses[currentCourse.id].description}
                                    </p>
                                  </div>
                                </div>
                                {!courses[currentCourse.id].is_single_page &&
                                  courses[currentCourse.id].isLoadingChapter && (
                                    <span>
                                      <LoadingSVG />
                                    </span>
                                  )}
                                {!courses[currentCourse.id].is_single_page &&
                                  courses[currentCourse.id].hasLoadedChapter && (
                                    <>
                                      <div class="flex items-center gap-2 py-4">
                                        <h3 class="font-bold tracking-wide">Chapters</h3>
                                      </div>
                                      {displayChapters.length === 0 && (
                                        <p class="pb-4">No chapters yet. Start by adding a chapter :P</p>
                                      )}
                                      {displayChapters.length > 0 && (
                                        <ul class="flex flex-col gap-3 pb-4 lg:gap-4">
                                          {displayChapters.map((_chapterId) => {
                                            const chapter = courses[currentCourse.id].chapters.find(
                                              (c) => c.id === _chapterId
                                            );
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
                                                <div class="flex items-center gap-2 text-[15px] text-primary-dark-gray dark:text-background-light-gray lg:text-[20px]">
                                                  {!!courseIdToEditingUser[chapter.id] && (
                                                    <span>
                                                      <img
                                                        src={courseIdToEditingUser[chapter.id][1]}
                                                        alt=""
                                                        width={25}
                                                        height={25}
                                                        class="rounded-full"
                                                      />
                                                    </span>
                                                  )}
                                                  <div class="relative inline-block text-left">
                                                    <div>
                                                      <button
                                                        type="button"
                                                        class="flex items-center rounded-full focus:outline-none "
                                                        id={'menu-button-chapter' + chapter.id}
                                                        aria-expanded={
                                                          courses[currentCourse.id].openedChaptersActions === chapter.id
                                                        }
                                                        aria-haspopup={
                                                          courses[currentCourse.id].openedChaptersActions === chapter.id
                                                        }
                                                        onClick$={() => {
                                                          if (
                                                            courses[currentCourse.id].openedChaptersActions ===
                                                            chapter.id
                                                          )
                                                            courses[currentCourse.id].openedChaptersActions = null;
                                                          else
                                                            courses[currentCourse.id].openedChaptersActions =
                                                              chapter.id;
                                                        }}
                                                      >
                                                        <span class="sr-only">Open options</span>
                                                        <svg
                                                          class="h-5 w-5"
                                                          viewBox="0 0 20 20"
                                                          fill="currentColor"
                                                          aria-hidden="true"
                                                        >
                                                          <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                                                        </svg>
                                                      </button>
                                                    </div>
                                                    <DropDownTransition
                                                      open={
                                                        courses[currentCourse.id].openedChaptersActions === chapter.id
                                                      }
                                                      class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg border-2 border-primary-dark-gray bg-background-light-gray dark:bg-primary-dark-gray"
                                                      role="menu"
                                                      aria-orientation="vertical"
                                                      aria-labelledby={'menu-button-chapter' + chapter.id}
                                                      tabIndex={-1}
                                                    >
                                                      <div class="flex flex-col py-1 [&>button]:text-left" role="none">
                                                        <button
                                                          class="block px-4 py-2 text-sm "
                                                          role="menuitem"
                                                          tabIndex={-1}
                                                          id={'menu-item-0' + chapter.id}
                                                          onClick$={() =>
                                                            handleEditChapter(chapter.id, currentCourse.id)
                                                          }
                                                        >
                                                          Edit Content
                                                        </button>
                                                        <button
                                                          class="block px-4 py-2 text-sm "
                                                          role="menuitem"
                                                          tabIndex={-1}
                                                          id={'menu-item-1' + chapter.id}
                                                          onClick$={() => {
                                                            if (
                                                              courses[currentCourse.id].is_locked &&
                                                              user.userId !== courses[currentCourse.id].author &&
                                                              user.role !== 'admin'
                                                            )
                                                              return alert(
                                                                'Course is locked! You cannot edit a chapter.'
                                                              );
                                                            showEditChapter.value = true;
                                                            showEditChapterId.value = chapter.id;
                                                            showEditCourseId.value = currentCourse.id;
                                                          }}
                                                        >
                                                          Edit Settings
                                                        </button>
                                                        <button
                                                          class="block px-4 py-2 text-sm "
                                                          role="menuitem"
                                                          tabIndex={-1}
                                                          id={'menu-item-2' + chapter.id}
                                                          onClick$={() => {
                                                            if (
                                                              courses[currentCourse.id].is_locked &&
                                                              user.userId !== courses[currentCourse.id].author &&
                                                              user.role !== 'admin'
                                                            )
                                                              return alert(
                                                                'The Course is locked! You cannot move a chapter.'
                                                              );
                                                            handleMoveContentUp(
                                                              chapter.id,
                                                              currentCourse.id,
                                                              courses[currentCourse.id].chapter_order
                                                            );
                                                          }}
                                                        >
                                                          {courses[currentCourse.id].chaptersMap[chapter.id]
                                                            .movingUp ? (
                                                            <span>
                                                              <LoadingSVG />
                                                            </span>
                                                          ) : (
                                                            <span>Move Up</span>
                                                          )}
                                                        </button>
                                                        <button
                                                          class="block px-4 py-2 text-sm "
                                                          role="menuitem"
                                                          tabIndex={-1}
                                                          id={'menu-item-3' + chapter.id}
                                                          onClick$={() => {
                                                            if (
                                                              courses[currentCourse.id].is_locked &&
                                                              user.userId !== courses[currentCourse.id].author &&
                                                              user.role !== 'admin'
                                                            )
                                                              return alert(
                                                                'The Course is locked! You cannot move a chapter.'
                                                              );
                                                            handleMoveContentDown(
                                                              chapter.id,
                                                              currentCourse.id,
                                                              courses[currentCourse.id].chapter_order
                                                            );
                                                          }}
                                                        >
                                                          {courses[currentCourse.id].chaptersMap[chapter.id]
                                                            .movingDown ? (
                                                            <span>
                                                              <LoadingSVG />
                                                            </span>
                                                          ) : (
                                                            <span>Move Down</span>
                                                          )}
                                                        </button>
                                                        <button
                                                          class="block px-4 py-2 text-sm "
                                                          role="menuitem"
                                                          tabIndex={-1}
                                                          id={'menu-item-4' + chapter.id}
                                                          onClick$={() =>
                                                            handleLockUnlockChapter(
                                                              chapter.id,
                                                              currentCourse.id,
                                                              user.userId
                                                            )
                                                          }
                                                        >
                                                          {chapter.is_locked && <span>Unlock Chapter</span>}
                                                          {!chapter.is_locked && <span>Lock Chapter</span>}
                                                        </button>
                                                        <button
                                                          class="block px-4 py-2 text-sm text-tomato"
                                                          role="menuitem"
                                                          tabIndex={-1}
                                                          id={'menu-item-5' + chapter.id}
                                                          onClick$={() => {
                                                            if (
                                                              courses[currentCourse.id].is_locked &&
                                                              user.userId !== courses[currentCourse.id].author &&
                                                              user.role !== 'admin'
                                                            )
                                                              return alert(
                                                                'The Course is locked! You cannot delete a chapter.'
                                                              );
                                                            handleDeleteContent(chapter.id, currentCourse.id);
                                                          }}
                                                        >
                                                          {courses[currentCourse.id].chaptersMap[chapter.id]
                                                            .isDeleting ? (
                                                            <span>
                                                              <LoadingSVG />
                                                            </span>
                                                          ) : (
                                                            <span>Delete Chapter</span>
                                                          )}
                                                        </button>
                                                      </div>
                                                    </DropDownTransition>
                                                  </div>
                                                </div>
                                              </li>
                                            );
                                          })}
                                        </ul>
                                      )}
                                    </>
                                  )}
                                <div class="flex w-full flex-col items-start justify-start gap-3 pt-3 lg:flex-row lg:items-center">
                                  {user.userId === courses[currentCourse.id].profile.id && (
                                    <button
                                      onClick$={() => {
                                        if (
                                          courses[currentCourse.id].is_locked &&
                                          user.userId !== courses[currentCourse.id].author &&
                                          user.role !== 'admin'
                                        )
                                          return alert('The Course is locked! You cannot share the course.');

                                        showGetCode.value = true;
                                        showGetCodeCourseId.value = currentCourse.id;
                                      }}
                                      class="rounded-lg bg-primary-dark-gray px-4 py-2 text-[0.875rem] text-background-light-gray shadow-lg lg:px-6  lg:py-3 lg:text-[1rem]"
                                    >
                                      Get Shareable Code
                                    </button>
                                  )}
                                  <button
                                    onClick$={() => {
                                      if (
                                        courses[currentCourse.id].is_locked &&
                                        user.userId !== courses[currentCourse.id].author &&
                                        user.role !== 'admin'
                                      )
                                        return alert('The course is locked! You cannot delete a course.');

                                      handleDeleteContentIndex(currentCourse.id);
                                    }}
                                    class="rounded-lg bg-tomato px-4 py-2 text-[0.875rem] text-background-light-gray shadow-lg lg:px-6  lg:py-3 lg:text-[1rem]"
                                  >
                                    Delete Course
                                  </button>
                                </div>
                              </div>
                            )
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </>
            )}
          </section>
        </div>
      </>
    );
  }
);
