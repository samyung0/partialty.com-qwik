import type { Signal } from '@builder.io/qwik';
import { $, component$, useComputed$, useSignal, useStore, useTask$, useVisibleTask$ } from '@builder.io/qwik';
import { Link, useLocation, useNavigate } from '@builder.io/qwik-city';
import { useSetBio, useSignupWithPassword } from '~/auth/signup';
import recaptcha from '~/components/_Signup/recaptcha';
export { recaptcha };

import GithubIcon from '~/assets/svg/logo-github.svg';
import GoogleIcon from '~/assets/svg/logo-google.svg';
import { CLOUDINARY_MAX_IMG_SIZE, CLOUDINARY_MAX_PIXEL_COUNT } from '~/const/cloudinary';
import type { CloudinaryDefaultPic } from '~/types/Cloudinary';

import RandomAvatar from '~/assets/svg/shuffle-outline.svg';
import DeleteAvatar from '~/assets/svg/trash-outline.svg';

import DragndropLarge from '~/components/_Signup/dragndropLarge';
import LoadingSVG from '~/components/LoadingSVG';

export default component$(
  ({ cloudinaryDefaultPics }: { cloudinaryDefaultPics: Signal<CloudinaryDefaultPic[] | null | undefined> }) => {
    const params = useLocation().url.searchParams;
    const setBio = useSetBio();
    const signupWithPassword = useSignupWithPassword();

    const recaptchaReady = useSignal(false);

    const firstForm = useStore({
      email: '',
      password: '',
      rePassword: '',
    });
    const loadingStepOne = useSignal(false);
    const loadingStepTwo = useSignal(false);

    const formError = useStore({
      email: '',
      password: '',
      wrongRePassword: '',
      wrongInfo: '',
      error: '',
    });
    const bioError = useStore({
      avatar: '',
      nickname: '',
      wrongInfo: '',
    });
    const nav = useNavigate();
    const isSetBio = useSignal(false);
    const originalAvatar = useComputed$(() =>
      cloudinaryDefaultPics.value
        ? cloudinaryDefaultPics.value[Math.floor(Math.random() * cloudinaryDefaultPics.value.length)]
        : {
            width: 0,
            height: 0,
            bytes: 0,
            pixels: 0,
            secure_url: '',
            public_id: '',
          }
    );
    const defaultBio = useStore<{
      avatar: CloudinaryDefaultPic;
      nickname: string;
      userId: string | null;
    }>({
      avatar: JSON.parse(JSON.stringify(originalAvatar.value)),
      nickname: 'Anonymous',
      userId: null,
    });
    useTask$(({ track }) => {
      track(originalAvatar);
      defaultBio.avatar = JSON.parse(JSON.stringify(originalAvatar.value));
    });
    const customAvatar = useSignal(false);

    useTask$(({ track }) => {
      track(() => params.get('errMessage'));
      formError.wrongInfo = params.get('errMessage') ?? '';
    });

    useTask$(({ track }) => {
      track(signupWithPassword);
      formError.email = '';
      formError.password = '';
      formError.wrongRePassword = '';
      formError.wrongInfo = '';
      formError.error = '';
      if (signupWithPassword.status === 400) {
        formError.email = signupWithPassword.value?.fieldErrors?.email?.join('\n') ?? '';
        formError.password = signupWithPassword.value?.fieldErrors?.password?.join('\n') ?? '';
        if (signupWithPassword.value?.formErrors && signupWithPassword.value.formErrors.length > 0)
          formError.wrongRePassword = signupWithPassword.value.formErrors.join('\n');
      }
      if (signupWithPassword.status === 500) {
        if (signupWithPassword.value?.message === `Error! User already exists`)
          formError.wrongInfo = signupWithPassword.value.message;
        else formError.error = signupWithPassword.value?.message;
      }
      if (signupWithPassword.status === 200) {
        if (!signupWithPassword.value?.userId) {
          formError.error = 'Server Error! Please try again later';
          return;
        }
        isSetBio.value = true;
        firstForm.email = '';
        firstForm.password = '';
        firstForm.rePassword = '';
        defaultBio.userId = signupWithPassword.value.userId;
      }
    });

    useTask$(({ track }) => {
      track(setBio);
      bioError.nickname = '';
      bioError.wrongInfo = '';
      if (setBio.status === 400) {
        bioError.nickname = setBio.value?.fieldErrors?.nickname?.join('\n') ?? '';
      }
      if (setBio.status === 500) {
        bioError.wrongInfo = setBio.value?.message || '';
      }
      if (setBio.status === 200) {
        // (window as any).location = "/members/dashboard/";
        if (params.get('redirectedFrom')) nav(params.get('redirectedFrom')!);
        else nav('/members/dashboard/');
      }
    });

    useVisibleTask$(() => {
      const recaptcha = document.createElement('script');
      recaptcha.src = 'https://www.google.com/recaptcha/api.js?render=' + import.meta.env.VITE_GOOGLE_RECAPTCHA_V3;
      recaptcha.async = true;
      recaptcha.onload = () => {
        (globalThis as any).grecaptcha.ready(function () {
          recaptchaReady.value = true;
        });
      };
      document.body.append(recaptcha);
    });

    const restoreOriginalAvatar = $(() => {
      defaultBio.avatar = JSON.parse(JSON.stringify(originalAvatar.value));
      customAvatar.value = false;
      bioError.avatar = '';
    });

    const randomizeDefaultAvatar = $(() => {
      if (!cloudinaryDefaultPics.value) return;
      defaultBio.avatar = JSON.parse(
        JSON.stringify(cloudinaryDefaultPics.value[Math.floor(Math.random() * cloudinaryDefaultPics.value.length)])
      );
      customAvatar.value = false;
      bioError.avatar = '';
    });

    const handleImage = $((file: File) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onabort = () => (bioError.avatar = 'Cannot load image!');
      reader.onerror = () => (bioError.avatar = 'Cannot load image!');
      reader.onload = () => {
        if (!reader.result) {
          bioError.avatar = 'Cannot load image!';
          return;
        }
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          if (file.size > CLOUDINARY_MAX_IMG_SIZE || img.width * img.height > CLOUDINARY_MAX_PIXEL_COUNT) {
            bioError.avatar = 'The picture is too large!';
            return;
          }

          customAvatar.value = true;
          defaultBio.avatar.secure_url = reader.result as string;
          defaultBio.avatar.width = img.width;
          defaultBio.avatar.height = img.height;
          defaultBio.avatar.pixels = img.width * img.height;
          defaultBio.avatar.bytes = file.size;
          defaultBio.avatar.public_id = '';
          bioError.avatar = '';
        };
      };
    });

    const handleSubmitPartOne = $(async () => {
      if (!recaptchaReady.value) {
        formError.error = 'Holdon, we are still loading google captcha :P';
        return;
      }
      loadingStepOne.value = true;
      formError.email = '';
      formError.password = '';
      formError.wrongRePassword = '';
      formError.wrongInfo = '';
      formError.error = '';
      const captchaResult = await (globalThis as any).grecaptcha
        .execute(import.meta.env.VITE_GOOGLE_RECAPTCHA_V3, { action: 'submit' })
        .then(async (token: string) => await recaptcha(token));
      if (!captchaResult.success) {
        loadingStepOne.value = false;
        formError.error = 'Looks like captcha thinks that you are not a human (。_。)';
        return;
      }
      await signupWithPassword.submit({
        ...firstForm,
        avatar_cloudinary_id: defaultBio.avatar.public_id,
        nickname: defaultBio.nickname,
      });
      loadingStepOne.value = false;
    });

    return (
      <section class="flex h-[100vh] items-center justify-center bg-light-yellow dark:bg-primary-dark-gray dark:text-background-light-gray">
        <div class="w-[95vw] overflow-hidden md:w-[50vw] md:min-w-[500px]  md:max-w-[600px] ">
          <div class="flex w-[190vw] items-center justify-start overflow-hidden md:w-[100vw] md:min-w-[1000px] md:max-w-[1200px]">
            <div
              class={
                ' max-h-[95vh] w-[95vw] overflow-auto rounded-lg border-2 border-black bg-white dark:bg-highlight-dark transition-transform md:w-[50vw] md:min-w-[500px] md:max-w-[600px] ' +
                (isSetBio.value ? 'translate-x-[-101%]' : '')
              }
            >
              <div class="flex flex-col items-center justify-center py-10 md:py-16">
                <div>
                  <h1 class="text-center font-mosk text-[2rem] font-bold tracking-wide md:text-[2.5rem] md:tracking-wider">
                    Sign up
                  </h1>
                  <br />
                  <form preventdefault:submit onSubmit$={handleSubmitPartOne} class="space-y-3 md:space-y-6">
                    <input
                      type="text"
                      name="avatar_cloudinary_id"
                      hidden
                      class="hidden"
                      aria-hidden
                      value={defaultBio.avatar.public_id}
                    />
                    <input type="text" name="nickname" hidden class="hidden" aria-hidden value={defaultBio.nickname} />
                    <div>
                      <label for="email" class="cursor-pointer text-base md:text-lg">
                        Email address
                      </label>
                      <div class="md:pt-1">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={firstForm.email}
                          onInput$={(_, el) => (firstForm.email = el.value)}
                          class={
                            'block w-[250px] rounded-md border-2 px-3 py-2 text-[0.875rem] md:w-[300px] md:text-[1rem] ' +
                            (formError.email || formError.wrongInfo ? 'border-tomato' : 'border-black/10')
                          }
                        />
                      </div>
                      <p class="w-[250px] pt-1 text-[0.75rem] tracking-normal text-tomato md:w-[300px] md:text-[1rem] md:tracking-wide">
                        {formError.email || formError.wrongInfo}
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
                          autoComplete="off"
                          required
                          value={firstForm.password}
                          onInput$={(_, el) => (firstForm.password = el.value)}
                          class={
                            'block w-[250px] rounded-md border-2 px-3 py-2 text-[0.875rem] md:w-[300px] md:text-[1rem] ' +
                            (formError.password ? 'border-tomato' : 'border-black/10')
                          }
                        />
                      </div>
                      <p class="w-[250px] pt-1 text-[0.75rem] tracking-normal text-tomato md:w-[300px] md:text-[1rem] md:tracking-wide">
                        {formError.password}
                      </p>
                    </div>
                    <div>
                      <label for="rePassword" class="cursor-pointer text-base md:text-lg">
                        Re-enter Password
                      </label>
                      <div class="pt-1">
                        <input
                          id="rePassword"
                          name="rePassword"
                          type="password"
                          autoComplete="off"
                          required
                          value={firstForm.rePassword}
                          onInput$={(_, el) => (firstForm.rePassword = el.value)}
                          class={
                            'block w-[250px] rounded-md border-2 px-3 py-2 text-[0.875rem] md:w-[300px] md:text-[1rem] ' +
                            (formError.wrongRePassword ? 'border-tomato' : 'border-black/10')
                          }
                        />
                      </div>
                      <p class="w-[250px] pt-1 text-[0.75rem] tracking-normal text-tomato md:w-[300px] md:text-[1rem] md:tracking-wide">
                        {formError.wrongRePassword || formError.error}
                      </p>
                    </div>
                    {/* <div class="g-recaptcha" data-sitekey={"6LcrulQpAAAAAEaVgoLxOZRbQMwIFYBDwHj0VAXG"}>
                    Submit
                  </div> */}
                    <br />
                    <button
                      type="submit"
                      class={
                        'relative block w-full rounded-lg bg-primary-dark-gray p-3 text-background-light-gray transition-all md:p-4'
                      }
                      disabled={isSetBio.value || loadingStepOne.value}
                    >
                      {loadingStepOne.value && (
                        <span>
                          <LoadingSVG />
                        </span>
                      )}
                      {!loadingStepOne.value && <span class="text-[0.875rem] md:text-[1rem]">Yup, Next</span>}
                    </button>
                  </form>

                  <div class="relative mx-auto my-8 mb-4 flex items-center self-stretch md:my-10 md:mb-6">
                    <span class="inline-block h-[3px] flex-1 bg-black/10 dark:bg-gray-300"></span>
                    <span class="px-4 tracking-wide">or</span>
                    <span class="inline-block h-[3px] flex-1 bg-black/10 dark:bg-gray-300"></span>
                  </div>

                  <div class="mx-auto flex w-[60%] items-center justify-evenly self-stretch md:w-full">
                    <Link class="p-4 pt-0" aria-label="Login With Google" href="/login/google/">
                      <img
                        src={GoogleIcon}
                        alt="Login With Google"
                        width={55}
                        height={55}
                        class="h-[45px] w-[45px] md:h-[55px] md:w-[55px]"
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
                      href="/login/"
                      class="inline-block text-[0.75rem] underline decoration-wavy underline-offset-[6px] md:text-[1rem]"
                    >
                      Have an account already? Come here
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div
              class={
                'flex w-[95vw] items-center justify-center rounded-lg border-2 border-black bg-white dark:bg-highlight-dark py-10 transition-transform md:w-[50vw] md:min-w-[500px] md:max-w-[600px] md:py-16 ' +
                (isSetBio.value ? 'translate-x-[-100%]' : '')
              }
            >
              <div class="flex flex-col items-center justify-center">
                <h1 class="pb-6 text-center font-mosk text-[1.5rem] font-bold tracking-wide md:text-[2rem] md:tracking-wider">
                  Let's make a funny profile.
                </h1>
                <br />
                <form preventdefault:submit class="relative space-y-3 md:space-y-6">
                  <div class="absolute right-0 top-0 flex flex-col gap-2 p-2">
                    <button type="button" onClick$={restoreOriginalAvatar}>
                      <img src={DeleteAvatar} alt="Delete" width={25} height={25} class="object-contain dark:invert" />
                    </button>
                    <button type="button" onClick$={randomizeDefaultAvatar}>
                      <img src={RandomAvatar} alt="Randomize" width={25} height={25} class="object-contain dark:invert" />
                    </button>
                  </div>
                  <DragndropLarge
                    width={defaultBio.avatar.width}
                    height={defaultBio.avatar.height}
                    secure_url={defaultBio.avatar.secure_url}
                    handleImage={handleImage}
                    bioErrorMsg={bioError.avatar}
                  ></DragndropLarge>
                  <div>
                    <label for="nickname" class="cursor-pointer text-base md:text-lg">
                      Nickname
                    </label>
                    <div class="pt-1">
                      <input
                        value={defaultBio.nickname}
                        onInput$={(_, el) => (defaultBio.nickname = el.value)}
                        id="nickname"
                        name="nickname"
                        type="text"
                        autoComplete="off"
                        required
                        class={
                          'block w-[250px] rounded-md border-2 px-3 py-2 text-[0.875rem] md:w-[300px] md:text-[1rem] ' +
                          (bioError.nickname || bioError.wrongInfo ? 'border-tomato' : 'border-black/10')
                        }
                      />
                    </div>
                    <p class="w-[250px] pt-1 text-[0.75rem] tracking-normal text-tomato md:w-[300px] md:text-[1rem] md:tracking-wide">
                      {bioError.nickname || bioError.wrongInfo}
                    </p>
                  </div>
                  <br />
                  <button
                    onClick$={async () => {
                      if (loadingStepTwo.value) return;
                      if (!defaultBio.userId) {
                        bioError.wrongInfo = 'Server Error! Refresh the page and try again.';
                        return;
                      }
                      loadingStepTwo.value = true;
                      bioError.nickname = '';
                      bioError.wrongInfo = '';
                      await setBio.submit({
                        nickname: defaultBio.nickname,
                        customAvatar: customAvatar.value,
                        avatar: defaultBio.avatar,
                        userId: defaultBio.userId,
                      });
                      loadingStepTwo.value = false;
                    }}
                    disabled={loadingStepTwo.value}
                    type="submit"
                    class="block w-full rounded-lg bg-primary-dark-gray  p-3 text-background-light-gray md:p-4"
                  >
                    {loadingStepTwo.value && (
                      <span>
                        <LoadingSVG />
                      </span>
                    )}
                    {!loadingStepTwo.value && <span class="text-[0.875rem] md:text-[1rem]">Sign up</span>}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
);
