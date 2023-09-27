import { $, component$, useSignal } from "@builder.io/qwik";
import { z } from "@builder.io/qwik-city";
import { uploadRepoToCloudflare } from "~/utils/uploadGithubFetchCloudflareClient";

export default component$(() => {
  const message = useSignal("");

  const submitHandler = $((_: any, currentTarget: HTMLFormElement): any => {
    const schema = z.object({
      owner: z.string().max(255).nonempty(),
      repo: z.string().max(255).nonempty(),
      branch: z.string().max(255).nonempty(),
    });
    type SchemaType = z.infer<typeof schema>;
    const form = Object.fromEntries(new FormData(currentTarget).entries()) as SchemaType;
    const parse = schema.safeParse(form);

    if (!parse.success) {
      message.value = parse.error.issues[0].message;
      return;
    }

    uploadRepoToCloudflare(parse.data.owner, parse.data.repo, parse.data.branch).then((res) => {
      if (res[0]) message.value = res[1];
      else message.value = "Error! " + res[1];
    });
  });

  return (
    <div>
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
      <br />
      <div class="whitespace-pre-wrap pb-16">{message.value}</div>
    </div>
  );
});
