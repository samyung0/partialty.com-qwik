import { sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { profiles } from './profiles';

export const user_key = sqliteTable('user_key', {
  id: text('id').notNull().primaryKey(),
  user_id: text('user_id')
    .notNull()
    .references(() => profiles.id),
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  hashed_password: text('hashed_password'),
});
