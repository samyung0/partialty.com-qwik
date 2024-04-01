import { $, component$, useComputed$, useSignal, useStore, useVisibleTask$ } from '@builder.io/qwik';
import QwikContent from '~/components/Prose/QwikContent';
import { useCurrentChapter } from '~/routes/(lang)/(wrapper)/courses/[courseSlug]/chapters/[chapterSlug]/layout';

import {
  useCategoryLoader,
  useCourseLoader,
  useTagLoader,
  useUserLoaderNullable,
} from '~/routes/(lang)/(wrapper)/courses/[courseSlug]/layout';

// import { fetchAudioServer } from '~/routes/(lang)/(wrapper)/(authRoutes)/contenteditor';
// import saveToDBQuiz from '~/utils/quiz/saveToDBQuiz';
// export { fetchAudioServer };

const saveToDBQuiz = $(async (isCorrect: boolean, userId: string, courseId: string, chapterId: string) => {
  const d = new FormData();
  d.append('_isCorrect', JSON.stringify(isCorrect));
  d.append('userId', userId);
  d.append('courseId', courseId);
  d.append('chapterId', chapterId);
  return await fetch('/api/courses/chapters/saveToDBQuiz/', {
    method: 'POST',
    body: d,
    // headers: {
    //   'Content-Type': 'application/json',
    // },
  }).then((x) => x.json());
});

const fetchAudioServer = $(async (audioId: string) => {
  const d = new FormData();
  d.append('audioId', audioId);
  return await fetch('/api/courses/chapters/fetchAudio/', {
    method: 'POST',
    body: d,
    // headers: {
    //   'Content-Type': 'application/json',
    // },
  }).then((x) => x.json());
});

// const saveProgressServer = server$(async function (
//   progress: string[],
//   courseId: string,
//   userId: string,
//   notFinished: boolean
// ) {
//   return await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === '1')
//     .update(content_user_progress)
//     .set({ progress, finished_date: notFinished ? null : getSQLTimeStamp() })
//     .where(and(eq(content_user_progress.index_id, courseId), eq(content_user_progress.user_id, userId)))
//     .returning();
// });

const saveProgressServer = $(async (progress: string[], courseId: string, userId: string, notFinished: boolean, prevProgress: boolean) => {
  const d = new FormData();
  d.append('_progress', JSON.stringify(progress));
  d.append('courseId', courseId);
  d.append('userId', userId);
  d.append('_notFinished', JSON.stringify(notFinished));
  d.append('_prevProgress', JSON.stringify(prevProgress));
  return await fetch('/api/courses/chapters/saveProgress/', {
    method: 'POST',
    body: d,
    // headers: {
    //   'Content-Type': 'application/json',
    // },
  }).then((x) => x.json());
});

const getUserFn = $(async () => {
  return await fetch('/api/courses/chapters/getUser/').then((x) => x.json());
});

export default component$(() => {
  const userNullable = useUserLoaderNullable().value;
  const { course, preview, chapters } = useCourseLoader().value;
  const filteredChapterOrder = useComputed$(() =>
    course.content_index.chapter_order.filter((id) => !!chapters.find((chapter) => chapter.id === id))
  );
  const filteredChapters = useComputed$(
    () =>
      course.content_index.chapter_order
        .map((id) => chapters.find((chapter) => chapter.id === id))
        .filter((x) => x) as typeof chapters
  );
  const tags = useTagLoader().value;
  const categories = useCategoryLoader().value;
  const { currentChapter } = useCurrentChapter().value;
  const userProgress = course.content_user_progress;
  const audioTrack = useSignal<{
    id: string;
    duration: number;
    filename: string;
    playback_ids: { id: string }[];
  }>();
  const login = useStore({
    isLoading: userNullable === undefined,
    isLoggedIn: userNullable !== undefined,
    user: userNullable,
  });

  useVisibleTask$(async () => {
    if (login.isLoggedIn) return;
    const res = await getUserFn();
    login.isLoading = false;
    if (res) {
      login.isLoggedIn = true;
      login.user = res.user;
    }
  });

  useVisibleTask$(async ({ track }) => {
    track(() => currentChapter);
    if (!currentChapter || !currentChapter.audio_track_asset_id) return (audioTrack.value = undefined);
    const res = await fetchAudioServer(currentChapter.audio_track_asset_id);
    audioTrack.value = {
      id: res.data.id,
      duration: res.data.duration,
      filename: res.filename,
      playback_ids: res.data.playback_ids,
    };
  });
  const saveToDB = $(async (isCorrect: boolean) => {
    if (!login.isLoggedIn || !currentChapter) return;
    console.log('Saving Answer');
    await saveToDBQuiz(isCorrect, login.user!.userId, course.content_index.id, currentChapter.id);
  });
  const saveProress = $(async () => {
    if (!login.isLoggedIn || !currentChapter) return;
    console.log('saving Progress');
    const newProgress = [...(userProgress?.progress || [])];
    if (!(userProgress?.progress || []).includes(currentChapter.id)) newProgress.push(currentChapter.id);
    const notFinished =
      course.content_index.chapter_order
        .filter((id) => !!chapters.find((chapter) => chapter.id === id))
        .filter((id) => !newProgress.includes(id)).length > 0;
    await saveProgressServer(
      [...newProgress],
      course.content_index.id,
      login.user!.userId,
      notFinished,
      userProgress !== null
    );
  });
  return currentChapter ? (
    <QwikContent
      isGuide={course.content_index.is_guide}
      lastEdited={currentChapter.updated_at}
      innerHTML={currentChapter.renderedHTML || undefined}
      audioTrack={audioTrack.value}
      saveToDBQuiz={saveToDB}
      isPreview={preview}
      hasAudioTrack={!!currentChapter.audio_track_asset_id}
      saveProress={saveProress}
      prevChapter={
        filteredChapters.value.find(
          (chapter) =>
            chapter.id === filteredChapterOrder.value[filteredChapterOrder.value.indexOf(currentChapter.id) - 1]
        )?.link || undefined
      }
      nextChapter={
        filteredChapters.value.find(
          (chapter) =>
            chapter.id === filteredChapterOrder.value[filteredChapterOrder.value.indexOf(currentChapter.id) + 1]
        )?.link || undefined
      }
    />
  ) : null;
});
