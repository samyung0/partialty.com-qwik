import type { RequestEventBase } from "@builder.io/qwik-city";
import { Cloudinary } from "@cloudinary/url-gen";

let client: Cloudinary | null = null;

export const initCloudinaryIfNeeded = async (env: RequestEventBase["env"]) => {
  if (!client) {
    if (!env.get("CLOUDINARY_NAME")) {
      console.error("CLOUDINARY_NAME VARIABLE ERROR SERVER");
      return null;
    }
    client = new Cloudinary({ cloud: { cloudName: env.get("CLOUDINARY_NAME")! } });
  }
};

export default () => {
  if (!client) throw new Error("Cloudinary not initialized");
  return client;
};
