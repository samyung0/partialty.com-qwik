import { component$, Slot } from "@builder.io/qwik";
import { RequestHandler } from "@builder.io/qwik-city";
import { useSpeak } from "qwik-speak";

export const onGet: RequestHandler = (request) => {
  request.status(403);
};

export default component$(() => {
  useSpeak({ assets: ["pageUnauth"] });

  return <Slot />;
});
