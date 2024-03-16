import { component$ } from "@builder.io/qwik";
import type { PlayerAPI } from "~/components/AudioPlayer";

export default component$(({ player }: { player: PlayerAPI }) => {
  return (
    <button
      type="button"
      class="group relative rounded-md hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:outline-none dark:ring-offset-0 dark:hover:bg-highlight-dark dark:focus:ring-0 dark:focus:ring-offset-0 md:order-none"
      onClick$={() => player.toggleMute(player)}
      aria-label={player.muted ? "Unmute" : "Mute"}
    >
      <div class="absolute -inset-4 md:hidden" />
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-6 w-6 fill-slate-500 stroke-slate-500 group-hover:fill-slate-700 group-hover:stroke-slate-700 dark:fill-gray-300 dark:stroke-gray-300 dark:ring-offset-0 dark:focus:ring-offset-0 group-hover:dark:fill-gray-300 group-hover:dark:stroke-gray-300"
      >
        {player.muted ? (
          <>
            <path d="M12 6L8 10H6C5.44772 10 5 10.4477 5 11V13C5 13.5523 5.44772 14 6 14H8L12 18V6Z" />
            <path d="M16 10L19 13" fill="none" />
            <path d="M19 10L16 13" fill="none" />
          </>
        ) : (
          <>
            <path d="M12 6L8 10H6C5.44772 10 5 10.4477 5 11V13C5 13.5523 5.44772 14 6 14H8L12 18V6Z" />
            <path d="M17 7C17 7 19 9 19 12C19 15 17 17 17 17" fill="none" />
            <path
              d="M15.5 10.5C15.5 10.5 16 10.9998 16 11.9999C16 13 15.5 13.5 15.5 13.5"
              fill="none"
            />
          </>
        )}
      </svg>
    </button>
  );
});
