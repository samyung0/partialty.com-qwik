import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";

import ContentEditor from "~/components/ContentEditor";
import { CLOUDINARY_NAME } from "~/const/cloudinary";
import { useUserLoader } from "~/routes/[lang.]/(wrapper)/(authRoutes)/layout";
import type { CloudinaryPublicPic } from "~/types/Cloudinary";

export const useUserAssets = routeLoader$(async (requestEvent) => {
  const ret: { cloudinaryImages: CloudinaryPublicPic[] } = { cloudinaryImages: [] };
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
    <main class="relative h-[100vh]">
      <ContentEditor user={user} initialUserAssets={userAssets}></ContentEditor>;
    </main>
  );
});
