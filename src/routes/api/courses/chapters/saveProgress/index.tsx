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
  const { courseId, userId, chapterId, _filteredChapter } = (await req.parseBody()) as any;
  if (!courseId || !userId || !chapterId || !_filteredChapter) throw req.json(400, 'Badly formatted request.');
  const filteredChapter = JSON.parse(_filteredChapter);
  const db = drizzleClient(req.env, import.meta.env.VITE_USE_PROD_DB === '1');
  const _prevProgress = await db
    .select()
    .from(content_user_progress)
    .where(and(eq(content_user_progress.index_id, courseId), eq(content_user_progress.user_id, userId)));
  const prevProgress = _prevProgress.length > 0;
  const newProgress = [...(prevProgress ? _prevProgress[0].progress : [])];
  if (!(prevProgress ? _prevProgress[0].progress : []).includes(chapterId)) newProgress.push(chapterId);

  const notFinished = filteredChapter.filter((id: string) => !newProgress.includes(id)).length > 0;
  const ret = prevProgress
    ? await db
        .update(content_user_progress)
        .set({ progress: newProgress, finished_date: notFinished ? null : getSQLTimeStamp() })
        .where(and(eq(content_user_progress.index_id, courseId), eq(content_user_progress.user_id, userId)))
        .returning()
    : await db
        .insert(content_user_progress)
        .values({
          id: v4(),
          user_id: userId,
          index_id: courseId,
          progress: newProgress,
          finished_date: notFinished ? null : getSQLTimeStamp(),
        })
        .returning();
  req.json(200, ret);
};
