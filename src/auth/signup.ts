import { globalAction$, zod$ } from "@builder.io/qwik-city";
import { LibsqlError } from "@libsql/client";
import { auth } from "~/auth/lucia";
import { emailSignupSchema, setBioSchema } from "~/types/Signup";

import cloudinary from "~/utils/cloudinary";

export const useSetBio = globalAction$(async function (data, event) {
  console.log(data);
}, zod$(setBioSchema));

export const useSignupWithPassword = globalAction$(async function (data, event) {
  try {
    const time1 = performance.now();

    // checks image (should be fine since default image is used here)
    const cld = cloudinary();
    const img = cld.image(data.avatar_cloudinary_id).toURL();
    // await fetch(img).catch((_) => {
    //   throw Error("Avatar not found!");
    // });

    const Auth = auth();
    const user = await Auth.createUser({
      key: {
        providerId: "email",
        providerUserId: data.email.toLowerCase(),
        password: data.password,
      },
      attributes: {
        email: data.email,
        nickname: data.nickname,
        avatar_url: img,
      },
    });
    const session = await Auth.createSession({
      userId: user.userId,
      attributes: {},
    });
    const authRequest = Auth.handleRequest(event);
    authRequest.setSession(session);

    console.log("Time taken to signup: ", performance.now() - time1);
  } catch (e: any) {
    if (e instanceof LibsqlError) {
      if (e.message.includes("UNIQUE constraint failed: profiles.email"))
        return event.fail(500, { message: `Error! User already exists` });
    }
    return event.fail(500, { message: e.toString() });
    // provided user attributes violates database rules (e.g. unique constraint)
    // or unexpected database errors
  }
}, zod$(emailSignupSchema));
