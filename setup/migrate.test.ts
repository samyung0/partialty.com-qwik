import { migrate } from "drizzle-orm/libsql/migrator";
import path from "node:path";
import { drizzleClient } from "./drizzle";

await migrate(drizzleClient, {
  migrationsFolder: path.resolve(import.meta.dir, "../drizzle_turso/drizzle_prod"),
});
console.log("Successfully migrated test db.");
