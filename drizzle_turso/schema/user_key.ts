import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { profiles } from "./profiles";

export const user_key = sqliteTable("user_key", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => profiles.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  hashedPassword: text("hashed_password"),
});
