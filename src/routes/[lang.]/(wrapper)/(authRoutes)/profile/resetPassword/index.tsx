import { component$, useSignal, useStore, useTask$ } from "@builder.io/qwik";
import { DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
import { useResetPassword } from "~/action/userAction";
import { auth } from "~/auth/lucia";

import { eq } from "drizzle-orm";
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
      <div class="dark:border-trasparent flex w-[50vw] min-w-[400px] max-w-[700px] flex-col items-center justify-center gap-6 rounded-lg border-2 border-primary-dark-gray bg-background-light-gray py-16 dark:bg-black/20">
        <h1 class="pb-6 text-center font-mosk text-[2.5rem] font-bold tracking-wider">
          Reset Password
        </h1>
        {!canResetPassword && (
          <>
            <p class="block w-[500px] pb-6 text-center text-tomato">
              You did not sign up with email and password and is not allowed to reset your password.
            </p>
          </>
        )}
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
            class="w-full space-y-6"
          >
            <div>
              <label for="oldPassword" class="cursor-pointer text-lg">
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
                    "block w-full rounded-md border-2 px-3 py-2 disabled:bg-gray-300 dark:border-primary-dark-gray dark:bg-highlight-dark dark:disabled:border-black/20 dark:disabled:bg-black/20 " +
                    (formError.oldPassword ? "border-tomato" : "border-black/10")
                  }
                />
              </div>
              <p class="w-[300px] pt-1 tracking-wide text-tomato">{formError.oldPassword}</p>
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
                    "block w-full rounded-md border-2 px-3 py-2 disabled:bg-gray-300 dark:border-primary-dark-gray dark:bg-highlight-dark dark:disabled:border-black/20 dark:disabled:bg-black/20 " +
                    (formError.newPassword ? "border-tomato" : "border-black/10")
                  }
                />
              </div>
              <p class="w-[300px] pt-1 tracking-wide text-tomato">{formError.newPassword}</p>
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
                    "block w-full rounded-md border-2 px-3 py-2 disabled:bg-gray-300 dark:border-primary-dark-gray dark:bg-highlight-dark dark:disabled:border-black/20 dark:disabled:bg-black/20 " +
                    (formError.rePassword || formError.wrongInfo
                      ? "border-tomato"
                      : "border-black/10")
                  }
                />
              </div>
              <p class="w-[300px] pt-1 text-sm tracking-wide text-tomato">
                {formError.rePassword || formError.wrongInfo}
              </p>
            </div>
            <br />
            <button
              disabled={isSubmitting.value || !canResetPassword}
              type="submit"
              class="block w-full rounded-lg bg-primary-dark-gray p-4 text-background-light-gray"
            >
              {isSubmitting.value && (
                <span>
                  <svg
                    aria-hidden="true"
                    class="inline-block h-4 w-4 animate-spin fill-background-light-gray text-primary-dark-gray"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </span>
              )}
              {!isSubmitting.value && <span>Confirm</span>}
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