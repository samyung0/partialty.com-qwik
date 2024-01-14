import { routeLoader$, type RequestHandler } from "@builder.io/qwik-city";
import { initLuciaIfNeeded } from "~/auth/lucia";
import type { CloudinaryDefaultPic } from "~/types/Cloudinary";
import { initCloudinaryIfNeeded } from "~/utils/cloudinary";
import { initDrizzleIfNeeded } from "~/utils/drizzleClient";
import { initTursoIfNeeded } from "~/utils/tursoClient";

export const onRequest: RequestHandler = async ({ env, url }) => {
  await initTursoIfNeeded(env);
  await Promise.all([
    initDrizzleIfNeeded(),
    initLuciaIfNeeded(env, url.origin),
    initCloudinaryIfNeeded(env),
  ]);
};

export const useCloudinaryDefaultPic = routeLoader$<CloudinaryDefaultPic[]>(
  async ({ env, redirect }) => {
    try {
      if (
        !env.get("CLOUDINARY_API_KEY") ||
        !env.get("CLOUDINARY_API_SECRET") ||
        !env.get("CLOUDINARY_NAME")
      ) {
        console.error("CLOUDINARY ENV ERROR SERVER!");
        throw Error();
      }

      const defaultProfilePics = await fetch(
        `https://api.cloudinary.com/v1_1/${env.get("CLOUDINARY_NAME")!}/resources/search`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${btoa(
              env.get("CLOUDINARY_API_KEY")! + ":" + env.get("CLOUDINARY_API_SECRET")!
            )}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            expression: "folder:defaultProfilePic/*",
            max_results: 10,
          }),
        }
      )
        .then((res) => res.json())
        .catch((e) => console.error(e));

      if (!defaultProfilePics.resources) {
        console.error("Cannot retrieve pictures from cloudinary!");
        throw Error();
      }

      return defaultProfilePics.resources.map(
        (resource: any) =>
          ({
            width: resource.width,
            height: resource.height,
            bytes: resource.bytes,
            pixels: resource.pixels,
            secure_url: resource.secure_url,
            public_id: resource.public_id,
          }) as CloudinaryDefaultPic
      );
    } catch (e) {
      throw redirect(304, "/?errMessage=" + (e as any).toString());
    }
  }
);
