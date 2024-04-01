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
  const { courseId, userId } = (await req.parseBody()) as any;
  if ( !courseId || !userId)
    throw req.json(400, 'Badly formatted request.');
  const db = drizzleClient(req.env, import.meta.env.VITE_USE_PROD_DB === '1');
  const ret = await db.select().from(content_user_progress).where(and(eq(content_user_progress.index_id, courseId), eq(content_user_progress.user_id, userId)));
  req.json(200, ret);
};
