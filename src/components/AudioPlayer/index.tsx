import type { NoSerialize, QRL } from '@builder.io/qwik';
import {
  $,
  component$,
  noSerialize,
  useContext,
  useOnWindow,
  useSignal,
  useStore,
  useTask$,
  useVisibleTask$,
} from '@builder.io/qwik';
import ForwardButton from '~/components/AudioPlayer/ForwardButton';
import MuteButton from '~/components/AudioPlayer/MuteButton';
import PlayButton from '~/components/AudioPlayer/PlayButton';
import PlaybackRateButton from '~/components/AudioPlayer/PlaybackRateButton';
import RewindButton from '~/components/AudioPlayer/RewindButton';
import Slider from '~/components/AudioPlayer/Slider';
import LoadingSVG from '~/components/LoadingSVG';

import { QwikMuxAudio } from '~/components/AudioPlayer/MuxPlayer';

import { isServer } from '@builder.io/qwik/build';
import isHotkey from 'is-hotkey';
import { chapterContext } from '~/routes/(lang)/(wrapper)/courses/[courseSlug]/chapters/[chapterSlug]/layout';

interface PlayerState {
  playing: boolean;
  muted: boolean;
  duration: number;
  currentTime: number;
  name: string;
  playback_id: string;
  playbackRateNumber: number;
  displayCurrentTime: number;
}

interface PublicPlayerActions {
  play: QRL<(player: PlayerAPI) => void>;
  pause: QRL<(player: PlayerAPI) => void>;
  toggle: QRL<(player: PlayerAPI) => void>;
  seekBy: QRL<(player: PlayerAPI, amount: number) => void>;
  seek: QRL<(player: PlayerAPI, time: number) => void>;
  playbackRate: QRL<(player: PlayerAPI, rate: number) => void>;
  toggleMute: QRL<(player: PlayerAPI) => void>;
  isPlaying: QRL<(player: PlayerAPI) => boolean>;
}

export type PlayerAPI = PlayerState & PublicPlayerActions;

export default component$(
  ({
    audioTrack,
    innerHTML,
  }: {
    audioTrack: { id: string; duration: number; filename: string; playback_ids: { id: string }[] } | undefined;
    innerHTML: string;
  }) => {
    const chapterActions = useContext(chapterContext);

    const player = useStore<PlayerAPI>({
      playing: false,
      muted: false,
      duration: 0,
      currentTime: 0,
      displayCurrentTime: 0,
      name: '',
      playback_id: '',
      playbackRateNumber: 1,

      play: $((player: PlayerAPI) => {
        player.playing = true;
      }),
      pause: $((player: PlayerAPI) => {
        player.playing = false;
      }),
      toggle: $((player: PlayerAPI) => {
        player.playing = !player.playing;
      }),
      seekBy: $((player: PlayerAPI, amount: number) => {
        player.currentTime += amount;
        player.displayCurrentTime += amount;
      }),
      seek: $((player: PlayerAPI, time: number) => {
        player.currentTime = time;
        player.displayCurrentTime = time;
      }),
      playbackRate: $((player: PlayerAPI, rate: number) => {
        player.playbackRateNumber = rate;
      }),
      toggleMute: $((player: PlayerAPI) => {
        player.muted = !player.muted;
      }),
      isPlaying: $((player: PlayerAPI) => {
        return player.playing;
      }),
    });

    useOnWindow(
      'keydown',
      $((e) => {
        if (isHotkey('space', e)) {
          e.preventDefault();
          player.toggle(player);
        }
        if (isHotkey('left', e)) {
          e.preventDefault();
          player.seekBy(player, -5);
        }
        if (isHotkey('right', e)) {
          e.preventDefault();
          player.seekBy(player, 5);
        }
      })
    );

    const wasPlayingRef = useSignal(false);

    const dataSync = useSignal<NoSerialize<NodeListOf<Element>> | undefined>();
    const sync = $(() => {
      console.log('syncing');
      if (!dataSync.value) return;
      for (let i = 0; i < dataSync.value.length; i++) {
        const timeStampToActivate = Number(dataSync.value[i].getAttribute('data-synctimestamp')) || 0;
        if (player.displayCurrentTime >= timeStampToActivate || chapterActions.showAllHighlights) {
          if (dataSync.value[i].getAttribute('data-syncactivated') === '1') continue;
          let enter: any = {};
          try {
            enter = JSON.parse(dataSync.value[i].getAttribute('data-syncenter') || '{}');
          } catch (_) {
            /* empty */
          }
          for (const j in enter) (dataSync.value[i] as HTMLElement).style[j as any] = enter[j];
          dataSync.value[i].setAttribute('data-syncactivated', '1');
        } else {
          if (dataSync.value[i].getAttribute('data-syncactivated') !== '1') continue;
          let enter: any = {};
          let leave: any = {};
          try {
            enter = JSON.parse(dataSync.value[i].getAttribute('data-syncenter') || '{}');
            leave = JSON.parse(dataSync.value[i].getAttribute('data-syncleave') || '{}');
          } catch (_) {
            /* empty */
          }
          for (const j in enter) delete (dataSync.value[i] as HTMLElement).style[j as any];
          for (const j in leave) (dataSync.value![i] as HTMLElement).style[j as any] = leave[j];
          dataSync.value[i].setAttribute('data-syncactivated', '0');
        }
      }
    });

    useVisibleTask$(
      () => {
        dataSync.value = noSerialize(document.querySelectorAll("#sectionProse [data-sync='1']"));
        sync();
      },
      { strategy: 'document-ready' }
    );

    useTask$(({ track }) => {
      track(() => audioTrack);
      if (!audioTrack) return;
      player.duration = audioTrack.duration;
      player.name = audioTrack.filename;
      player.playback_id = audioTrack.playback_ids[0].id;
      sync();
    });

    useTask$(({ track }) => {
      track(() => innerHTML);
      if (isServer) return;
      setTimeout(() => {
        dataSync.value = noSerialize(document.querySelectorAll("#sectionProse [data-sync='1']"));
        sync();
      }, 100);
    });

    useTask$(({ track }) => {
      track(() => chapterActions.showAllHighlights);
      if (isServer) return;
      sync();
    });

    return (
      <div class="relative z-[20] flex h-[10dvh] min-h-[90px] w-full items-center justify-center gap-6 bg-background-light-gray px-4 py-4 shadow shadow-slate-200/80 ring-1 ring-slate-900/5 backdrop-blur-sm dark:bg-primary-dark-gray md:px-6">
        {audioTrack && (
          <>
            <div class="hidden md:block">
              <PlayButton player={player} />
            </div>
            <div class="mb-[env(safe-area-inset-bottom)] flex flex-1 flex-col gap-3 overflow-hidden p-1">
              <p class="truncate text-center text-sm font-bold leading-6 md:text-left" title={player.name}>
                {player.name}
              </p>
              <div class="flex justify-between gap-6">
                <div class="flex items-center md:hidden">
                  <MuteButton player={player} />
                </div>
                <div class="flex flex-none items-center gap-4">
                  <RewindButton player={player} />
                  <div class="md:hidden">
                    <PlayButton player={player} />
                  </div>
                  <ForwardButton player={player} />
                </div>
                <div class="absolute inset-x-0 bottom-full flex-auto touch-none md:relative">
                  <Slider
                    label="Current time"
                    maxValue={player.duration}
                    step={1}
                    value={[player.displayCurrentTime]}
                    onChange$={([value]) => {
                      player.displayCurrentTime = value;
                      player.currentTime = value;
                    }}
                    onChangeEnd$={([value]) => {
                      player.seek(player, value);
                      if (wasPlayingRef.value) {
                        player.play(player);
                      }
                    }}
                    onChangeStart$={() => {
                      wasPlayingRef.value = player.playing;
                      player.pause(player);
                    }}
                  />
                </div>
                <div class="flex items-center gap-4">
                  <div class="flex items-center">
                    <PlaybackRateButton player={player} />
                  </div>
                  <div class="hidden items-center md:flex">
                    <MuteButton player={player} />
                  </div>
                </div>
              </div>
            </div>

            <QwikMuxAudio
              id={player.playback_id}
              paused={!player.playing}
              setTimeStamp={$((time: number) => (player.displayCurrentTime = time))}
              sync={sync}
              currentTime={player.currentTime}
              muted={player.muted}
              playbackRate={player.playbackRateNumber}
            />
          </>
        )}
        {!audioTrack && (
          <span>
            <LoadingSVG />
          </span>
        )}
      </div>
    );
  }
);
