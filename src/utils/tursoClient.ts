import type { RequestEventBase } from "@builder.io/qwik-city";
import { createClient, type Client } from "@libsql/client/web";

let client: Client | null = null;

export const initTursoIfNeeded = async (env: RequestEventBase["env"]) => {
  if (!client) {
    console.log("init turso");
    if (!env.get("TURSO_URL") || !env.get("TURSO_TOKEN")) {
      console.error("TURSO ENV VARIABLE ERROR SERVER");
      return null;
    }
    client = createClient({ url: env.get("TURSO_URL")!, authToken: env.get("TURSO_TOKEN")! });
  }
};

export default () => {
  if (!client) throw new Error("Turso client not initialized");
  return client;
};
