import type { RequestEventBase } from "@builder.io/qwik-city";
import { createClient, type Client } from "@libsql/client/web";

let client: Client | null = null;

export const initTursoIfNeeded = async (
  env: RequestEventBase["env"],
  prodInDev: boolean = false
) => {
  if (!client) {
    if (prodInDev) {
      console.log("USING PROD DB!");
      if (!env.get("TURSO_PROD_URL") || !env.get("TURSO_PROD_TOKEN")) {
        console.error("TURSO ENV VARIABLE ERROR SERVER");
        return null;
      }
      client = createClient({
        url: env.get("TURSO_PROD_URL")!,
        authToken: env.get("TURSO_PROD_TOKEN")!,
      });
    } else {
      if (!env.get("TURSO_URL") || !env.get("TURSO_TOKEN")) {
        console.error("TURSO ENV VARIABLE ERROR SERVER");
        return null;
      }
      client = createClient({ url: env.get("TURSO_URL")!, authToken: env.get("TURSO_TOKEN")! });
    }
  }
};

export default () => {
  if (!client) throw new Error("Turso client not initialized");
  return client;
};
