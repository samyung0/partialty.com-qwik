import { type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import tursoClient from "~/utils/tursoClient";
import { profiles } from "../../drizzle_turso/schema/profiles";
import { user_key } from "../../drizzle_turso/schema/user_key";
import { user_session } from "../../drizzle_turso/schema/user_session";

let client: ReturnType<typeof init> | null = null;

const init = (client: Client) => drizzle(client, { schema: { profiles, user_key, user_session } });

export const initDrizzleIfNeeded = async () => {
  if (!client) {
    client = init(tursoClient());
  }
};

export default () => {
  if (!client) throw new Error("Drizzle client not initialized");
  return client;
};
