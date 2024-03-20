import { eq } from "drizzle-orm";
import { generateRandomString, isWithinExpiration } from "lucia/utils";
import drizzleClient from "~/utils/drizzleClient";
import { email_verification_token } from "../../drizzle_turso/schema/email_verification_token";

const EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

export default async (userId: string) => {
  const drizzle = drizzleClient();
  const storedUserTokens = await drizzle
    .select()
    .from(email_verification_token)
    .where(eq(email_verification_token.user_id, userId));
  if (storedUserTokens.length > 0) {
    const reusableStoredToken = storedUserTokens.find((token) => {
      // check if expiration is within 1 hour
      // and reuse the token if true
      return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
    });
    if (reusableStoredToken) return reusableStoredToken.id;
  }
  const token = generateRandomString(63);
  await drizzle.insert(email_verification_token).values({
    id: token,
    expires: BigInt(new Date().getTime() + EXPIRES_IN),
    user_id: userId,
  });

  return token;
};
