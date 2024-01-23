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

export const CloudinaryPublicPicSchema = z.object({
  width: z.number(),
  height: z.number(),
  bytes: z.number(),
  pixels: z.number(),
  secure_url: z.string(),
  public_id: z.string(),
  created_at: z.string(),
  uploaded_at: z.string(),
  folder: z.string(),
  asset_id: z.string(),
  aspect_ratio: z.number(),
  url: z.string(),
  etag: z.string(),
});

export type CloudinaryPublicPic = z.infer<typeof CloudinaryPublicPicSchema>;
