import { type RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = () => {
  if (!process.env["BOOT"]) throw new Error("");
};
