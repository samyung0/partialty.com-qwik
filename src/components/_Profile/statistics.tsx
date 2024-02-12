import { component$ } from "@builder.io/qwik";
import { Correctness } from "./statistics/correctness";
import { HourPerDay } from "./statistics/hourPerDay";

export default component$(() => {
  return (
    <div class="mx-auto flex w-[80%] flex-col ">
      <h1 class="font-mosk text-3xl font-bold tracking-wide">Statistics</h1>
      <div class="mt-3 h-[2px] w-full bg-primary-dark-gray"></div>
      <div class="mt-3 flex flex-col gap-9 pt-12">
        <div class="flex h-[340px] gap-4 ">
          <HourPerDay />
          <Correctness />
        </div>
      </div>
    </div>
  );
});
