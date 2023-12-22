import type { RequestEventBase } from "@builder.io/qwik-city";
import { createClient, type Client } from "@libsql/client";

let client: Client | null = null;

// const TURSO_URL = process.env["TURSO_URL"];
// const TURSO_TOKEN = process.env["TURSO_TOKEN"];

// if(!TURSO_URL || !TURSO_TOKEN) console.error("TURSO ENV VARIABLE ERROR SERVER");

export const initTursoIfNeeded = async (env: RequestEventBase["env"]) => {
  if (!client) {
    console.log("yoyoyo");
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
