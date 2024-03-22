import { routeLoader$, server$, type RequestHandler } from "@builder.io/qwik-city";
import type { Session } from "lucia";
import { auth, initLuciaIfNeeded } from "~/auth/lucia";
import { CLOUDINARY_NAME } from "~/const/cloudinary";
import type { CloudinaryDefaultPic } from "~/types/Cloudinary";
import { initCloudinaryIfNeeded } from "~/utils/cloudinary";
import { initDrizzleIfNeeded } from "~/utils/drizzleClient";
import { checkProtectedPath } from "~/utils/redirect";
import { initTursoIfNeeded } from "~/utils/tursoClient";

export const useUserLoader = routeLoader$(async (event) => {
  const authRequest = auth(event.env, import.meta.env.VITE_USE_PROD_DB === "1").handleRequest(
    event
  );

  let session: Session | null = null;
  try {
    session = await authRequest.validate();
  } catch (e) {
    /* empty */
  }

  const [shouldRedirect, redirectTo] = checkProtectedPath(
    event.url.pathname,
    session ? session.user.role : ""
  );

  if (shouldRedirect) {
    throw event.redirect(302, redirectTo);
  }

  return session;
});

export const onRequest: RequestHandler = ({ env }) => {
  initTursoIfNeeded(env, import.meta.env.VITE_USE_PROD_DB === "1");
  initDrizzleIfNeeded(env, import.meta.env.VITE_USE_PROD_DB === "1");
  initLuciaIfNeeded(env, import.meta.env.VITE_USE_PROD_DB === "1");
  initCloudinaryIfNeeded();
};

export const getCloudinaryDefaultPic = server$(async function (): Promise<
  CloudinaryDefaultPic[] | null
> {
  if (!this.env.get("CLOUDINARY_API_KEY") || !this.env.get("CLOUDINARY_API_SECRET")) {
    console.error("CLOUDINARY ENV ERROR SERVER!");
    return null;
  }

  const defaultProfilePics = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/resources/search`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(
          this.env.get("CLOUDINARY_API_KEY")! + ":" + this.env.get("CLOUDINARY_API_SECRET")!
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
    return null;
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
});
