import { globalAction$, zod$ } from "@builder.io/qwik-city";
import { eq } from "drizzle-orm";
import type { CloudinaryDefaultPic } from "~/types/Cloudinary";
import { resetPasswordSchema } from "~/types/zodSchema";
import { cloudinaryUpload } from "~/utils/cloudinary";
import drizzleClient from "~/utils/drizzleClient";
import { profiles } from "../../drizzle_turso/schema/profiles";

export const useUpdateProfile = globalAction$(async (data, requestEvent) => {
  const { id, nickname, avatar } = data;
  const { secure_url } = avatar as CloudinaryDefaultPic;

  try {
    const newAvatarUrl = await cloudinaryUpload(secure_url, requestEvent);
    console.log(newAvatarUrl);

    const drizzle = drizzleClient();
    await drizzle
      .update(profiles)
      .set({ nickname: nickname as string, avatar_url: newAvatarUrl.secure_url })
      .where(eq(profiles.id, id as string));
  } catch (e) {
    throw new Error();
  }
});

export const useResetPassword = globalAction$(async (data, requestEvent) => {
  // const { id, newPassword } = data;
}, zod$(resetPasswordSchema));
