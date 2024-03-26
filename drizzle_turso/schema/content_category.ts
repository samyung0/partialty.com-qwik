import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { blob, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const content_category = sqliteTable('content_category', {
  id: text('id').notNull().primaryKey(),
  slug: text('slug').notNull(),
  name: text('name').notNull(),
  link: text('link').notNull(),
  content_index_id: blob('content_index_id', { mode: 'json' }).$type<string[]>().notNull(), // CONTAIN DELETED COURSE
  approved: integer('approved', { mode: 'boolean' }).notNull().default(true),
});

export type ContentCategory = InferSelectModel<typeof content_category>;
export type NewContentCategory = InferInsertModel<typeof content_category>;
