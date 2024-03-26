import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { profiles } from './profiles';

export const mux_assets = sqliteTable('mux_assets', {
  id: text('id').notNull().primaryKey(),
  user_id: text('user_id')
    .notNull()
    .references(() => profiles.id),
  name: text('name').notNull(),
});
