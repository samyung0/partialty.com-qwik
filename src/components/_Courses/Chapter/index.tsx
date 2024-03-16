import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import QwikContent from "~/components/Prose/QwikContent";
import { useCurrentChapter } from "~/routes/[lang.]/(wrapper)/courses/[courseSlug]/chapters/[chapterSlug]/layout";

import {
  useCategoryLoader,
  useCourseLoader,
  useTagLoader,
  useUserLoaderNullable,
} from "~/routes/[lang.]/(wrapper)/courses/[courseSlug]/layout";

import { fetchAudioServer } from "~/routes/[lang.]/(wrapper)/(authRoutes)/contenteditor";
import saveToDBQuiz from "~/utils/quiz/saveToDBQuiz";
export { fetchAudioServer };

export default component$(() => {
  const userNullable = useUserLoaderNullable().value;
  const { course, preview, chapters, isFavourited } = useCourseLoader().value;
  const tags = useTagLoader().value;
  const categories = useCategoryLoader().value;
  const { currentChapter } = useCurrentChapter().value;
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
  return currentChapter ? (
    <QwikContent
      innerHTML={currentChapter.renderedHTML || undefined}
      audioTrack={audioTrack.value}
      saveToDBQuiz={saveToDB}
      isPreview={preview}
      hasAudioTrack={!!currentChapter.audio_track_asset_id}
    />
  ) : null;
});
