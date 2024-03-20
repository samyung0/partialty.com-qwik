import { component$ } from "@builder.io/qwik";

import type { PlayerAPI } from "~/components/AudioPlayer";
import PauseIcon from "./PauseIcon";
import PlayIcon from "./PlayIcon";

export default component$(({ player }: { player: PlayerAPI }) => {
  const Icon = player.playing ? PauseIcon : PlayIcon;
  return (
    <button
      type="button"
      class="group relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-700 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-offset-2 dark:bg-highlight-dark dark:hover:bg-slate-900 md:h-12 md:w-12"
      onClick$={() => player.toggle(player)}
      aria-label={player.playing ? "Pause" : "Play"}
    >
      <div class="absolute -inset-3 md:hidden" />
      <Icon class="h-5 w-5 fill-white group-active:fill-white/80" />
    </button>
  );
});
