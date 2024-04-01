import type { RequestHandler } from '@builder.io/qwik-city';
import { eq } from 'drizzle-orm';
import drizzleClient from '~/utils/drizzleClient';
import { profiles } from '../../../../../drizzle_turso/schema/profiles';

export const onPost: RequestHandler = async (req) => {
  req.cacheControl({
    maxAge: 0,
    sMaxAge: 0,
    noStore: true,
    noCache: true,
  });
  const { userId, courseId } = (await req.parseBody()) as any;
  if (!courseId || !userId) throw req.json(400, 'Missing Course ID / User ID');
  const favourite_courses =
    (
      await drizzleClient(req.env, import.meta.env.VITE_USE_PROD_DB === '1')
        .select({ favourite_courses: profiles.favourite_courses })
        .from(profiles)
        .where(eq(profiles.id, userId))
    )[0]?.favourite_courses || [];
  const index = favourite_courses.indexOf(courseId);
  if (index >= 0) favourite_courses.splice(index, 1);
  await drizzleClient(req.env, import.meta.env.VITE_USE_PROD_DB === '1')
    .update(profiles)
    .set({ favourite_courses })
    .where(eq(profiles.id, userId))
    .returning();
  req.json(200, 'OK');
};
