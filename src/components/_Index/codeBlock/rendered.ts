import type $rendered from "~/components/_Index/codeBlock/$rendered";
export default import.meta.compileTime("./$rendered.ts") as Awaited<
  ReturnType<typeof $rendered>
>["data"];
