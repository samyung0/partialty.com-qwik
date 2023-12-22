import { drizzle } from "drizzle-orm/libsql";

import tursoClient from "~/utils/tursoClient";
import { profiles } from "../../drizzle_turso/schema/profiles";

export default () => {
  return drizzle(tursoClient(), {
    schema: { profiles },
  });
};
