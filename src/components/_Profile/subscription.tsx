import { $, component$ } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";

import { eq } from "drizzle-orm";
import bunApp from "~/_api/bun/util/edenTreaty";
import CheckIcon from "~/assets/svg/fitbit-check-small.svg";
import { useUserLoader } from "~/routes/(lang)/(wrapper)/(authRoutes)/layout";
import drizzleClient from "~/utils/drizzleClient";
import { profiles } from "../../../drizzle_turso/schema/profiles";

const getCustomerId = server$(async function (userId: string) {
  return await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === "1")
    .select({
      customerId: profiles.stripe_id,
    })
    .from(profiles)
    .where(eq(profiles.id, userId));
});

export default component$(() => {
  const user = useUserLoader().value;
  const handleUpgrade = $(async () => {
    if (user.role !== "free") return;
    try {
      if (!user.email) return alert("No Email Address detected! Please contact support.");
      let id = (await getCustomerId(user.userId))[0]?.customerId;
      if (!id) {
        id = (
          await bunApp.stripe.customer.post({
            email: user.email!,
            name: user.username || user.nickname,
            userId: user.userId,
          })
        ).data;
        if (!id) throw new Error("Server Error! Please contact support.");
      }
      const url = (
        await bunApp.stripe["create-session"].post({
          customerId: id,
          dev: import.meta.env.MODE !== "production",
        })
      ).data?.url;
      if (!url) throw new Error("Server Error! Please contact support.");
      window.location.assign(url);
    } catch (e) {
      return alert("Error! " + (e as any).toString());
    }
  });
  return (
    <div class="mx-auto w-[90%] dark:text-background-light-gray lg:w-[80%]">
      <h1 class="font-mosk text-2xl font-bold tracking-wide lg:text-3xl">Subscription</h1>
      <div class="mt-1 h-[2px] w-full bg-primary-dark-gray dark:bg-background-light-gray lg:mt-3"></div>
      <div class="mt-6 flex flex-col items-center lg:mt-12">
        <div class="flex flex-col items-center gap-1 lg:gap-3">
          <p class=" font-mosk text-2xl font-bold lg:text-4xl">
            Want to <span class="highlight-mint-down">learn more</span>?
          </p>
          <p class="text-base lg:text-lg">Upgrade to fully utilize the platform</p>
        </div>
        <div class="flex flex-col items-center gap-4 pt-4 text-primary-dark-gray lg:gap-8 lg:pt-8">
          <div
            class={
              "flex w-full flex-col rounded-lg bg-white p-5 md:px-8 lg:h-[300px] lg:w-[600px] lg:p-8  " +
              (["paid", "admin", "teacher"].includes(user.role)
                ? " border-4 border-mint"
                : " border-2 border-primary-dark-gray shadow-xl")
            }
          >
            <div class="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between md:gap-0">
              <div class="font-mosk text-2xl tracking-wide lg:space-y-2 lg:text-3xl">
                <p>Hobbyist</p>
                <p class="highlight-pink text-xs font-bold tracking-normal lg:text-sm">
                  Unlock every course and feature
                </p>
              </div>
              <div class="text-xs md:text-sm lg:my-4 lg:ml-5 lg:text-base">
                <span class="m:text-xl text-lg lg:text-2xl">$5.00</span> / month
              </div>
            </div>

            <div class="mt-4 flex flex-col gap-1 text-sm lg:mt-6 lg:text-base">
              <div class="flex items-center gap-2 ">
                <img src={CheckIcon} width={20} height={20} />
                <p class="flex-1">Unlock more courses and projects</p>
              </div>
              <div class="flex items-center gap-2 ">
                <img src={CheckIcon} width={20} height={20} />
                <p class="flex-1">Create your own courses</p>
              </div>
              <div class="flex items-center gap-2 ">
                <img src={CheckIcon} width={20} height={20} />
                <p class="flex-1">
                  <i>And more importantly...</i> show your support :D
                </p>
              </div>
            </div>

            <div class="relative mt-3 flex flex-1 items-center lg:mt-6">
              {["paid", "admin", "teacher"].includes(user.role) ? (
                <button
                  disabled={user.role === "admin" || user.role === "teacher"}
                  class="mx-auto rounded-lg bg-middle-tomato px-4 py-2 text-sm lg:px-6 lg:py-3 lg:text-base"
                >
                  Cancel Subscription
                </button>
              ) : (
                <button
                  onClick$={handleUpgrade}
                  class="w-full rounded-lg bg-primary-dark-gray py-2 text-sm text-background-light-gray lg:py-3 lg:text-base"
                >
                  Upgrade plan
                </button>
              )}
            </div>
          </div>
          {user.role === "free" && (
            <p class="text-base dark:text-background-light-gray lg:text-sm">
              You current do not have any active subscription 🥲
            </p>
          )}
          {user.role === "admin" && (
            <p class="text-base dark:text-background-light-gray lg:text-sm">
              You have an admin role!
            </p>
          )}
          {user.role === "teacher" && (
            <p class="text-base dark:text-background-light-gray lg:text-sm">
              You have a teacher role!
            </p>
          )}
        </div>
      </div>
    </div>
  );
});
