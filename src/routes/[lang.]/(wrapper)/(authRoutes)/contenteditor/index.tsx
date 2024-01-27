import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";

import { eq } from "drizzle-orm";
import ContentEditor from "~/components/ContentEditor";
import SideNav from "~/components/ContentEditor/SideNav";
import { CLOUDINARY_NAME } from "~/const/cloudinary";
import { useUserLoader } from "~/routes/[lang.]/(wrapper)/(authRoutes)/layout";
import type { CloudinaryPublicPic } from "~/types/Cloudinary";
import type Mux from "~/types/Mux";
import drizzleClient from "~/utils/drizzleClient";
import { mux_assets } from "../../../../../../drizzle_turso/schema/mux_assets";

export const useUserAssets = routeLoader$(async (requestEvent) => {
  const ret: {
    cloudinaryImages: CloudinaryPublicPic[];
    muxAudiosWithNames: [Mux["data"][0], string][];
  } = { cloudinaryImages: [], muxAudiosWithNames: [] };
  const user = await requestEvent.resolveValue(useUserLoader);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/resources/search`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(
        requestEvent.env.get("CLOUDINARY_API_KEY")! +
          ":" +
          requestEvent.env.get("CLOUDINARY_API_SECRET")!
      )}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      expression: `folder:public/${user.userId}/*`,
      max_results: 999999,
    }),
  })
    .then((res) => res.json())
    .catch((e) => console.error(e));
  const userMuxAssets = await drizzleClient()
    .select()
    .from(mux_assets)
    .where(eq(mux_assets.user_id, user.userId));
  const _muxAudios = await Promise.allSettled(
    userMuxAssets.map(
      (asset) =>
        fetch("https://api.mux.com/video/v1/assets/" + asset.id, {
          method: "GET",
          headers: {
            Authorization: `Basic ${btoa(
              requestEvent.env.get("MUX_PRODUCTION_ID")! +
                ":" +
                requestEvent.env.get("MUX_PRODUCTION_SECRET")!
            )}`,
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .catch((e) => console.error(e)) as Promise<{ data: Mux["data"][0] }>
    )
  );
  const muxAudios = _muxAudios.filter(
    (res) => res.status === "fulfilled" && res.value.data.resolution_tier === "audio-only"
  ) as PromiseFulfilledResult<{ data: Mux["data"][0] }>[];
  const muxAudiosWithNames = muxAudios.map((audioFile) => [
    audioFile.value.data,
    userMuxAssets.find((asset) => asset.id === audioFile.value.data.id)!.name,
  ]) as [Mux["data"][0], string][];
  ret.muxAudiosWithNames = muxAudiosWithNames;

  if (!res || !res.resources) return ret;
  ret.cloudinaryImages = res.resources;

  return ret;
});

export default component$(() => {
  const user = useUserLoader().value;
  const userAssets = useUserAssets().value;
  // const userAssets = useStore({
  //   cloudinaryImages: _userAssets.cloudinary_images
  //     ? JSON.parse(_userAssets.cloudinary_images)
  //     : [],
  // });
  return (
    <main class="relative flex h-[100vh] overflow-hidden bg-background-light-gray">
      <SideNav />
      <ContentEditor user={user} initialUserAssets={userAssets}></ContentEditor>
    </main>
  );
});
