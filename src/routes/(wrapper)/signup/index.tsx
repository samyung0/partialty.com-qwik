import { $, component$, useSignal, useStore } from "@builder.io/qwik";
import { Link, useNavigate } from "@builder.io/qwik-city";

import Image from "~/assets/img/icon.png?jsx";
import { Message } from "~/components/ui/message";
import { emailLoginSchema, initialFormValue, type EmailLoginForm } from "~/types/AuthForm";
import { signUpWithPassword } from "~/utils/auth";

export default component$(() => {
  const message = useStore<any>({ message: undefined, status: "error" });
  const isLoading = useSignal(false);
  const emailForm = useStore(Object.assign({}, initialFormValue) as EmailLoginForm);
  const nav = useNavigate();
  const termsChecked = useSignal(false);

  const handleEmailSignup = $(() => {
    isLoading.value = true;

    if (!termsChecked.value) {
      message.message = "You must agree to our terms, privacy and disclaimer before signing up";
      isLoading.value = false;
      return;
    }

    const result = emailLoginSchema.safeParse(emailForm);
    if (!result.success) {
      message.message = result.error.issues[0].message;
      isLoading.value = false;
      return;
    }

    signUpWithPassword(
      result.data,
      $(() => {
        isLoading.value = false;
        nav("/");
      }),
      $((e) => {
        isLoading.value = false;
        message.message = e;
      })
    );
  });

  return (
    <div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/">
          <Image class="mx-auto h-24 w-24" />
        </Link>
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign up</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link href="/login" class="font-medium text-green-600 hover:text-green-500">
            log in to my account
          </Link>
        </p>
      </div>

      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white px-4 py-8 shadow sm:rounded-sm sm:px-10">
          <form onSubmit$={handleEmailSignup} preventdefault:submit class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Email address</label>
              <div class="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={emailForm.email}
                  onInput$={(e: any) => (emailForm.email = e.target.value)}
                  class="block w-full appearance-none rounded-sm border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Password</label>
              <div class="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="password"
                  required
                  value={emailForm.password}
                  onInput$={(e: any) => (emailForm.password = e.target.value)}
                  class="block w-full appearance-none rounded-sm border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                />
              </div>
            </div>

            <div class="flex flex-col items-start justify-between space-y-4">
              <div class="flex items-center">
                <input
                  bind:checked={termsChecked}
                  id="terms"
                  name="terms"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                />
                <label class="ml-2 block text-sm text-gray-900">
                  <span>
                    Agree to{" "}
                    <Link href="/terms">
                      <span class="text-sky-500 hover:text-sky-400">terms</span>
                    </Link>
                    ,{" "}
                    <Link href="/privacy">
                      <span class="text-sky-500 hover:text-sky-400">privacy</span>
                    </Link>{" "}
                    and{" "}
                    <button onClick$={() => nav("/disclaimer")}>
                      <span class="text-sky-500 hover:text-sky-400">disclaimer</span>
                    </button>
                  </span>
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading.value}
                class="flex w-full justify-center rounded-sm border border-transparent bg-sky-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:bg-gray-500 disabled:hover:bg-gray-500"
              >
                Sign up
              </button>
            </div>
            <Message message={message} />
          </form>
        </div>
      </div>
    </div>
  );
});
