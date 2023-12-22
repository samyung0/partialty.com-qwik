import { drizzle } from "drizzle-orm/libsql";

import type { RequestEventBase } from "@builder.io/qwik-city";
import tursoClient from "~/utils/tursoClient";
import { profiles } from "../../drizzle_turso/schema/profiles";

export default ({ env }: RequestEventBase) => {
  return drizzle(tursoClient(env), {
    schema: { profiles },
  });
};
