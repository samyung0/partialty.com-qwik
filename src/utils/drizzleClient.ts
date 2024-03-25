import type { RequestEventBase } from "@builder.io/qwik-city";
import { type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import tursoClient from "~/utils/tursoClient";
import schemaExport from "../../drizzle_turso/schemaExport";

let client: ReturnType<typeof init> | null = null;

const init = (client: Client) => drizzle(client, { schema: schemaExport });

export const initDrizzleIfNeeded = (env: RequestEventBase["env"], prodInDev: boolean = false) => {
  if (!client) {
    client = init(tursoClient(env, prodInDev));
  }
};

export default (env: RequestEventBase["env"], prodInDev: boolean = false) => {
  if (!client) throw new Error("YO WTF")
  return client;
};
