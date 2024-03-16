import { component$ } from "@builder.io/qwik";
import AudioPlayer from "~/components/AudioPlayer";
import { QwikEmbedHydrate } from "~/components/Prose/EmbedHydrate";
import { QwikQuizCodeHydrate } from "~/components/Prose/QuizCodeHydrate";
import { QwikQuizHydrate } from "~/components/Prose/QuizHydrate";
import QwikProse from "~/components/Prose/qwik-prose";

export default component$(
  ({
    innerHTML,
    audioTrack,
    saveToDBQuiz,
    isPreview,
    hasAudioTrack,
  }: {
    innerHTML: string | undefined;
    audioTrack:
      | {
          id: string;
          duration: number;
          filename: string;
          playback_ids: { id: string }[];
        }
      | undefined;
    hasAudioTrack: boolean;
    saveToDBQuiz: (isCorrect: boolean) => any;
    isPreview: boolean;
  }) => (
    <div class="flex h-full flex-col overflow-hidden">
      <QwikQuizHydrate isPreview={isPreview} saveToDB={saveToDBQuiz} />
      <QwikQuizCodeHydrate saveToDB={saveToDBQuiz} isPreview={isPreview} />
      <QwikEmbedHydrate />
      <div class="overflow-auto" style={{ height: hasAudioTrack ? "90vh" : "100vh" }}>
        <QwikProse innerHTML={innerHTML || ""} />
      </div>
      {/* <QwikAudioTrack audioTrack={audioTrack} /> */}
      <AudioPlayer audioTrack={audioTrack} />
    </div>
  )
);
