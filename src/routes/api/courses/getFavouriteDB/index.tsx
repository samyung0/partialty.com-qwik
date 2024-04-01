import type { RequestHandler } from '@builder.io/qwik-city';
import { eq } from 'drizzle-orm';
import drizzleClient from '~/utils/drizzleClient';
import { profiles } from '../../../../../drizzle_turso/schema/profiles';

export const onPost: RequestHandler = async (req) => {
  const { userId } = (await req.parseBody()) as any;
  if (!userId) throw req.json(400, 'User ID');
  const favourite_courses =
    (
      await drizzleClient(req.env, import.meta.env.VITE_USE_PROD_DB === '1')
        .select({ favourite_courses: profiles.favourite_courses })
        .from(profiles)
        .where(eq(profiles.id, userId))
    )[0]?.favourite_courses || [];
  req.json(200, favourite_courses);
};
