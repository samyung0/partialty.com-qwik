import { z } from "@builder.io/qwik-city";
import { CloudinaryDefaultPicSchema } from "~/types/Cloudinary";

export const updateProfile = z.object({
  nickname: z.string().trim().min(1).max(50, "Nickname is too long"),
  avatar: CloudinaryDefaultPicSchema,
  userId: z.string().min(1),
});

export const resetPasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Please enter your old password."),
    newPassword: z
      .string()
      .min(1, "Please enter your new password.")
      .min(8, "You password must have 8 characters or more.")
      .max(36, "Password is too long"),
    rePassword: z.string().min(1, "Please re-enter your new password."),
    hash: z.string().min(1),
    userId: z.string().min(1),
  })
  .refine((obj) => obj.newPassword === obj.rePassword, "The two passwords are not the same!");
