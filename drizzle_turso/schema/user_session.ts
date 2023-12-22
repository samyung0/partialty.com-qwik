import { sql } from "drizzle-orm";
import { blob, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { profiles } from "./profiles";

export const user_session = sqliteTable("user_session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => profiles.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  activeExpires: blob("active_expires", {
    mode: "bigint"
  }).notNull(),
  idleExpires: blob("idle_expires", {
    mode: "bigint"
  }).notNull(),
});
