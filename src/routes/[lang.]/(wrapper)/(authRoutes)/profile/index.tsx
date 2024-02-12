import { component$, useSignal } from "@builder.io/qwik";

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
    <section class="min-h-[100vh] bg-light-yellow">
      <Nav user={user} />
      <div class="mx-auto flex max-w-[80%] pt-6">
        <div class="flex w-[20%] flex-col gap-4">
          <div class="self-center">
            <img
              class="h-[100px] w-[100px] rounded-full object-cover"
              src={user.avatar_url}
              width={100}
              height={100}
            />
            <p class="p-1 text-center font-mosk text-lg tracking-wide">{user.nickname}</p>
          </div>
          <div class="flex flex-col">
            {tabs.map((tab, idx) => (
              <div class="relative flex h-full gap-1" key={`tab-${idx}`}>
                {/* {idx === displayIdx.value && ( */}
                <div
                  class={
                    "h-full w-[5px] rounded-lg " +
                    (idx === displayIdx.value ? "bg-yellow" : "bg-light-yellow")
                  }
                ></div>
                {/* )} */}

                <button
                  class={`w-full rounded-md bg-light-yellow p-2 text-left hover:brightness-90 ${
                    idx === displayIdx.value && "brightness-90"
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
