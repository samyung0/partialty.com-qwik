import { Redis } from "@upstash/redis";

const REDIS_TOKEN = process.env["REDIS_TOKEN"],
  REDIS_URL = process.env["REDIS_URL"];

if (!REDIS_TOKEN || !REDIS_URL) console.error("ENV VARIABLE ERROR REDIS");

export const redis = new Redis({
  url: REDIS_URL!,
  token: REDIS_TOKEN!,
});
