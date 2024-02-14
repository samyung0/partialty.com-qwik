import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { content_index } from "./content_index";

export const content = sqliteTable("content", {
  id: text("id").notNull().primaryKey(),
  index_id: text("index_id")
    .notNull()
    .references(() => content_index.id),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  chapter_order: blob("chapter_order", { mode: "json" }).$type<string[]>().notNull(), // unused, default []
  link: text("link"),
  renderedHTML: text("renderedHTML"),
  content_slate: text("content_slate"), // should be of type Descendant[] (slate JS), but for flexibility its stored as string and parsed when fetched
  is_locked: integer("is_locked", { mode: "boolean" }).notNull().default(false),
  is_premium: integer("is_premium", { mode: "boolean" }).notNull().default(false),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  audio_track_playback_id: text("audio_track_playback_id"),
  audio_track_asset_id: text("audio_track_asset_id"),
  tags: blob("tags", { mode: "json" }).$type<string[]>(),
  category: text("category"),
  created_by_admin: integer("is_locked", { mode: "boolean" }).notNull().default(false),
});

export type Content = InferSelectModel<typeof content>;
export type NewContent = InferInsertModel<typeof content>;
