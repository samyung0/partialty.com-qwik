import * as dotenv from "dotenv";
import type { Config } from "drizzle-kit";
dotenv.config({ path: ".env.local" });

if (!process.env.TURSO_URL) throw new Error("Cannot retrieve database url! Check env variables!");
if (!process.env.TURSO_TOKEN)
  throw new Error("Cannot retrieve database token! Check env variables!");

export default {
  schema: "./drizzle_turso/schema/*",
  out: "./drizzle_turso/drizzle",
  driver: "turso",
  dbCredentials: {
    // url: "file:./drizzle_turso/local.db"
    url: process.env.TURSO_URL,
    authToken: process.env.TURSO_TOKEN,
  },
} satisfies Config;
