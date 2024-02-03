import { component$ } from "@builder.io/qwik";
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
    <div class="flex h-full w-[80vw] flex-col overflow-auto">
      <QwikQuizHydrate isPreview={false} saveToDB={saveToDBQuiz} />
      <QwikProse innerHTML={innerHTML || ""} />
      <QwikAudioTrack audioTrack={audioTrack} />
    </div>
  )
);
