import { component$ } from "@builder.io/qwik";

import CheckIcon from "~/assets/svg/fitbit-check-small.svg";
import { useUserLoader } from "~/routes/[lang.]/(wrapper)/(authRoutes)/layout";

export default component$(() => {
  const user = useUserLoader().value;
  // const formData = useStore({
  //   nickname: user.nickname,
  // });
  return (
    <div class="mx-auto w-[80%]  ">
      <h1 class="font-mosk text-3xl font-bold tracking-wide">Subscription</h1>
      <div class="mt-3 h-[2px] w-full bg-primary-dark-gray"></div>
      <div class="mt-12 flex flex-col items-center">
        <div class="flex flex-col items-center gap-3">
          <p class=" font-mosk text-4xl font-bold">
            Want to <span class="highlight-mint">learn more</span>?
          </p>
          <p class="text-lg">Upgrade to fully utilize the platform</p>
        </div>
        <div class="flex flex-col items-center gap-8 pt-8">
          <div
            class={
              "flex h-[300px] w-[600px] flex-col rounded-lg bg-white p-8  " +
              (["paid", "admin", "teacher"].includes(user.role)
                ? " border-4 border-mint"
                : " border-2 border-primary-dark-gray shadow-xl")
            }
          >
            <div class="flex items-center justify-between">
              <div class=" space-y-2 font-mosk text-3xl tracking-wide">
                <p>Hobbyist</p>
                <p class="highlight-pink text-sm font-bold tracking-normal">
                  Unlock every course and feature
                </p>
              </div>
              <div class="my-4 ml-5 text-base">
                <span class="text-2xl">$5.00</span> / month
              </div>
            </div>

            <div class="mt-6 flex flex-col gap-1">
              <div class="flex items-center gap-2 ">
                <img src={CheckIcon} width={20} height={20} />
                <p class="flex-1 text-base">Unlock more courses and projects</p>
              </div>
              <div class="flex items-center gap-2 ">
                <img src={CheckIcon} width={20} height={20} />
                <p class="flex-1 text-base">Create your own courses</p>
              </div>
              <div class="flex items-center gap-2 ">
                <img src={CheckIcon} width={20} height={20} />
                <p class="flex-1 text-base">
                  <i>And more importantly...</i> show your support :D
                </p>
              </div>
            </div>

            <div class="relative mt-6 flex flex-1">
              {["paid", "admin", "teacher"].includes(user.role) ? (
                <button class="mx-auto rounded-lg bg-middle-tomato px-6 py-3 text-base">
                  Cancel Subscription
                </button>
              ) : (
                <button class="w-full rounded-lg bg-primary-dark-gray py-3 text-base text-background-light-gray">
                  Upgrade plan
                </button>
              )}
            </div>
          </div>
          {user.role === "free" && <p>You current do not have any active subscription 🥲</p>}
        </div>
      </div>
    </div>
  );
});
