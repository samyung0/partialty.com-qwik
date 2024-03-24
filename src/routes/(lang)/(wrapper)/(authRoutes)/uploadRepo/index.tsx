import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link, z } from "@builder.io/qwik-city";
import { useUserLoader } from "~/routes/(lang)/(wrapper)/(authRoutes)/layout";
import getToken from "~/utils/github/getToken";
import { test, uploadRepoToCloudflare } from "~/utils/uploadGithubFetchCloudflareClient";

export { getToken };

export default component$(() => {
  const user = useUserLoader().value;
  const message = useSignal("");
  const imgRef = useSignal<any>();

  useVisibleTask$(() => {
    // console.log(context);
    // downloadGithubFetchCloudflareClient("samyung0", "Template_react_1").then (x => {
    //   console.log(x);
    // })
    // downloadGithubFetchCloudflareClient("samyung0", "Template_react_1").then((data) => {
    //   console.log(data);
    //   if (!data[0]) return;
    //   const t = data[1].success.filter((x) => x.path === "public/logo512.png")[0];
    //   if (!t.isBinary) return;
    //   // const arr = new Uint8Array(t.data);
    //   const blob = new Blob([t.data]);
    //   const urlCreator = window.URL || window.webkitURL;
    //   const imageUrl = urlCreator.createObjectURL(blob);
    //   const image = document.createElement("img");
    //   console.log(imageUrl);
    //   image.src = imageUrl;
    //   imgRef.value!.append(image);
    // });
  });

  const submitHandler = $(async (_: any, currentTarget: HTMLFormElement) => {
    const schema = z.object({
      owner: z.string().max(255).min(1),
      repo: z.string().max(255).min(1),
      branch: z.string().max(255).min(1),
    });
    type SchemaType = z.infer<typeof schema>;
    const form = Object.fromEntries(new FormData(currentTarget).entries()) as SchemaType;
    const parse = schema.safeParse(form);

    if (!parse.success) {
      message.value = parse.error.issues[0].message;
      return;
    }
    const token = await getToken(user.userId);

    if (!token) return (message.value = "Error!");

    uploadRepoToCloudflare(parse.data.owner, parse.data.repo, parse.data.branch, token).then(
      (res) => {
        if (res[0]) message.value = res[1];
        else message.value = "Error! " + res[1];
      }
    );
  });

  useVisibleTask$(async () => {
    const token = await getToken(user.userId);
    console.log(token);
    if (!token) return;
    test(token);
  });

  return (
    <div ref={imgRef}>
      <Link href={"/uploadRepo/github/"}>Click</Link>
      <form
        class="flex flex-col items-start gap-4 p-10"
        preventdefault:submit
        onSubmit$={submitHandler}
      >
        <label>
          <span>Owner: </span>
          <input
            class="border-b-2 border-gray-500 outline-none"
            name="owner"
            type="text"
            placeholder="Enter owner"
          />
        </label>
        <label>
          <span>Repo name: </span>
          <input
            class="border-b-2 border-gray-500 outline-none"
            name="repo"
            type="text"
            placeholder="Enter repo name"
          />
        </label>
        <label>
          <span>Branch: </span>
          <input
            class="border-b-2 border-gray-500 outline-none"
            name="branch"
            value="main"
            type="text"
            placeholder="Enter branch"
          />
        </label>
        <button
          class="cursor-pointer rounded-sm border-2 border-black px-4 py-2 capitalize"
          type="submit"
        >
          Upload Repo
        </button>
      </form>
      <div class="whitespace-pre-wrap p-10 pt-0">{message.value}</div>
    </div>
  );
});
