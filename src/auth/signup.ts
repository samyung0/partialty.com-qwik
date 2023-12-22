import { globalAction$, zod$ } from "@builder.io/qwik-city";
import { LibsqlError } from "@libsql/client";
import { auth } from "~/auth/lucia";
import { emailLoginSchema } from "~/types/Signup";

export const useSignupWithPassword = globalAction$(async function (data, event) {
  try {
    const Auth = auth();
    const user = await Auth.createUser({
      key: {
        providerId: "email",
        providerUserId: data.email.toLowerCase(),
        password: data.password,
      },
      attributes: {
        email: data.email,
      },
    });
    const session = await Auth.createSession({
      userId: user.userId,
      attributes: {},
    });
    const authRequest = Auth.handleRequest(event);
    authRequest.setSession(session);

  } catch (e: any) {
    if (e instanceof LibsqlError) {
      if (e.message.includes("UNIQUE constraint failed: profiles.email"))
        return event.fail(500, { message: `Error! User already exists` });
    }
    return event.fail(500, { message: e.toString() });
    // provided user attributes violates database rules (e.g. unique constraint)
    // or unexpected database errors
  }
}, zod$(emailLoginSchema));
