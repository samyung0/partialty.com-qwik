import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import QwikContent from "~/components/Prose/QwikContent";
import {
  useCurrentChapter,
  useDBLoader,
} from "~/routes/[lang.]/(wrapper)/courses/[courseSlug]/chapters/[chapterSlug]/layout";

import {
  useCategoryLoader,
  useCourseLoader,
  useTagLoader,
  useUserLoaderNullable,
} from "~/routes/[lang.]/(wrapper)/courses/[courseSlug]/layout";

import { server$ } from "@builder.io/qwik-city";
import { and, eq } from "drizzle-orm";
import { fetchAudioServer } from "~/routes/[lang.]/(wrapper)/(authRoutes)/contenteditor";
import drizzleClient from "~/utils/drizzleClient";
import getSQLTimeStamp from "~/utils/getSQLTimeStamp";
import saveToDBQuiz from "~/utils/quiz/saveToDBQuiz";
import { content_user_progress } from "../../../../drizzle_turso/schema/content_user_progress";
export { fetchAudioServer };

const saveProgressServer = server$(
  async (progress: string[], courseId: string, userId: string, notFinished: boolean) => {
    return await drizzleClient()
      .update(content_user_progress)
      .set({ progress, finished_date: notFinished ? null : getSQLTimeStamp() })
      .where(
        and(eq(content_user_progress.index_id, courseId), eq(content_user_progress.user_id, userId))
      )
      .returning();
  }
);

export default component$(() => {
  const userNullable = useUserLoaderNullable().value;
  const { course, preview, chapters, isFavourited } = useCourseLoader().value;
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
  useVisibleTask$(async () => {
    if (!currentChapter || !currentChapter.audio_track_asset_id) return;
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
    console.log("saving Progress");
    const newProgress = userProgress.progress;
    if (!userProgress.progress.includes(currentChapter.id)) newProgress.push(currentChapter.id);
    const notFinished =
      course.content_index.chapter_order.filter((id) => !newProgress.includes(id)).length > 0;
    await saveProgressServer(
      [...newProgress],
      course.content_index.id,
      userNullable.userId,
      notFinished
    );
  });
  const a =
    chapters.find(
      (chapter) =>
        chapter.id ===
        course.content_index.chapter_order[
          course.content_index.chapter_order.indexOf(currentChapter!.id) - 1
        ]
    )?.link || undefined;
  return currentChapter ? (
    <QwikContent
      innerHTML={currentChapter.renderedHTML || undefined}
      audioTrack={audioTrack.value}
      saveToDBQuiz={saveToDB}
      isPreview={preview}
      hasAudioTrack={!!currentChapter.audio_track_asset_id}
      saveProress={saveProress}
      prevChapter={
        chapters.find(
          (chapter) =>
            chapter.id ===
            course.content_index.chapter_order[
              course.content_index.chapter_order.indexOf(currentChapter.id) - 1
            ]
        )?.link || undefined
      }
      nextChapter={
        chapters.find(
          (chapter) =>
            chapter.id ===
            course.content_index.chapter_order[
              course.content_index.chapter_order.indexOf(currentChapter.id) + 1
            ]
        )?.link || undefined
      }
    />
  ) : null;
});
