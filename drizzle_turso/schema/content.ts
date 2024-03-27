import { InferInsertModel, InferSelectModel, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { content_index } from './content_index';

export const content = sqliteTable('content', {
  id: text('id').notNull().primaryKey(),
  index_id: text('index_id')
    .notNull()
    .references(() => content_index.id),
  slug: text('slug'),
  name: text('name').notNull(),
  link: text('link'),
  renderedHTML: text('renderedHTML'),
  content_slate: text('content_slate'), // should be of type Descendant[] (slate JS), but for flexibility its stored as string and parsed when fetched
  is_locked: integer('is_locked', { mode: 'boolean' }).notNull().default(false),
  is_premium: integer('is_premium', { mode: 'boolean' }).notNull().default(false),
  created_at: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updated_at: text('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  audio_track_playback_id: text('audio_track_playback_id'),
  audio_track_asset_id: text('audio_track_asset_id'),
  is_deleted: integer('is_deleted', { mode: 'boolean' }).notNull().default(false),
  is_checkpoint: integer('is_checkpoint', { mode: 'boolean' }).notNull().default(false),
});

export type Content = InferSelectModel<typeof content>;
export type NewContent = InferInsertModel<typeof content>;
