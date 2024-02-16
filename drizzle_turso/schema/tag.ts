import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tag = sqliteTable("tag", {
  id: text("id").notNull().primaryKey(),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
});

export type Tag = InferSelectModel<typeof tag>;
export type NewTag = InferInsertModel<typeof tag>;
