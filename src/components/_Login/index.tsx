import { component$, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { Link, useLocation, useNavigate } from '@builder.io/qwik-city';
import { useLoginWithPassword } from '~/auth/login';

import GithubIcon from '~/assets/svg/logo-github.svg';
import GoogleIcon from '~/assets/svg/logo-google.svg';
import LoadingSVG from '~/components/LoadingSVG';

export default component$(() => {
  const loginWithPassword = useLoginWithPassword();
  const search = useLocation().url.search;
  const params = useLocation().url.searchParams;
  const formError = useStore({
    email: '',
    password: '',
    wrongInfo: '',
  });
  const form = useStore({
    email: '',
    password: '',
  });
  const nav = useNavigate();
  const isLoggingIn = useSignal(false);
  useTask$(({ track }) => {
    track(() => params.get('errMessage'));
    formError.wrongInfo = params.get('errMessage') ?? '';
  });

  useTask$(({ track }) => {
    track(loginWithPassword);
    formError.email = '';
    formError.password = '';
    formError.wrongInfo = '';
    if (loginWithPassword.status === 400) {
      formError.email = loginWithPassword.value?.fieldErrors?.email?.join('\n') ?? '';
      formError.password = loginWithPassword.value?.fieldErrors?.password?.join('\n') ?? '';
    }
    if (loginWithPassword.status === 500) formError.wrongInfo = loginWithPassword.value?.message;
    if (loginWithPassword.status === 200) {
      if (params.get('redirectedFrom')) nav(params.get('redirectedFrom')!);
      else nav('/members/dashboard/');
    }
  });
  return (
    <section class="flex h-[100vh] items-center justify-center bg-sherbet">
      <div class="flex w-[95vw] items-center justify-center  rounded-lg  border-2 border-black bg-white py-16 md:w-[50vw] md:min-w-[500px] md:max-w-[600px]">
        <div>
          <h1 class="pb-6 text-center font-mosk text-[2rem] font-bold md:text-[2.5rem] md:tracking-wider">Login</h1>
          <br />
          <form
            preventdefault:submit
            onSubmit$={async () => {
              isLoggingIn.value = true;
              formError.email = '';
              formError.password = '';
              formError.wrongInfo = '';
              await loginWithPassword.submit({
                email: form.email,
                password: form.password,
              });
              isLoggingIn.value = false;
            }}
            class="space-y-3 md:space-y-6"
          >
            <div>
              <label for="email" class="cursor-pointer text-base md:text-lg">
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
                    'block w-[250px] rounded-md border-2 px-3 py-2 text-[0.875rem] md:w-[300px] md:text-[1rem] ' +
                    (formError.email || formError.wrongInfo ? 'border-tomato' : 'border-black/10')
                  }
                />
              </div>
              <p class="w-[250px] pt-1 text-[0.75rem] tracking-normal text-tomato md:w-[300px] md:text-[1rem] md:tracking-wide">
                {formError.email}
              </p>
            </div>
            <div>
              <label for="password" class="cursor-pointer text-base md:text-lg">
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
                    'block w-[250px] rounded-md border-2 px-3 py-2 text-[0.875rem] md:w-[300px] md:text-[1rem]' +
                    (formError.password || formError.wrongInfo ? 'border-tomato' : 'border-black/10')
                  }
                />
              </div>
              <p class="w-[250px] pt-1 text-[0.75rem] tracking-normal text-tomato md:w-[300px] md:text-[1rem] md:tracking-wide">
                {formError.password || formError.wrongInfo}
              </p>
            </div>
            <br />
            <button
              disabled={isLoggingIn.value}
              type="submit"
              class="block w-full rounded-lg bg-primary-dark-gray p-3 text-background-light-gray md:p-4"
            >
              {isLoggingIn.value && (
                <span>
                  <LoadingSVG />
                </span>
              )}
              {!isLoggingIn.value && <span class="text-[0.875rem] md:text-[1rem]">Log in</span>}
            </button>
          </form>

          <div class="relative mx-auto my-8 mb-4 flex items-center self-stretch md:my-10 md:mb-6">
            <span class="inline-block h-[3px] flex-1 bg-black/10"></span>
            <span class="px-4 tracking-wide">or</span>
            <span class="inline-block h-[3px] flex-1 bg-black/10"></span>
          </div>

          <div class="mx-auto flex w-[60%] items-center justify-evenly self-stretch md:w-full">
            <Link class="p-4 pt-0" aria-label="Login With Google" href="/login/google/">
              <img
                src={GoogleIcon}
                alt="Login With Google"
                width={55}
                height={55}
                class="h-[40px] w-[40px] md:h-[55px] md:w-[55px]"
              />
            </Link>
            <Link class="p-4 pt-0" aria-label="Login With Github" href="/login/github/">
              <img
                src={GithubIcon}
                alt="Login With Github"
                width={50}
                height={50}
                class="h-[35px] w-[35px] md:h-[50px] md:w-[50px]"
              />
            </Link>
          </div>

          <div class="text-center md:pt-4">
            <Link
              prefetch
              href="/signup/"
              class="inline-block text-[0.75rem] underline decoration-wavy underline-offset-[6px] md:text-[1rem]"
            >
              New User? Click Here to Sign up
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
});
