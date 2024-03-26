import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { content } from './content';
import { content_index } from './content_index';
import { profiles } from './profiles';

export const content_user_quiz = sqliteTable(
  'content_user_quiz',
  {
    user_id: text('user_id')
      .notNull()
      .references(() => profiles.id),
    content_index_id: text('content_index_id')
      .notNull()
      .references(() => content_index.id),
    content_id: text('content_id')
      .notNull()
      .references(() => content.id),
    attempts: integer('attempts').notNull().default(0),
    correct_attempts: integer('correct_attempts').notNull().default(0),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.user_id, table.content_index_id, table.content_id] }),
    };
  }
);

export type ContentUserQuizIndex = InferSelectModel<typeof content_user_quiz>;
export type NewContentUserQuiz = InferInsertModel<typeof content_user_quiz>;
