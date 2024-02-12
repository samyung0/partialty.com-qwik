import { $, component$, useSignal, useStore, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

import { useUserLoader } from "~/routes/[lang.]/(wrapper)/(authRoutes)/layout";

import { useUpdateProfile } from "~/action/userAction";
import Dragndrop from "~/components/_Signup/dragndrop";
import { CLOUDINARY_MAX_IMG_SIZE, CLOUDINARY_MAX_PIXEL_COUNT } from "~/const/cloudinary";

import Lang, { displayNamesLang } from "../../../lang";

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
    theme: "light" | "dark" | undefined;
    lang: (typeof Lang)["supportedLocales"][number]["lang"] | undefined;
  }>({
    theme: undefined,
    lang: undefined,
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!localStorage) return;
    localStorageData.theme = localStorage["theme"] || "light";
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
      <div class="mt-3 w-full bg-primary-dark-gray h-[2px]"></div>
      <form
        class="flex flex-col pt-10"
        preventdefault:submit
        onSubmit$={async () => {
          isUpdating.value = true;
          await updateProfile.submit(formData);
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (localStorage) {
            localStorage["theme"] = localStorageData.theme;
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
                    "text-md w-[400px] rounded-md border-2 px-3 py-1 " +
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
                  class="text-base text-primary-dark-gray underline decoration-wavy underline-offset-4"
                  href={"/profile/resetPassword"}
                >
                  Change
                </Link>
              </div>
              <input
                class="text-md w-[400px] rounded-md border-2 px-3 py-1 disabled:bg-gray-200"
                value={"●●●●●●"}
                readOnly
                disabled
              />
            </div>
            <div class="flex flex-col gap-2">
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
            </div>
            <div class="flex flex-col gap-2">
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
                class="text-md w-[400px] rounded-md border-2 px-3 py-1"
              >
                {Object.entries(displayNamesLang).map(([lang, name]) => (
                  <option key={`language${lang}`} value={lang}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <button
              disabled={isUpdating.value}
              class="self-start rounded-xl bg-primary-dark-gray px-6 py-3 text-white shadow-xl"
              type="submit"
            >
              {isUpdating.value ? (
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
              ) : (
                "Save"
              )}
            </button>
            <p>
              Need help? Contact us at{" "}
              <a
                href={"mailto://customer@partialty.com"}
                class="text-base tracking-wide underline decoration-wavy underline-offset-4"
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
