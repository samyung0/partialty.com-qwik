import { component$, useSignal, useStore, useTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { useResetPassword } from "~/action/userAction";
import { auth } from "~/auth/lucia";

import { eq } from "drizzle-orm";
import LoadingSVG from "~/components/LoadingSVG";
import { useUserLoader } from "~/routes/[lang.]/(wrapper)/(authRoutes)/layout";
import drizzleClient from "~/utils/drizzleClient";
import { user_key } from "../../../../../../../drizzle_turso/schema/user_key";

export const useCanResetPasswordLoader = routeLoader$<[boolean, string]>(async (requestEvent) => {
  const user = await requestEvent.resolveValue(useUserLoader);
  const keys = await auth().getAllUserKeys(user.userId);
  const emailKey = keys.filter((key) => key.providerId === "email");
  const hash =
    (
      await drizzleClient()
        .select({ hashed_password: user_key.hashed_password })
        .from(user_key)
        .where(eq(user_key.user_id, user.userId))
    )[0].hashed_password || "";
  return [emailKey.length > 0, hash];
});

export default component$(() => {
  const user = useUserLoader().value;
  const canResetPassword = useCanResetPasswordLoader().value[0];

  const resetPassword = useResetPassword();
  const isSubmitting = useSignal(false);
  const formError = useStore({
    oldPassword: "",
    newPassword: "",
    rePassword: "",
    wrongInfo: "",
  });
  const formData = useStore({
    userId: user.userId,
    hash: useCanResetPasswordLoader().value[1],
    oldPassword: "",
    newPassword: "",
    rePassword: "",
  });
  useTask$(({ track }) => {
    track(resetPassword);
    formError.oldPassword = "";
    formError.newPassword = "";
    formError.rePassword = "";
    formError.wrongInfo = "";
    if (resetPassword.status === 400) {
      formError.newPassword = resetPassword.value?.fieldErrors?.newPassword?.join("\n") ?? "";
      formError.oldPassword = resetPassword.value?.fieldErrors?.oldPassword?.join("\n") ?? "";
      formError.rePassword = resetPassword.value?.fieldErrors?.rePassword?.join("\n") ?? "";
      if (resetPassword.value?.formErrors && resetPassword.value.formErrors.length > 0)
        formError.rePassword = resetPassword.value.formErrors.join("\n");
    }
    if (resetPassword.status === 500) {
      if (resetPassword.value?.message === `Wrong old password!`)
        formError.oldPassword = resetPassword.value.message;
      else formError.wrongInfo = resetPassword.value?.message;
    }
    if (resetPassword.status === 200) (window as any).location = "/profile/";
  });
  return (
    <section class="flex h-[100vh] items-center justify-center bg-sherbet dark:bg-primary-dark-gray dark:text-background-light-gray">
      <div class="dark:border-trasparent flex w-[95vw] flex-col items-center justify-center gap-3 rounded-lg border-2 border-primary-dark-gray bg-background-light-gray py-10 dark:bg-black/20 md:w-[50vw] md:min-w-[400px] md:max-w-[700px] md:gap-6 md:py-16">
        <h1 class="pb-6 text-center font-mosk text-[2rem] font-bold tracking-wider md:text-[2.5rem]">
          Reset Password
        </h1>
        {/* {!canResetPassword && (
          <>
            <p class="block lg:w-[500px] lg:px-12 px-8 lg:pb-6 pb-4 text-center text-tomato md:text-[1rem] text-[0.875rem]">
              You did not sign up with email and password and is not allowed to reset your password.
            </p>
          </>
        )} */}
        <div>
          <form
            preventdefault:submit
            onSubmit$={() => {
              if (!canResetPassword) return;
              isSubmitting.value = true;
              formError.oldPassword = "";
              formError.newPassword = "";
              formError.rePassword = "";
              formError.wrongInfo = "";
              resetPassword.submit(formData).then(() => {
                isSubmitting.value = false;
              });
            }}
            class="w-full space-y-3 md:space-y-6"
          >
            <div>
              <label for="oldPassword" class="cursor-pointer text-base md:text-lg">
                Old password
              </label>
              <div class="pt-1">
                <input
                  disabled={!canResetPassword}
                  id="oldPassword"
                  name="oldPassword"
                  type="password"
                  value={formData.oldPassword}
                  onInput$={(e, eventTarget) => (formData.oldPassword = eventTarget.value)}
                  required
                  class={
                    "block w-full rounded-md border-2 px-3 py-2 text-[0.875rem] disabled:bg-gray-300 dark:border-primary-dark-gray dark:bg-highlight-dark dark:disabled:border-black/20  dark:disabled:bg-black/20 md:text-[1rem] " +
                    (formError.oldPassword ? "border-tomato" : "border-black/10")
                  }
                />
              </div>
              <p class="w-[250px] pt-1 text-[0.75rem] tracking-normal text-tomato md:w-[300px] md:text-[1rem] md:tracking-wide">
                {formError.oldPassword}
              </p>
            </div>
            <div>
              <label for="password" class="cursor-pointer text-lg">
                New password
              </label>
              <div class="pt-1">
                <input
                  disabled={!canResetPassword}
                  id="password"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onInput$={(e, eventTarget) => (formData.newPassword = eventTarget.value)}
                  required
                  class={
                    "block w-full rounded-md border-2 px-3 py-2 text-[0.875rem] disabled:bg-gray-300 dark:border-primary-dark-gray dark:bg-highlight-dark dark:disabled:border-black/20   dark:disabled:bg-black/20 md:text-[1rem] " +
                    (formError.newPassword ? "border-tomato" : "border-black/10")
                  }
                />
              </div>
              <p class="w-[250px] pt-1 text-[0.75rem] tracking-normal text-tomato md:w-[300px] md:text-[1rem] md:tracking-wide">
                {formError.newPassword}
              </p>
            </div>
            <div>
              <label for="rePassword" class="cursor-pointer text-lg">
                Re-enter new password
              </label>
              <div class="pt-1">
                <input
                  disabled={!canResetPassword}
                  id="rePassword"
                  name="rePassword"
                  type="password"
                  value={formData.rePassword}
                  onInput$={(_, el) => (formData.rePassword = el.value)}
                  required
                  class={
                    "block w-full rounded-md border-2 px-3 py-2 text-[0.875rem] disabled:bg-gray-300 dark:border-primary-dark-gray dark:bg-highlight-dark dark:disabled:border-black/20   dark:disabled:bg-black/20 md:text-[1rem] " +
                    (formError.rePassword || formError.wrongInfo
                      ? "border-tomato"
                      : "border-black/10")
                  }
                />
              </div>
              <p class="w-[250px] pt-1 text-[0.75rem] tracking-normal text-tomato md:w-[300px] md:text-[1rem] md:tracking-wide">
                {formError.rePassword || formError.wrongInfo}
              </p>
            </div>
            <br />
            <button
              disabled={isSubmitting.value || !canResetPassword}
              type="submit"
              class="block w-full rounded-lg bg-primary-dark-gray p-3 text-background-light-gray md:p-4"
            >
              {isSubmitting.value && (
                <span>
                  <LoadingSVG />
                </span>
              )}
              {!isSubmitting.value && <span class="text-[0.875rem] md:text-[1rem]">Confirm</span>}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
});

export const head: DocumentHead = {
  title: "Reset Password",
  meta: [
    {
      name: "description",
      content: "A page to reset your password.",
    },
  ],
};
