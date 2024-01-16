import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";

import { eq } from "drizzle-orm";
import verifyEmailTokens from "~/auth/verifyEmailTokens";
import drizzleClient from "~/utils/drizzleClient";
import { profiles } from "../../../../../../drizzle_turso/schema/profiles";

export const useLoader = routeLoader$(async (request) => {
  const token = request.params.token;
  console.log(token);

  request.cacheControl({
    maxAge: 0,
    sMaxAge: 0,
    noStore: true,
    noCache: true,
  });
  try {
    const userId = await verifyEmailTokens(token);
    const drizzle = drizzleClient();
    await drizzle.update(profiles).set({ email_verified: true }).where(eq(profiles.id, userId));
    return { verified: true, userId };
  } catch (e) {
    return { verified: false, error: e };
  }
});

export default component$(() => {
  const verifyInfo = useLoader();

  return (
    <div>
      <div>
        {verifyInfo.value.verified
          ? "You have successfully verified your account!"
          : `Error! ${verifyInfo.value.error}`}
      </div>
      <Link href="/">Home Page</Link>
    </div>
  );
});
