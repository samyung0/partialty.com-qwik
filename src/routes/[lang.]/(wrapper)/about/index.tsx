import { component$ } from "@builder.io/qwik";
import { Link, type DocumentHead, type RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    maxAge: 60 * 60 * 24 * 7,
    sMaxAge: 60 * 60 * 24 * 7,
  });
};

export default component$(() => {
  return (
    <>
      <h1>About Page</h1>;<Link href="/dsadsadsadsadsa">click</Link>
    </>
  );
});

export const head: DocumentHead = {
  title: "About",
  meta: [
    {
      name: "description",
      content: "Learn all about the Code Raiders initialive",
    },
  ],
};
