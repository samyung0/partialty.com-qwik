import { server$ } from "@builder.io/qwik-city";
import { eq } from "drizzle-orm";
import drizzle from "~/utils/drizzle";
import { supabaseServer } from "~/utils/supabaseServer";
import { profiles } from "../../drizzle_turso/schema/profile";

export const fetchAuthUserRole = server$(async function () {
  const access_token = this.cookie.get("access_token")?.value;
  if (!access_token) return null;

  const res = await supabaseServer.auth.getUser(access_token);
  if (res.error) return null;

  let userRole = null;
  try {
    userRole = (
      await drizzle
        .select({
          role: profiles.role,
        })
        .from(profiles)
        .where(eq(profiles.id, res.data.user.id))
        .limit(1)
    )[0].role;
  } catch (e) {
    console.error(e);
    return null;
  }

  return userRole;
});

export const loadPrivateData = server$((id: string) => {
  return drizzle
    .select()
    .from(profiles)
    .where(eq(profiles.id, id))
    .limit(1)
    .then(([data]) => {
      return data;
    });
});
