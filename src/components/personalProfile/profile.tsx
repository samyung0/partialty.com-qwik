import { $, component$, useSignal, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

import { useUserLoader } from "~/routes/[lang.]/(wrapper)/(authRoutes)/layout";

import { useUpdateProfile } from "~/action/userAction";
import Dragndrop from "~/components/_Signup/dragndrop";
import { CLOUDINARY_MAX_IMG_SIZE, CLOUDINARY_MAX_PIXEL_COUNT } from "~/const/cloudinary";
import type { CloudinaryDefaultPic } from "~/types/Cloudinary";
import type { LuciaSession } from "~/types/LuciaSession";

type FormData = {
  id: any;
  nickname: any;
  avatar: CloudinaryDefaultPic;
};

export default component$(() => {
  const user: LuciaSession["user"] = useUserLoader().value;
  // console.log(JSON.parse(user.avatar_url));

  const updateProfile = useUpdateProfile();
  const formData = useStore<FormData>({
    id: user.userId,
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

  const isUpdating = useSignal(false);

  const handleImage = $((file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (!reader.result) return;

      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        if (
          file.size > CLOUDINARY_MAX_IMG_SIZE ||
          img.width * img.height > CLOUDINARY_MAX_PIXEL_COUNT
        )
          return;

        formData.avatar.secure_url = reader.result as string;
        formData.avatar.width = img.width;
        formData.avatar.height = img.height;
        formData.avatar.pixels = img.width * img.height;
        formData.avatar.bytes = file.size;
      };
    };
  });

  useVisibleTask$(({ track }) => {
    isUpdating.value = false;
  });

  return (
    <div class="mx-auto flex w-[80%] flex-col">
      <p class="text-2xl font-bold">Profile</p>
      <div class="mt-3 w-full border-t border-black"></div>
      <form
        class="flex flex-col pt-12"
        preventdefault:submit
        onSubmit$={() => {
          isUpdating.value = true;
          updateProfile.submit(formData);
        }}
      >
        <div class="flex">
          <div class="flex flex-col gap-10">
            <div class="flex flex-col gap-2">
              <label for="nickname" class="text-md cursor-pointer font-bold">
                Nickname
              </label>
              <input
                id="nickname"
                class="text-md w-[400px] rounded-md border-2 px-3 py-1"
                value={formData.nickname}
                onInput$={(e, eventTarget) => (formData.nickname = eventTarget.value)}
              />
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex items-baseline gap-4">
                <label class="text-md  font-bold">Password</label>
                <Link
                  class="text-sm text-sea decoration-1 hover:underline"
                  href={"/profile/resetPassword"}
                >
                  Change
                </Link>
              </div>
              <input
                class="text-md w-[400px] rounded-md border-2 px-3 py-1"
                value={"●●●●●●"}
                readOnly
                onInput$={(e, eventTarget) => (formData.nickname = eventTarget.value)}
              />
            </div>
            <div class="flex flex-col gap-2">
              <label for="theme" class="text-md cursor-pointer font-bold">
                Theme
              </label>
              <select id="theme" class="text-md w-[400px] rounded-md border-2 px-3 py-1">
                <option>Light</option>
                <option>Dark</option>
              </select>
            </div>
            <div class="flex flex-col gap-2">
              <label for="lang" class="text-md cursor-pointer font-bold">
                Preferred Language
              </label>
              <select id="lang" class="text-md w-[400px] rounded-md border-2 px-3 py-1">
                <option>No preference</option>
                <option>Chinese</option>
                <option>English</option>
                <option>Japanese</option>
              </select>
            </div>
          </div>
          <div class="flex flex-col space-y-2">
            <label class="text-md pl-[88px] font-bold">Avatar</label>
            <Dragndrop
              width={formData.avatar.width}
              height={formData.avatar.height}
              secure_url={formData.avatar.secure_url}
              handleImage={handleImage}
              bioErrorMsg=""
            />
          </div>
        </div>
        <div class="mt-8 w-full border-t border-black"></div>
        <button
          disabled={isUpdating.value}
          class="mt-4 w-[100px] self-end rounded-2xl bg-black py-2 text-white"
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
            "submit"
          )}
        </button>
      </form>
    </div>
  );
});
