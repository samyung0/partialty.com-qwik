import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { blob, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const tag = sqliteTable('tag', {
  id: text('id').notNull().primaryKey(),
  slug: text('slug').notNull(),
  name: text('name').notNull(),
  link: text('link').notNull(),
  content_index_id: blob('content_index_id', { mode: 'json' }).$type<string[]>().notNull(), // CONTAIN DELETED COURSE
  approved: integer('approved', { mode: 'boolean' }).notNull().default(true),
});

export type Tag = InferSelectModel<typeof tag>;
export type NewTag = InferInsertModel<typeof tag>;
