import { z } from "@builder.io/qwik-city";
import { CloudinaryDefaultPicSchema } from "~/types/Cloudinary";

export const emailLoginSchema = z.object({
  email: z
    .string()
    .min(1, "Please enter your email.")
    .max(256, "Email is too long")
    .email("The email address is badly formatted."),
  password: z
    .string()
    .min(1, "Please enter your password.")
    .min(8, "You password must have 8 characters or more.")
    .max(36, "Password is too long"),
});

export const emailSignupSchema = z
  .object({
    email: z
      .string()
      .min(1, "Please enter your email.")
      .max(256, "Email is too long")
      .email("The email address is badly formatted."),
    password: z
      .string()
      .min(1, "Please enter your password.")
      .min(8, "You password must have 8 characters or more.")
      .max(36, "Password is too long"),
    rePassword: z.string().min(1, "Please re-enter your password."),
    avatar_cloudinary_id: z.string(),
    nickname: z.string().min(1).max(50, "Nickname is too long"),
  })
  .refine((obj) => obj.rePassword === obj.password, "The two passwords are not the same!");

export const setBioSchema = z.object({
  avatar: CloudinaryDefaultPicSchema,
  nickname: z.string().min(1).max(50, "Nickname is too long"),
  customAvatar: z.boolean(),
});

export type EmailLoginForm = z.infer<typeof emailLoginSchema>;
export type SetBioForm = z.infer<typeof setBioSchema>;
export type EmailSignupForm = z.infer<typeof emailSignupSchema>;
