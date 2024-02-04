import { server$ } from "@builder.io/qwik-city";
import { auth, initLuciaIfNeeded } from "~/auth/lucia";
import { initDrizzleIfNeeded } from "~/utils/drizzleClient";
import { initTursoIfNeeded } from "~/utils/tursoClient";

export default server$(async function () {
  try {
    await initTursoIfNeeded(this.env, !!import.meta.env.VITE_USE_PROD_DB);
    await Promise.all([
      initDrizzleIfNeeded(!!import.meta.env.VITE_USE_PROD_DB),
      initLuciaIfNeeded(this.env, !!import.meta.env.VITE_USE_PROD_DB),
    ]);
    const authRequest = auth().handleRequest(this);
    const session = await authRequest.validate();
    return session;
  } catch (e) {
    /* empty */
  }
});
