import { z } from "@builder.io/qwik-city";

export const resetPasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(1, "Please enter your password.")
      .min(8, "You password must have 8 characters or more.")
      .max(36, "Password is too long"),
    newPassword: z
      .string()
      .min(1, "Please enter your password.")
      .min(8, "You password must have 8 characters or more.")
      .max(36, "Password is too long"),
    newPasswordAgain: z
      .string()
      .min(1, "Please enter your password.")
      .min(8, "You password must have 8 characters or more.")
      .max(36, "Password is too long"),
  })
  .refine((obj) => obj.newPassword === obj.newPasswordAgain, "The two passwords are not the same!");
