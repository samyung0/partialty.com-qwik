import type { RequestEventBase } from "@builder.io/qwik-city";
import { createClient, type Client } from "@libsql/client";

let client: Client | null = null;

export default (env: RequestEventBase["env"]) => {
  if (client) return client;
  if (!env.get("TURSO_URL") || !env.get("TURSO_TOKEN"))
    throw new Error("Missing TURSO_URL or TURSO_TOKEN");
  client = createClient({ url: env.get("TURSO_URL")!, authToken: env.get("TURSO_TOKEN")! });
  return client;
};
