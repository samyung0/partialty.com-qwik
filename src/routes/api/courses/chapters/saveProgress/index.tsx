import type { RequestHandler } from '@builder.io/qwik-city';
import { and, eq } from 'drizzle-orm';
import drizzleClient from '~/utils/drizzleClient';
import getSQLTimeStamp from '~/utils/getSQLTimeStamp';
import { content_user_progress } from '../../../../../../drizzle_turso/schema/content_user_progress';

export const onPost: RequestHandler = async (req) => {
  const { progress, notFinished, courseId, userId } = (await req.parseBody()) as any;
  if (!progress || notFinished === undefined || !courseId || !userId) throw req.json(400, 'Badly formatted request.');
  const ret = await drizzleClient(req.env, import.meta.env.VITE_USE_PROD_DB === '1')
    .update(content_user_progress)
    .set({ progress, finished_date: notFinished ? null : getSQLTimeStamp() })
    .where(and(eq(content_user_progress.index_id, courseId), eq(content_user_progress.user_id, userId)))
    .returning();
  req.json(200, ret);
};
