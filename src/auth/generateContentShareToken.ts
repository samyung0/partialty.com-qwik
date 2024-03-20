import { eq } from "drizzle-orm";
import { generateRandomString, isWithinExpiration } from "lucia/utils";
import drizzleClient from "~/utils/drizzleClient";
import { email_verification_token } from "../../drizzle_turso/schema/email_verification_token";
import { content_share_token } from "../../drizzle_turso/schema/content_share_token";

const EXPIRES_IN = 1000 * 60 * 30; // 30 minutes

export default async (contentId: string) => {
  const drizzle = drizzleClient();
  const storedUserTokens = await drizzle
    .select()
    .from(content_share_token)
    .where(eq(content_share_token.index_id, contentId));
  if (storedUserTokens.length > 0) {
    const reusableStoredToken = storedUserTokens.find((token) => {
      // check if expiration is within 15 minutes
      // and reuse the token if true
      return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
    });
    if (reusableStoredToken) return reusableStoredToken.id;
  }
  const token = generateRandomString(7);

  await drizzle.insert(content_share_token).values({
    id: token,
    expires: BigInt(new Date().getTime() + EXPIRES_IN),
    index_id: contentId,
  });

  return token;
};
