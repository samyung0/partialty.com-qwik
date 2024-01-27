import { createClient } from "@libsql/client/web";

if (!Bun.env.TURSO_URL || !Bun.env.TURSO_TOKEN) throw new Error("Server Mux env var Error!");

export const turso = createClient({ url: Bun.env.TURSO_URL!, authToken: Bun.env.TURSO_TOKEN! });
