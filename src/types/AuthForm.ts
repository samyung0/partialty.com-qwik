import { z } from "zod";

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

export type EmailLoginForm = z.infer<typeof emailLoginSchema>;

export const initialFormValue: EmailLoginForm = {
  email: "",
  password: "",
};
