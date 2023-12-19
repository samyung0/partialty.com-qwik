import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { profiles } from "../../drizzle_turso/schema/profile";

if (import.meta.env.DEV) {
  if (!process.env["TURSO_DEV_URL"] || !process.env["TURSO_DEV_TOKEN"])
    throw new Error("Missing TURSO_DEV_URL or TURSO_DEV_TOKEN");
} else {
  if (!process.env["TURSO_PROD_URL"] || !process.env["TURSO_PROD_TOKEN"])
    throw new Error("Missing TURSO_PROD_URL or TURSO_PROD_TOKEN");
}

const client = import.meta.env.DEV
  ? createClient({ url: process.env["TURSO_DEV_URL"]!, authToken: process.env["TURSO_DEV_TOKEN"]! })
  : createClient({
      url: process.env["TURSO_PROD_URL"]!,
      authToken: process.env["TURSO_PROD_TOKEN"]!,
    });

export default drizzle(client, {
  schema: { profiles },
});
