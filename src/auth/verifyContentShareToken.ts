import type { RequestEventBase } from '@builder.io/qwik-city';
import { eq } from 'drizzle-orm';
import { isWithinExpiration } from 'lucia/utils';
import drizzleClient from '~/utils/drizzleClient';
import { content_share_token } from '../../drizzle_turso/schema/content_share_token';

export default async (env: RequestEventBase['env'], token: string) => {
  const drizzle = drizzleClient(env, import.meta.env.VITE_USE_PROD_DB === '1');
  const storedToken = await drizzle.transaction(async (trx) => {
    const storedToken = await trx.select().from(content_share_token).where(eq(content_share_token.id, token)).limit(1);
    if (storedToken.length === 0) throw new Error('Invalid token');
    // await trx
    //   .delete(content_share_token)
    //   .where(eq(content_share_token.index_id, storedToken[0].index_id));
    return storedToken[0];
  });
  const tokenExpires = Number(storedToken.expires);
  if (!isWithinExpiration(tokenExpires)) {
    throw new Error('Expired token');
  }
  return storedToken.index_id;
};
