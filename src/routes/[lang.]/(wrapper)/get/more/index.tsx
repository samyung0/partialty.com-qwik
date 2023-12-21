import { type RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = (request) => {
  request.json(200, { data: "another random string" });
};
