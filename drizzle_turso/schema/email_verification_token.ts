import { blob, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { profiles } from './profiles';

export const email_verification_token = sqliteTable('email_verification_token', {
  id: text('id').notNull().primaryKey(),
  user_id: text('user_id')
    .notNull()
    .references(() => profiles.id),
  expires: blob('expires', { mode: 'bigint' }),
});
