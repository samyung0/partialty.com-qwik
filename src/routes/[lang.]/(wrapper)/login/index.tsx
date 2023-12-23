import { component$, useSignal, useStore, useTask$ } from "@builder.io/qwik";
import { Form, Link, useLocation, useNavigate } from "@builder.io/qwik-city";

import Image from "~/assets/img/icon.png?jsx";
import { useLoginWithPassword } from "~/auth/login";
import { Message } from "~/components/ui/message";
import { defaultLoginValue } from "~/types/Signup";

export default component$(() => {
  const nav = useNavigate();
  const loginWithPassword = useLoginWithPassword();
  const params = useLocation().url.searchParams;
  const message: any = useStore({ message: undefined, status: "error" });

  useTask$(({ track }) => {
    track(() => params.get("errMessage"));
    message.message = params.get("errMessage");
  });

  useTask$(({ track }) => {
    track(() => loginWithPassword.status);
    if (loginWithPassword.status === 400)
      message.message = Object.values(loginWithPassword.value?.fieldErrors ?? {})
        .flat()
        .join("\n");
    if (loginWithPassword.status === 500) message.message = loginWithPassword.value?.message;
    if (loginWithPassword.status === 200) nav("/members/dashboard/");
  });

  const test = useSignal<HTMLElement>();
  return (
    <div
      ref={test}
      class="flex min-h-full flex-col justify-center py-12 transition-opacity sm:px-6 lg:px-8"
    >
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/">
          <Image class="mx-auto h-24 w-24" />
        </Link>
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Log in</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link href="/signup/" class="font-medium text-sky-600 hover:text-sky-500">
            create an account
          </Link>
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white px-4 py-8 shadow sm:rounded-sm sm:px-10">
          <div class="">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <Link
                  href="/login/google/"
                  class="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                >
                  <span class="sr-only">Log in with Google</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    class="h-5 w-5"
                    viewBox="0 0 16 16"
                  >
                    {" "}
                    <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />{" "}
                  </svg>
                </Link>
              </div>

              <div>
                <Link
                  href="/login/github/"
                  class="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                >
                  <span class="sr-only">Log in with GitHub</span>
                  <svg class="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
            <div class="relative py-5">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300" />
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="bg-white px-2 text-gray-500">Or log in with password</span>
              </div>
            </div>
          </div>
          <Form action={loginWithPassword} class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Email address</label>
              <div class="mt-1">
                <input
                  value={defaultLoginValue.email}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  class="block w-full appearance-none rounded-sm border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                />
              </div>
              <label class="mt-4 block text-sm font-medium text-gray-700">Password</label>
              <div class="mt-1">
                <input
                  value={defaultLoginValue.password}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="password"
                  required
                  class="block w-full appearance-none rounded-sm border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                />
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="text-sm">
                <Link href="/contact" class="font-medium text-sky-600 hover:text-sky-500">
                  Problems signing in?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                class="flex w-full justify-center rounded-sm border border-transparent bg-sky-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:bg-gray-500 disabled:hover:bg-gray-500"
              >
                Log in
              </button>
            </div>
          </Form>
          <Message message={message} classText="mt-3" />
        </div>
      </div>
    </div>
  );
});
