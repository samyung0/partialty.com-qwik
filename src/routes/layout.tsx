import { component$, Slot } from "@builder.io/qwik";

// export const onGet: RequestHandler = async ({ cacheControl }) => {
//   // https://qwik.builder.io/docs/caching/
//   cacheControl({
//     staleWhileRevalidate: 60 * 60 * 24 * 7,
//     maxAge: 5,
//   });
// };

export default component$(() => {
  return <Slot />;
});
