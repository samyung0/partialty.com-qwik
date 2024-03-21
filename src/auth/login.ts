import { globalAction$, zod$ } from "@builder.io/qwik-city";
import { LuciaError } from "lucia";
import { auth } from "~/auth/lucia";
import { emailLoginSchema } from "~/types/Signup";

export const useLoginWithPassword = globalAction$(async function (data, event) {
  try {
    const Auth = auth(event.env, import.meta.env.VITE_USE_PROD_DB === "1");
    const authRequest = Auth.handleRequest(event);
    const key = await Auth.useKey("email", data.email, data.password);

    const session = await Auth.createSession({
      userId: key.userId,
      attributes: {},
    });
    authRequest.setSession(session);
  } catch (e) {
    if (
      e instanceof LuciaError &&
      (e.message === "AUTH_INVALID_KEY_ID" || e.message === "AUTH_INVALID_PASSWORD")
    ) {
      // user does not exist or invalid password
      return event.fail(500, { message: "Incorrect username or password" });
    }
    return event.fail(500, { message: (e as any).toString() });
  }
}, zod$(emailLoginSchema));
