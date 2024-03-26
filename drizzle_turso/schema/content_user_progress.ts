import { InferInsertModel, InferSelectModel, sql } from 'drizzle-orm';
import { blob, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { content_index } from './content_index';
import { profiles } from './profiles';

export const content_user_progress = sqliteTable('content_user_progress', {
  id: text('id').notNull().primaryKey(),
  index_id: text('index_id')
    .notNull()
    .references(() => content_index.id),
  started_date: text('started_date')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  finished_date: text('finished_date'),
  user_id: text('user_id')
    .notNull()
    .references(() => profiles.id),
  progress: blob('progress', { mode: 'json' }).$type<string[]>().notNull(),
});

export type ContentUserProgress = InferSelectModel<typeof content_user_progress>;
export type NewContentUserProgress = InferInsertModel<typeof content_user_progress>;
