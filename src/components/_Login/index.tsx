import { component$, useSignal, useStore, useTask$ } from "@builder.io/qwik";
import { Link, useLocation, useNavigate } from "@builder.io/qwik-city";
import { useLoginWithPassword } from "~/auth/login";

import GithubIcon from "~/assets/svg/logo-github.svg";
import GoogleIcon from "~/assets/svg/logo-google.svg";

export default component$(() => {
  const loginWithPassword = useLoginWithPassword();
  const search = useLocation().url.search;
  const params = useLocation().url.searchParams;
  const formError = useStore({
    email: "",
    password: "",
    wrongInfo: "",
  });
  const form = useStore({
    email: "",
    password: "",
  });
  const nav = useNavigate();
  const isLoggingIn = useSignal(false);
  useTask$(({ track }) => {
    track(() => params.get("errMessage"));
    formError.wrongInfo = params.get("errMessage") ?? "";
  });

  useTask$(({ track }) => {
    track(() => loginWithPassword.status);
    if (loginWithPassword.status === 400) {
      formError.email = loginWithPassword.value?.fieldErrors?.email?.join("\n") ?? "";
      formError.password = loginWithPassword.value?.fieldErrors?.password?.join("\n") ?? "";
    }
    if (loginWithPassword.status === 500) formError.wrongInfo = loginWithPassword.value?.message;
    if (loginWithPassword.status === 200) {
      if (params.get("redirectedFrom")) nav(params.get("redirectedFrom")!);
      else nav("/members/dashboard/");
    }
    isLoggingIn.value = false;
  });
  return (
    <section class="flex h-[100vh] items-center justify-center bg-sherbet">
      <div class="flex w-[50vw] min-w-[400px] max-w-[700px] items-center justify-center rounded-lg border-2 border-black bg-white py-16">
        <div>
          <h1 class="pb-6 text-center font-mosk text-[2.5rem] font-bold tracking-wider">Login</h1>
          <br />
          <form
            preventdefault:submit
            onSubmit$={() => {
              isLoggingIn.value = true;
              loginWithPassword.submit({
                email: form.email,
                password: form.password,
              });
            }}
            class="space-y-6"
          >
            <div>
              <label for="email" class="cursor-pointer text-lg">
                Email address
              </label>
              <div class="pt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onInput$={(_, el) => (form.email = el.value)}
                  required
                  class={
                    "block w-[300px] rounded-md border-2 px-3 py-2 " +
                    (formError.email || formError.wrongInfo ? "border-tomato" : "border-black/10")
                  }
                />
              </div>
              <p class="w-[300px] pt-1 tracking-wide text-tomato">{formError.email}</p>
            </div>
            <div>
              <label for="password" class="cursor-pointer text-lg">
                Password
              </label>
              <div class="pt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="password"
                  value={form.password}
                  onInput$={(_, el) => (form.password = el.value)}
                  required
                  class={
                    "block w-[300px] rounded-md border-2 px-3 py-2 " +
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
              disabled={isLoggingIn.value}
              type="submit"
              class="block w-full rounded-lg bg-primary-dark-gray p-4 text-background-light-gray"
            >
              {isLoggingIn.value && (
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
              {!isLoggingIn.value && <span>Log in</span>}
            </button>
          </form>

          <div class="relative my-10 mb-6 flex items-center">
            <span class="inline-block h-[3px] flex-1 bg-black/10"></span>
            <span class="px-4 tracking-wide">or</span>
            <span class="inline-block h-[3px] flex-1 bg-black/10"></span>
          </div>

          <div class="flex items-center justify-evenly">
            <Link class="p-4 pt-0" aria-label="Login With Google" href={"/login/google/" + search}>
              <img src={GoogleIcon} alt="Login With Google" width={55} height={55} />
            </Link>
            <Link class="p-4 pt-0" aria-label="Login With Github" href={"/login/github/" + search}>
              <img src={GithubIcon} alt="Login With Github" width={50} height={50} />
            </Link>
          </div>

          <div class="pt-4 text-center">
            <Link
              prefetch
              href="/signup/"
              class="inline-block underline decoration-wavy underline-offset-8"
            >
              New User? Click Here to Sign up
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
});
