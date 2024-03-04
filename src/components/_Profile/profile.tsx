import { $, component$, useSignal, useStore, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

import { useUserLoader } from "~/routes/[lang.]/(wrapper)/(authRoutes)/layout";

import { useUpdateProfile } from "~/action/userAction";
import Dragndrop from "~/components/_Signup/dragndrop";
import { CLOUDINARY_MAX_IMG_SIZE, CLOUDINARY_MAX_PIXEL_COUNT } from "~/const/cloudinary";

import LoadingSVG from "~/components/LoadingSVG";
import type Lang from "../../../lang";

export default component$(() => {
  const user = useUserLoader().value;

  const updateProfile = useUpdateProfile();
  const formData = useStore({
    userId: user.userId,
    nickname: user.nickname,
    avatar: {
      width: 0,
      height: 0,
      bytes: 0,
      pixels: 0,
      secure_url: user.avatar_url as string,
      public_id: "",
    },
  });

  const localStorageData = useStore<{
    lang: (typeof Lang)["supportedLocales"][number]["lang"] | undefined;
  }>({
    lang: undefined,
  });

  useVisibleTask$(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!localStorage) return;
    localStorageData.lang = localStorage["lang"] || "en-US";
  });

  const isUpdating = useSignal(false);
  const bioError = useStore({
    avatar: "",
    nickname: "",
    wrongInfo: "",
  });

  const handleImage = $((file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (!reader.result) {
        bioError.avatar = "Cannot load image!";
        return;
      }

      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        if (
          file.size > CLOUDINARY_MAX_IMG_SIZE ||
          img.width * img.height > CLOUDINARY_MAX_PIXEL_COUNT
        ) {
          bioError.avatar = "The picture is too large!";
          return;
        }

        formData.avatar.secure_url = reader.result as string;
        formData.avatar.width = img.width;
        formData.avatar.height = img.height;
        formData.avatar.pixels = img.width * img.height;
        formData.avatar.bytes = file.size;
      };
    };
  });

  useTask$(({ track }) => {
    track(updateProfile);
    if (updateProfile.status === 400) {
      bioError.nickname = updateProfile.value?.fieldErrors?.nickname?.join("\n") ?? "";
    }
    if (updateProfile.status === 500) {
      bioError.wrongInfo = updateProfile.value?.message || "";
    }
    if (updateProfile.status === 200) {
      bioError.avatar = "";
      bioError.nickname = "";
      bioError.wrongInfo = "";
    }
  });

  return (
    <div class="mx-auto flex w-[80%] flex-col">
      <h1 class="font-mosk text-3xl font-bold tracking-wide">Profile</h1>
      <div class="mt-3 h-[2px] w-full bg-primary-dark-gray dark:bg-background-light-gray"></div>
      <form
        class="flex flex-col pt-10"
        preventdefault:submit
        onSubmit$={async () => {
          isUpdating.value = true;
          await updateProfile.submit(formData);
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (localStorage) {
            localStorage["lang"] = localStorageData.lang;
          }
          isUpdating.value = false;
        }}
      >
        <div class="flex text-lg tracking-wide">
          <div class="flex flex-col gap-10">
            <div class="flex flex-col gap-2">
              <label for="nickname" class="text-md cursor-pointer font-bold">
                Nickname
              </label>
              <div>
                <input
                  id="nickname"
                  name="nickname"
                  class={
                    "text-md w-[400px] rounded-md border-2 px-3 py-1 dark:border-primary-dark-gray dark:bg-highlight-dark dark:disabled:border-black/20" +
                    (bioError.nickname || bioError.wrongInfo ? "border-tomato" : "border-black/10")
                  }
                  value={formData.nickname}
                  onInput$={(e, eventTarget) => (formData.nickname = eventTarget.value)}
                />
                <p class="pt-1 text-sm tracking-wide text-tomato">
                  {bioError.nickname || bioError.wrongInfo}
                </p>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-4">
                <label class="text-md  font-bold">Password</label>
                <Link
                  class="text-base underline decoration-wavy underline-offset-4 "
                  href={"/profile/resetPassword"}
                >
                  Change
                </Link>
              </div>
              <input
                class="text-md w-[400px] rounded-md border-2 px-3 py-1 disabled:bg-gray-200 dark:border-primary-dark-gray dark:bg-highlight-dark dark:disabled:border-black/20 dark:disabled:bg-black/20"
                value={"●●●●●●"}
                readOnly
                disabled
              />
            </div>
            {/* <div class="flex flex-col gap-2">
              <label for="theme" class="text-md cursor-pointer font-bold">
                Theme
              </label>
              <select
                value={localStorageData.theme}
                onChange$={(e) =>
                  (localStorageData.theme = (e.target as HTMLSelectElement).value as
                    | "light"
                    | "dark")
                }
                id="theme"
                class="text-md w-[400px] rounded-md border-2 px-3 py-1"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div> */}
            {/* <div class="flex flex-col gap-2">
              <label for="lang" class="text-md cursor-pointer font-bold">
                Preferred Language
              </label>
              <select
                value={localStorageData.lang}
                onChange$={(e) =>
                  (localStorageData.lang = (e.target as HTMLSelectElement)
                    .value as keyof typeof displayNamesLang)
                }
                id="lang"
                class="text-md w-[400px] rounded-md border-2 px-3 py-1 dark:border-primary-dark-gray dark:bg-highlight-dark dark:disabled:border-black/20"
              >
                {Object.entries(displayNamesLang).map(([lang, name]) => (
                  <option key={`language${lang}`} value={lang}>
                    {name}
                  </option>
                ))}
              </select>
            </div> */}
            <button
              disabled={isUpdating.value}
              class="self-start rounded-xl bg-primary-dark-gray px-6 py-3 text-white shadow-xl dark:bg-highlight-dark"
              type="submit"
            >
              {isUpdating.value ? (
                <span>
                  <LoadingSVG />
                </span>
              ) : (
                "Save"
              )}
            </button>
            <p>
              Need help? Contact us at{" "}
              <a
                href={"mailto://customer@partialty.com"}
                class="tracking-wide underline decoration-wavy underline-offset-[6px]"
              >
                customer@partialty.com
              </a>
            </p>
          </div>
          <div class="ml-10 flex w-[300px] flex-col items-center gap-2">
            <label class="font-mosk text-xl font-bold">Customize Avatar</label>
            <Dragndrop
              width={formData.avatar.width}
              height={formData.avatar.height}
              secure_url={formData.avatar.secure_url}
              handleImage={handleImage}
              bioErrorMsg={bioError.avatar}
            />
          </div>
        </div>
      </form>
    </div>
  );
});
