import { component$ } from "@builder.io/qwik";
import { RequestHandler, server$ } from "@builder.io/qwik-city";
import { generateRandomString } from "lucia/utils";
import drizzleClient, { initDrizzleIfNeeded } from "~/utils/drizzleClient";
import tursoClient, { initTursoIfNeeded } from "~/utils/tursoClient";
import { content_share_token } from "../../../../../drizzle_turso/schema/content_share_token";

export const onRequest: RequestHandler = ({ env, cacheControl }) => {
  initTursoIfNeeded(env, import.meta.env.VITE_USE_PROD_DB === "1");
  initDrizzleIfNeeded(env, import.meta.env.VITE_USE_PROD_DB === "1");
};

const EXPIRES_IN = 1000 * 60 * 30; // 30 minutes
export const generateToken = server$(async function (contentId: string) {
  // const storedUserTokens = await drizzleClient(this.env)
  //   .select()
  //   .from(content_share_token)
  //   .where(eq(content_share_token.index_id, contentId));
  // if (storedUserTokens.length > 0) {
  //   const reusableStoredToken = storedUserTokens.find((token) => {
  //     // check if expiration is within 15 minutes
  //     // and reuse the token if true
  //     return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
  //   });
  //   await Promise.allSettled(
  //     storedUserTokens
  //       .filter((token) => token.id !== reusableStoredToken?.id || "")
  //       .map(async (token) => {
  //         await drizzleClient(this.env)
  //           .delete(content_share_token)
  //           .where(eq(content_share_token.id, token.id));
  //       })
  //   );
  //   if (reusableStoredToken) return reusableStoredToken.id;
  // }
  const token = generateRandomString(6).toUpperCase();
  const client = tursoClient(this.env);
  await client.execute({
    sql: "INSERT INTO content_share_token (id, index_id, expires) VALUES (?, ?, ?)",
    args: [token, contentId, BigInt(new Date().getTime() + EXPIRES_IN)],
  });
  // await drizzleClient(this.env).transaction(async (tx) => {
  //   await tx
  //     .insert(content_share_token)
  //     .values({
  //       id: token,
  //       expires: BigInt(new Date().getTime() + EXPIRES_IN),
  //       index_id: contentId,
  //     })
  //     .returning();
  // });

  return token;
});

export default component$(() => {
  return (
    <button type="button" onClick$={() => generateToken("e90b4a02-4dd9-463f-8292-acd956ee1ced")}>
      Click
    </button>
  );
});
