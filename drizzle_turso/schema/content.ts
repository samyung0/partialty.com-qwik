import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { Descendant } from "slate";

export const content = sqliteTable("content", {
  id: text("id").notNull().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  is_index: integer("is_index", { mode: "boolean" }).notNull().default(false),
  chapter_order: blob("chapter_order", { mode: "json" }).$type<string[]>().notNull(),
  link: text("link"),
  renderedHTML: text("renderedHTML"),
  content_slate: blob("content_slate", { mode: "json" }).$type<Descendant[]>(),
  is_locked: integer("is_locked", { mode: "boolean" }).notNull().default(false),
  is_premium: integer("is_premium", { mode: "boolean" }).notNull().default(false),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export type Content = InferSelectModel<typeof content>;
export type NewContent = InferInsertModel<typeof content>;
