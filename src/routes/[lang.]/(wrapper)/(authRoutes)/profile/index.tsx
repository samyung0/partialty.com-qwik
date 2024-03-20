import { component$, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

import Nav from "~/components/Nav";
import Profile from "~/components/_Profile/profile";
import Statistics from "~/components/_Profile/statistics";
import Subscription from "~/components/_Profile/subscription";
import { useUserLoader } from "~/routes/[lang.]/(wrapper)/(authRoutes)/layout";

const tabs = [
  { name: "Profile", component: <Profile /> },
  { name: "Subscription", component: <Subscription /> },
  { name: "Statistics", component: <Statistics /> },
];

export default component$(() => {
  const user = useUserLoader().value;
  const displayIdx = useSignal(0);

  return (
    <section class="min-h-[100vh] bg-light-yellow dark:bg-primary-dark-gray dark:text-background-light-gray">
      <Nav user={user} />
      <div class="mx-auto flex max-w-7xl flex-col px-4 sm:px-6 lg:flex-row lg:px-8 lg:pt-6">
        <div class="flex w-full flex-col gap-4 lg:w-[20%]">
          <div class="hidden self-center lg:block">
            <img
              class="h-[100px] w-[100px] rounded-full object-cover"
              src={user.avatar_url}
              width={100}
              height={100}
            />
            <p class="p-1 text-center font-mosk text-lg tracking-wide">{user.nickname}</p>
          </div>
          <div class="flex w-full flex-row flex-wrap gap-2 lg:flex-col lg:flex-nowrap lg:gap-0">
            {tabs.map((tab, idx) => (
              <div class="relative flex h-full gap-1" key={`tab-${idx}`}>
                {/* {idx === displayIdx.value && ( */}
                <div
                  class={
                    "hidden h-full w-[5px] rounded-lg lg:block " +
                    (idx === displayIdx.value
                      ? "bg-yellow"
                      : "bg-light-yellow dark:bg-primary-dark-gray")
                  }
                ></div>
                {/* )} */}

                <button
                  class={`w-full rounded-md bg-light-yellow p-3 text-left hover:brightness-90 dark:bg-primary-dark-gray dark:hover:brightness-150 lg:p-2 ${
                    idx === displayIdx.value && "brightness-90 dark:brightness-150"
                  }`}
                  onClick$={() => {
                    displayIdx.value = idx;
                  }}
                >
                  {tab.name}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div class="mt-[30px] w-full ">{tabs[displayIdx.value].component}</div>
      </div>
    </section>
  );
});

export const head: DocumentHead = {
  title: "Profile",
  meta: [
    {
      name: "description",
      content: "A page to customize your profile.",
    },
  ],
};
