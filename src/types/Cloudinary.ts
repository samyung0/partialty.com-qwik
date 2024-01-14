import { z } from "@builder.io/qwik-city";

export const CloudinaryDefaultPicSchema = z.object({
  width: z.number(),
  height: z.number(),
  bytes: z.number(),
  pixels: z.number(),
  secure_url: z.string(),
  public_id: z.string(),
});

export type CloudinaryDefaultPic = z.infer<typeof CloudinaryDefaultPicSchema>;
