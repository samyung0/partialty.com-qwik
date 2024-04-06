import { InferInsertModel, InferSelectModel, relations, sql } from 'drizzle-orm';
import { blob, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import difficulty from '~/const/difficulty';
import { profiles } from './profiles';

export const content_index = sqliteTable('content_index', {
  id: text('id').notNull().primaryKey(),
  slug: text('slug').notNull(),
  name: text('name').notNull(),
  chapter_order: blob('chapter_order', { mode: 'json' }).$type<string[]>().notNull(),
  link: text('link'),
  is_locked: integer('is_locked', { mode: 'boolean' }).notNull().default(false),
  is_premium: integer('is_premium', { mode: 'boolean' }).notNull().default(false),
  is_private: integer('is_private', { mode: 'boolean' }).notNull().default(false),
  created_at: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updated_at: text('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  is_single_page: integer('is_single_page', { mode: 'boolean' }).notNull().default(false),
  author: text('author').notNull(), // references profile.id
  tags: blob('tags', { mode: 'json' }).$type<string[]>(),
  category: text('category'),
  created_by_admin: integer('created_by_admin', { mode: 'boolean' }).notNull().default(false),
  lang: text('lang').notNull(),
  supported_lang: blob('supported_lang', { mode: 'json' }).$type<string[]>().notNull(),
  description: text('description').notNull().default(''),
  short_description: text('short_description').notNull().default(''),
  is_deleted: integer('is_deleted', { mode: 'boolean' }).notNull().default(false),
  difficulty: text('difficulty', { enum: difficulty }).notNull().default('easy'),
  is_guide: integer('is_guide', { mode: 'boolean' }).notNull().default(false),
  use_plate: integer('use_plate', { mode: 'boolean' }),
});

export const contentIndexRelations = relations(content_index, ({ one }) => ({
  author: one(profiles, {
    fields: [content_index.author],
    references: [profiles.id],
  }),
}));

export type ContentIndex = InferSelectModel<typeof content_index>;
export type NewContentIndex = InferInsertModel<typeof content_index>;
