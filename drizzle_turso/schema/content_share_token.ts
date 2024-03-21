import { blob, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { content_index } from "./content_index";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const content_share_token = sqliteTable("content_share_token", {
  id: text("id").notNull().primaryKey(),
  index_id: text("index_id")
    .notNull()
    .references(() => content_index.id),
  expires: blob("expires", { mode: "bigint" }),
});

export type ContentUserProgress = InferSelectModel<typeof content_share_token>;
export type NewContentUserProgress = InferInsertModel<typeof content_share_token>;