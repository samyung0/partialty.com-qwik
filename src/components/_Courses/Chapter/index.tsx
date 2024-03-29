import { $, component$, useComputed$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import QwikContent from '~/components/Prose/QwikContent';
import {
  useCurrentChapter,
  useDBLoader,
} from '~/routes/(lang)/(wrapper)/courses/[courseSlug]/chapters/[chapterSlug]/layout';

import {
  useCategoryLoader,
  useCourseLoader,
  useTagLoader,
  useUserLoaderNullable,
} from '~/routes/(lang)/(wrapper)/courses/[courseSlug]/layout';

import { server$ } from '@builder.io/qwik-city';
import { and, eq } from 'drizzle-orm';
import { fetchAudioServer } from '~/routes/(lang)/(wrapper)/(authRoutes)/contenteditor';
import drizzleClient from '~/utils/drizzleClient';
import getSQLTimeStamp from '~/utils/getSQLTimeStamp';
import saveToDBQuiz from '~/utils/quiz/saveToDBQuiz';
import { content_user_progress } from '../../../../drizzle_turso/schema/content_user_progress';
export { fetchAudioServer };

const saveProgressServer = server$(async function (
  progress: string[],
  courseId: string,
  userId: string,
  notFinished: boolean
) {
  return await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === '1')
    .update(content_user_progress)
    .set({ progress, finished_date: notFinished ? null : getSQLTimeStamp() })
    .where(and(eq(content_user_progress.index_id, courseId), eq(content_user_progress.user_id, userId)))
    .returning();
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
  const userProgress = useDBLoader().value;
  const audioTrack = useSignal<{
    id: string;
    duration: number;
    filename: string;
    playback_ids: { id: string }[];
  }>();
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
    if (!userNullable || !currentChapter) return;
    await saveToDBQuiz(isCorrect, userNullable.userId, course.content_index.id, currentChapter.id);
  });
  const saveProress = $(async () => {
    if (!userProgress || !userNullable || !currentChapter) return;
    console.log('saving Progress');
    const newProgress = [...userProgress.progress];
    if (!userProgress.progress.includes(currentChapter.id)) newProgress.push(currentChapter.id);
    const notFinished =
      course.content_index.chapter_order
        .filter((id) => !!chapters.find((chapter) => chapter.id === id))
        .filter((id) => !newProgress.includes(id)).length > 0;
    await saveProgressServer([...newProgress], course.content_index.id, userNullable.userId, notFinished);
  });
  return currentChapter ? (
    <QwikContent
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
