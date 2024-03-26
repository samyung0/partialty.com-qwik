import type { RequestEventBase } from '@builder.io/qwik-city';
import { eq } from 'drizzle-orm';
import { isWithinExpiration } from 'lucia/utils';
import drizzleClient from '~/utils/drizzleClient';
import { email_verification_token } from '../../drizzle_turso/schema/email_verification_token';

export default async (env: RequestEventBase['env'], token: string) => {
  const drizzle = drizzleClient(env, import.meta.env.VITE_USE_PROD_DB === '1');
  const storedToken = await drizzle.transaction(async (trx) => {
    const storedToken = await trx
      .select()
      .from(email_verification_token)
      .where(eq(email_verification_token.id, token))
      .limit(1);
    if (storedToken.length === 0) throw new Error('Invalid token');
    await trx.delete(email_verification_token).where(eq(email_verification_token.user_id, storedToken[0].user_id));
    return storedToken[0];
  });
  const tokenExpires = Number(storedToken.expires);
  if (!isWithinExpiration(tokenExpires)) {
    throw new Error('Expired token');
  }
  return storedToken.user_id;
};
