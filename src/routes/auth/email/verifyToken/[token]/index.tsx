import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";

import { eq } from "drizzle-orm";
import verifyEmailTokens from "~/auth/verifyEmailTokens";
import drizzleClient from "~/utils/drizzleClient";
import { profiles } from "../../../../../../drizzle_turso/schema/profiles";

export const useLoader = routeLoader$(async (request) => {
  const token = request.params.token;

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
    <section class="flex h-[100vh] flex-col items-center justify-center bg-sherbet">
      {verifyInfo.value.verified ? (
        <>
          <h1 class="font-mosk text-[3em] font-bold tracking-wide">Nice!</h1>
          <p class="pt-4 text-lg tracking-wide">You have successfully verified your email! </p>
          <Link
            href="/members/dashboard/"
            class="mt-8 p-2 text-lg tracking-wide underline decoration-primary-dark-gray decoration-wavy underline-offset-4"
          >
            Go to dashboard
          </Link>
        </>
      ) : (
        <>
          <h1 class="font-mosk text-[3em] font-bold tracking-wide">Ooops</h1>
          <p class="pt-4 text-lg tracking-wide">
            It looks like the verification link is invalid or something went wrong in the server.
            Please try to send another verification email!
          </p>
        </>
      )}
    </section>
  );
});
