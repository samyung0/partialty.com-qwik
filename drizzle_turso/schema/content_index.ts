import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const content_index = sqliteTable("content_index", {
  id: text("id").notNull().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  chapter_order: blob("chapter_order", { mode: "json" }).$type<string[]>().notNull(),
  link: text("link"),
  is_locked: integer("is_locked", { mode: "boolean" }).notNull().default(false),
  is_premium: integer("is_premium", { mode: "boolean" }).notNull().default(false),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  is_single_page: integer("is_single_page", { mode: "boolean" }).notNull().default(false),
  authorId: text("author").notNull(), // references profile.id
  tags: blob("tags", { mode: "json" }).$type<string[]>(),
  category: text("category"),
  created_by_admin: integer("created_by_admin", { mode: "boolean" }).notNull().default(false),
  lang: blob("lang", { mode: "json" }).$type<string[]>(),
});

export type ContentIndex = InferSelectModel<typeof content_index>;
export type NewContentIndex = InferInsertModel<typeof content_index>;
