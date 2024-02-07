import type { RequestHandler } from "@builder.io/qwik-city";

export const onRequest: RequestHandler = (request) => {
  if (import.meta.env.MODE !== "production" && import.meta.env.VITE_USE_PROD_DB !== "1")
    throw new Error("You must enable the use of prod DB first! Set VITE_USE_PROD_DB to 1.");
};
