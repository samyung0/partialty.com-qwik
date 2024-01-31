import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const content_group = sqliteTable("content_group", {
  id: text("id").notNull().primaryKey(),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  chapter_index: blob("chapter_index", { mode: "json" }).$type<string[]>().notNull(),
  link: text("link"),
  is_locked: integer("is_locked", { mode: "boolean" }).notNull().default(false),
  is_premium: integer("is_premium", { mode: "boolean" }).notNull().default(false),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export type ContentGroup = InferSelectModel<typeof content_group>;
export type NewContentGroup = InferInsertModel<typeof content_group>;
