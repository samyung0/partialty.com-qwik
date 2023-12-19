import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import type { RequestEventBase } from "@builder.io/qwik-city";
import { profiles } from "../../drizzle_turso/schema/profile";

export default ({ env }: RequestEventBase) => {
  // if (import.meta.env.MODE !== "production") {
  //   if (!process.env["TURSO_DEV_URL"] || !process.env["TURSO_DEV_TOKEN"])
  //     throw new Error("Missing TURSO_DEV_URL or TURSO_DEV_TOKEN");
  // } else {
  //   if (!process.env["TURSO_PROD_URL"] || !process.env["TURSO_PROD_TOKEN"])
  //     throw new Error("Missing TURSO_PROD_URL or TURSO_PROD_TOKEN");
  // }

  // const client = import.meta.env.MODE !== "production"
  //   ? createClient({ url: process.env["TURSO_DEV_URL"]!, authToken: process.env["TURSO_DEV_TOKEN"]! })
  //   : createClient({
  //       url: process.env["TURSO_PROD_URL"]!,
  //       authToken: process.env["TURSO_PROD_TOKEN"]!,
  //     });
  if (!env.get("TURSO_URL") || !env.get("TURSO_TOKEN"))
    throw new Error("Missing TURSO_URL or TURSO_TOKEN");
  const client = createClient({ url: env.get("TURSO_URL")!, authToken: env.get("TURSO_TOKEN")! });
  return drizzle(client, {
    schema: { profiles },
  });
};
