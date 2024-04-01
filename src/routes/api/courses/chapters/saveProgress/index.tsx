import type { RequestHandler } from '@builder.io/qwik-city';
import { and, eq } from 'drizzle-orm';
import { v4 } from 'uuid';
import drizzleClient from '~/utils/drizzleClient';
import getSQLTimeStamp from '~/utils/getSQLTimeStamp';
import { content_user_progress } from '../../../../../../drizzle_turso/schema/content_user_progress';

export const onPost: RequestHandler = async (req) => {
  req.cacheControl({
    maxAge: 0,
    sMaxAge: 0,
    noStore: true,
    noCache: true,
  });
  const { _progress, _notFinished, courseId, userId, _prevProgress } = (await req.parseBody()) as any;
  if (!_progress || _notFinished === undefined || !courseId || !userId || !_prevProgress)
    throw req.json(400, 'Badly formatted request.');
  const progress = JSON.parse(_progress);
  const notFinished = JSON.parse(_notFinished);
  const prevProgress = JSON.parse(_prevProgress);
  const ret = prevProgress
    ? await drizzleClient(req.env, import.meta.env.VITE_USE_PROD_DB === '1')
        .update(content_user_progress)
        .set({ progress, finished_date: notFinished ? null : getSQLTimeStamp() })
        .where(and(eq(content_user_progress.index_id, courseId), eq(content_user_progress.user_id, userId)))
        .returning()
    : await drizzleClient(req.env, import.meta.env.VITE_USE_PROD_DB === '1')
        .insert(content_user_progress)
        .values({
          id: v4(),
          user_id: userId,
          index_id: courseId,
          progress,
          finished_date: notFinished ? null : getSQLTimeStamp(),
        })
        .returning();
  req.json(200, ret);
};
