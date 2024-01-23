import { server$ } from "@builder.io/qwik-city";
import { CLOUDINARY_NAME } from "~/const/cloudinary";

export default server$(async function (data: string, userId: string) {
  if (!this.env.get("CLOUDINARY_PRESET_ALL")) {
    throw new Error("Server Error! Please try again later.");
  }
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/upload`;
  const fd = new FormData();
  fd.append("upload_preset", this.env.get("CLOUDINARY_PRESET_ALL")!);
  fd.append("file", data);
  fd.append("folder", "public/" + userId);

  const res = await fetch(url, {
    method: "POST",
    body: fd,
  })
    .then((res) => res.json())
    .catch((e) => {
      throw Error(e);
    });
  return await res;
});
