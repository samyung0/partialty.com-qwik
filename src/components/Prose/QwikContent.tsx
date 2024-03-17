import { component$ } from "@builder.io/qwik";
import AudioPlayer from "~/components/AudioPlayer";
import { QwikEmbedHydrate } from "~/components/Prose/EmbedHydrate";
import { QwikQuizCodeHydrate } from "~/components/Prose/QuizCodeHydrate";
import { QwikQuizHydrate } from "~/components/Prose/QuizHydrate";
import QwikProse from "~/components/Prose/qwik-prose";
import { cn } from "~/utils/cn";

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
    <div class="flex max-h-full flex-auto flex-col items-stretch justify-between overflow-hidden ">
      <QwikQuizHydrate isPreview={isPreview} saveToDB={saveToDBQuiz} />
      <QwikQuizCodeHydrate saveToDB={saveToDBQuiz} isPreview={isPreview} />
      <QwikEmbedHydrate />
      <div class={cn("max-h-full overflow-auto", hasAudioTrack ? "lg:h-[90vh]" : "lg:h-[100vh]")}>
        <QwikProse innerHTML={innerHTML || ""} />
      </div>
      {/* <QwikAudioTrack audioTrack={audioTrack} /> */}
      <div class="mt-auto">
        <AudioPlayer audioTrack={audioTrack} />
      </div>
    </div>
  )
);
