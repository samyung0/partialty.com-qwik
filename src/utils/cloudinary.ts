import { Cloudinary } from "@cloudinary/url-gen";
import { CLOUDINARY_NAME } from "~/const/cloudinary";

let client: Cloudinary | null = null;

export const initCloudinaryIfNeeded = async () => {
  if (!client) {
    client = new Cloudinary({ cloud: { cloudName: CLOUDINARY_NAME } });
  }
};

export default () => {
  if (!client) throw new Error("Cloudinary not initialized");
  return client;
};
