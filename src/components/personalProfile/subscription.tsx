import { component$ } from "@builder.io/qwik";

import CheckIcon from "~/assets/svg/fitbit-check-small.svg";
import { useUserLoader } from "~/routes/[lang.]/(wrapper)/(authRoutes)/layout";
import type { LuciaSession } from "~/types/LuciaSession";

export default component$(() => {
  const user: LuciaSession["user"] = useUserLoader().value;
  // const formData = useStore({
  //   nickname: user.nickname,
  // });
  return (
    <div class="mx-auto w-[80%]  ">
      <p class="text-2xl font-bold">Subscription</p>
      <div class="mt-3 w-full border-t border-black"></div>
      <div class="mt-12 flex flex-col items-center">
        <div class="flex flex-col items-center gap-3">
          <p class=" font-mosk text-4xl font-bold">
            Ready to <span class="highlight-mint">get started</span>?
          </p>
          <p class="text-lg">Upgrade to fully utilize the platform</p>
        </div>
        <div class="flex gap-4 pt-8">
          <div class="flex h-[300px] w-[600px] flex-col rounded-lg border-2 border-black bg-background-light-gray p-8 shadow-xl">
            <div class="flex items-center justify-between">
              <div class=" space-y-2 font-mosk text-3xl">
                <p>Professional</p>
                <p class="highlight-pink text-sm font-bold">
                  Up to 10 services provided and more and more
                </p>
              </div>
              <div class="my-4 ml-5 text-sm underline decoration-wavy underline-offset-2">
                <span class="text-2xl">$129.99</span> / month
              </div>
            </div>

            <div class="mt-6 grid grid-cols-3 gap-1">
              <div class="flex items-start gap-2 ">
                <img src={CheckIcon} width={17} height={17} />
                <p class="flex-1 text-xs">Unlock more frameworks and projects</p>
              </div>
              <div class="flex items-start gap-2 ">
                <img src={CheckIcon} width={17} height={17} />
                <p class="flex-1 text-xs">Exam sessions for each course</p>
              </div>
              <div class="flex items-start gap-2 ">
                <img src={CheckIcon} width={17} height={17} />
                <p class="flex-1 text-xs">Audio highlighting</p>
              </div>
              <div class="flex items-start gap-2 ">
                <img src={CheckIcon} width={17} height={17} />
                <p class="flex-1 text-xs">Video-assisting learning</p>
              </div>
              <div class="flex items-start gap-2 ">
                <img src={CheckIcon} width={17} height={17} />
                <p class="flex-1 text-xs">Create and edit your own courses</p>
              </div>
              <div class="flex items-start gap-2 ">
                <img src={CheckIcon} width={17} height={17} />
                <p class="flex-1 text-xs">Make your courses publicly accessible</p>
              </div>
              <div class="flex items-start gap-2 ">
                <img src={CheckIcon} width={17} height={17} />
                <p class="flex-1 text-xs">Others...</p>
              </div>
            </div>

            <div class="relative mt-6 bg-background-light-gray">
              <button class="w-full rounded-lg   bg-black  py-1 text-sm  text-white">
                Upgrade plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
