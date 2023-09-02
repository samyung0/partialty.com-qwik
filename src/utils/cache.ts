import { server$ } from "@builder.io/qwik-city";
import { redis } from "~/utils/redis";

export const setCacheJson = server$((key: string, value: string) =>
  redis.json.set(key, "$", value)
);
export const updateCacheJson = server$((key: string, subKey: string, value: string) =>
  redis.json.set(key, `$.${subKey}`, value)
);
export const getCacheJson = server$((key: string) => redis.json.get(key));
