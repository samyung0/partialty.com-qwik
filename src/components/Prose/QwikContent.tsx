import { component$ } from "@builder.io/qwik";
import { QwikEmbedHydrate } from "~/components/Prose/EmbedHydrate";
import { QwikQuizHydrate } from "~/components/Prose/QuizHydrate";
import QwikProse from "~/components/Prose/qwik-prose";
import { QwikAudioTrack } from "~/components/Prose/react-syncAudio";

export default component$(
  ({
    innerHTML,
    audioTrack,
    saveToDBQuiz,
  }: {
    innerHTML: string | undefined;
    audioTrack: {
      id: string;
      duration: number;
      filename: string;
      playback_ids: { id: string }[];
    };
    saveToDBQuiz: (isCorrect: boolean) => any;
  }) => (
    <div class="flex h-full w-[80vw] flex-col overflow-hidden">
      <QwikQuizHydrate isPreview={false} saveToDB={saveToDBQuiz} />
      <QwikEmbedHydrate />
      <div class="h-[90vh] overflow-auto">
        <QwikProse innerHTML={innerHTML || ""} />
      </div>
      <QwikAudioTrack audioTrack={audioTrack} />
    </div>
  )
);
