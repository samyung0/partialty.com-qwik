import { server$ } from "@builder.io/qwik-city";
import { eq } from "drizzle-orm";
import drizzle from "~/utils/drizzleClient";
import { profiles } from "../../drizzle_turso/schema/profiles";

export const loadPrivateData = server$(function (id: string) {
  return drizzle()
    .select()
    .from(profiles)
    .where(eq(profiles.id, id))
    .limit(1)
    .then(([data]) => {
      return data;
    })
    .catch((e) => {
      console.error(e);
      return null;
    });
});
