import { InferInsertModel, InferSelectModel, sql } from 'drizzle-orm';
import { blob, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { profiles } from './profiles';

export const user_session = sqliteTable('user_session', {
  id: text('id').notNull().primaryKey(),
  user_id: text('user_id')
    .notNull()
    .references(() => profiles.id),
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  active_expires: blob('active_expires', {
    mode: 'bigint',
  }).notNull(),
  idle_expires: blob('idle_expires', {
    mode: 'bigint',
  }).notNull(),
});

export type User_session = InferSelectModel<typeof user_session>;
export type New_user_session = InferInsertModel<typeof user_session>;
