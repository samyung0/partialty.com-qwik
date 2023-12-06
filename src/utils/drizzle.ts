import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { profiles } from "../../drizzle_turso/schema/profile";

const client = import.meta.env.DEV
  ? createClient({ url: process.env["TURSO_DEV_URL"]!, authToken: process.env["TURSO_DEV_TOKEN"]! })
  : createClient({
      url: process.env["TURSO_PROD_URL"]!,
      authToken: process.env["TURSO_PROD_TOKEN"]!,
    });

export default drizzle(client, {
  schema: { profiles },
});
