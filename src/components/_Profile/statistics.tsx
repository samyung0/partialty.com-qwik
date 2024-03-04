import { component$ } from "@builder.io/qwik";
import { Correctness } from "./statistics/correctness";
import { HourPerDay } from "./statistics/hourPerDay";

export default component$(() => {
  return (
    <div class="mx-auto flex w-[90%] flex-col overflow-hidden lg:w-[80%]">
      <h1 class="font-mosk text-2xl font-bold tracking-wide lg:text-3xl">Statistics</h1>
      <div class="mt-1 h-[2px] w-full bg-primary-dark-gray dark:bg-background-light-gray lg:mt-3"></div>
      <div class="flex flex-col gap-9 py-6 lg:py-12">
        <div class="flex flex-wrap gap-4">
          <HourPerDay />
          <Correctness />
        </div>
      </div>
    </div>
  );
});
