import { type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import tursoClient from "~/utils/tursoClient";
import schemaExport from "../../drizzle_turso/schemaExport";

let client: ReturnType<typeof init> | null = null;

const init = (client: Client) => drizzle(client, { schema: schemaExport });

export const initDrizzleIfNeeded = async () => {
  if (!client) {
    client = init(tursoClient());
  }
};

export default () => {
  if (!client) throw new Error("Drizzle client not initialized");
  return client;
};
