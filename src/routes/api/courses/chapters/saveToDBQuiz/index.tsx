import type { RequestHandler } from '@builder.io/qwik-city';
import { and, eq } from 'drizzle-orm';
import drizzleClient from '~/utils/drizzleClient';
import { content_user_quiz } from '../../../../../../drizzle_turso/schema/content_user_quiz';

export const onPost: RequestHandler = async (req) => {
  const { isCorrect, userId, courseId, chapterId } = (await req.parseBody()) as any;
  if (isCorrect === undefined || !userId || !courseId || !userId) throw req.json(400, 'Badly formatted request.');
  await drizzleClient(req.env, import.meta.env.VITE_USE_PROD_DB === '1').transaction(async (tx) => {
    const recordExists = await tx
      .select()
      .from(content_user_quiz)
      .where(
        and(
          eq(content_user_quiz.user_id, userId),
          eq(content_user_quiz.content_id, chapterId),
          eq(content_user_quiz.content_index_id, courseId)
        )
      );
    if (recordExists.length > 0) {
      await tx
        .update(content_user_quiz)
        .set({
          attempts: recordExists[0].attempts + 1,
          correct_attempts: recordExists[0].correct_attempts + (isCorrect ? 1 : 0),
        })
        .where(
          and(
            eq(content_user_quiz.user_id, userId),
            eq(content_user_quiz.content_id, chapterId),
            eq(content_user_quiz.content_index_id, courseId)
          )
        );
    } else {
      await tx.insert(content_user_quiz).values({
        attempts: 1,
        correct_attempts: isCorrect ? 1 : 0,
        user_id: userId,
        content_id: chapterId,
        content_index_id: courseId,
      });
    }
  });
  req.json(200, 'OK');
};
