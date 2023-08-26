import {
  component$,
  Slot,
  useContext,
  useContextProvider,
  useTask$,
} from "@builder.io/qwik";
import { type RequestHandler } from "@builder.io/qwik-city";
import { globalContext } from "~/root";
import { useRedirectLoader } from "~/routes/plugin@Redirect";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    maxAge: 5,
  });
};

export default component$(() => {
  const context = useContext(globalContext);
  const { session, url } = useRedirectLoader().value;

  useTask$(() => {
    context.session = session;
    context.req.url = url;
    if (session) context.isLoggedIn = true;
  });

  return <Slot />;
});
