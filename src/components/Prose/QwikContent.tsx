import type { QRL } from '@builder.io/qwik';
import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import moment from 'moment';
import AudioPlayer from '~/components/AudioPlayer';
import ProgressTracker from '~/components/Prose/ProgressTracker';
import { QwikQuizCodeHydrate } from '~/components/Prose/QuizCodeHydrate';
import { QwikQuizHydrate } from '~/components/Prose/QuizHydrate';
import QwikProse from '~/components/Prose/qwik-prose';
import { cn } from '~/utils/cn';

export default component$(
  ({
    innerHTML,
    audioTrack,
    saveToDBQuiz,
    isPreview,
    hasAudioTrack,
    saveProress,
    prevChapter,
    nextChapter,
    lastEdited,
    isGuide
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
    saveProress: QRL<() => any>;
    prevChapter?: string | undefined;
    nextChapter?: string | undefined;
    lastEdited: string;
    isGuide: boolean
  }) => (
    <div class="flex max-h-full flex-auto flex-col items-stretch justify-between overflow-hidden ">
      <QwikQuizHydrate isPreview={isPreview} saveToDB={saveToDBQuiz} />
      <QwikQuizCodeHydrate saveToDB={saveToDBQuiz} isPreview={isPreview} />
      {/* <QwikEmbedHydrate /> */}
      <main class={cn('max-h-full flex-auto overflow-auto')}>
        <QwikProse innerHTML={innerHTML || ''} />
        <div class="">
          <ProgressTracker saveProress={saveProress} />
        </div>
        <div class="flex flex-col gap-3">
          <p class="mx-auto flex w-[90%] max-w-[unset] items-center p-0 pb-3 text-xs italic text-gray-500 dark:text-gray-300 md:w-[80%] lg:w-full lg:max-w-[800px] lg:px-10 lg:text-sm 2xl:mx-0 2xl:ml-[10%]">
            Last edited on {moment(lastEdited).format('DD/MM/YYYY').toString()}
          </p>
          <nav class="mx-auto flex w-[90%] max-w-[unset] items-center p-0 pb-6 md:w-[80%] lg:w-full lg:max-w-[800px] lg:px-10 2xl:mx-0 2xl:ml-[10%]">
            {!!prevChapter && (
              <Link href={prevChapter} class="mr-auto text-sm underline md:text-base">
                Previous
              </Link>
            )}
            {!!nextChapter && (
              <Link href={nextChapter} class="ml-auto text-sm underline md:text-base">
                Next
              </Link>
            )}
          </nav>
          {!nextChapter && (
            <p class="mx-auto w-[90%] max-w-[unset] items-center p-0 pb-6 text-center font-mosk text-sm font-bold tracking-wide md:w-[80%] md:text-base lg:w-full lg:max-w-[800px] lg:px-10 2xl:mx-0 2xl:ml-[10%]">
              🎉Congratulations. You have finished the {isGuide ? "Guide" : "Course"}!
            </p>
          )}
        </div>
      </main>
      {/* <QwikAudioTrack audioTrack={audioTrack} /> */}
      {audioTrack && (
        <div class="mt-auto">
          <AudioPlayer audioTrack={audioTrack} />
        </div>
      )}
    </div>
  )
);
