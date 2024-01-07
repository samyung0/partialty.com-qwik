// import type { RequestEventBase } from "@builder.io/qwik-city";
// import { Redis } from "@upstash/redis";

// // const REDIS_TOKEN = process.env["REDIS_TOKEN"],
// //   REDIS_URL = process.env["REDIS_URL"];

// // if (!REDIS_TOKEN || !REDIS_URL) console.error("ENV VARIABLE ERROR REDIS");

// export const redis = ({ env }: RequestEventBase) => {
//   if (!env.get("REDIS_TOKEN") || !env.get("REDIS_URL"))
//     throw new Error("Missing REDIS_TOKEN or REDIS_URL");
//   return new Redis({
//     url: env.get("REDIS_URL")!,
//     token: env.get("REDIS_TOKEN")!,
//   });
// };
