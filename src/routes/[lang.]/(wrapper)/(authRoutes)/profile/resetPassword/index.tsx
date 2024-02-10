import { component$, useSignal, useStore } from "@builder.io/qwik";

import { useUserLoader } from "~/routes/[lang.]/(wrapper)/(authRoutes)/layout";
import type { LuciaSession } from "~/types/LuciaSession";

export default component$(() => {
  const user: LuciaSession["user"] = useUserLoader().value;
  const isSubmitting = useSignal(false);
  const formError = useStore({
    email: "",
    password: "",
    wrongInfo: "",
  });
  const formData = useStore({
    id: user.userId,
    oldPassword: "",
    newPassword: "",
    newPasswordAgain: "",
  });
  return (
    <section class="flex h-[100vh] items-center justify-center bg-sherbet">
      <div class="flex w-[50vw] min-w-[400px] max-w-[700px] items-center justify-center rounded-lg border-2 border-black bg-white py-16">
        <div>
          <h1 class="pb-6 text-center font-mosk text-[2.5rem] font-bold tracking-wider">
            Reset Password
          </h1>
          <br />
          <form preventdefault:submit onSubmit$={() => {}} class="w-full space-y-6">
            <div>
              <label for="email" class="cursor-pointer text-lg">
                Old password
              </label>
              <div class="pt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.oldPassword}
                  onInput$={(e, eventTarget) => (formData.oldPassword = eventTarget.value)}
                  required
                  class={"block w-full rounded-md border-2 px-3 py-2 "}
                />
              </div>
            </div>
            <div>
              <label for="password" class="cursor-pointer text-lg">
                New password
              </label>
              <div class="pt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.newPassword}
                  onInput$={(e, eventTarget) => (formData.newPassword = eventTarget.value)}
                  required
                  class={
                    "block w-full rounded-md border-2 px-3 py-2" +
                    (formError.password || formError.wrongInfo
                      ? "border-tomato"
                      : "border-black/10")
                  }
                />
              </div>
              <p class="w-[300px] pt-1 text-sm tracking-wide text-tomato">
                {formError.password || formError.wrongInfo}
              </p>
            </div>
            <div>
              <label for="password" class="cursor-pointer text-lg">
                Re-enter new password
              </label>
              <div class="pt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.newPasswordAgain}
                  onInput$={(_, el) => (formData.newPasswordAgain = el.value)}
                  required
                  class={
                    "block w-full rounded-md border-2 px-3 py-2" +
                    (formError.password || formError.wrongInfo
                      ? "border-tomato"
                      : "border-black/10")
                  }
                />
              </div>
              <p class="w-[300px] pt-1 text-sm tracking-wide text-tomato">
                {formError.password || formError.wrongInfo}
              </p>
            </div>
            <br />
            <button
              disabled={isSubmitting.value}
              type="submit"
              class="block w-full rounded-lg bg-primary-dark-gray p-4 text-background-light-gray"
            >
              {!isSubmitting.value && <span>Confirm</span>}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
});
