import { globalAction$, zod$ } from "@builder.io/qwik-city";
import { LibsqlError } from "@libsql/client";
import { auth } from "~/auth/lucia";
import { emailSignupSchema, setBioSchema } from "~/types/Signup";

import { eq } from "drizzle-orm";
import cloudinary from "~/utils/cloudinary";
import drizzleClient from "~/utils/drizzleClient";
import { profiles } from "../../drizzle_turso/schema/profiles";

export const useSetBio = globalAction$(async function (data, event) {
  let secure_url: string = data.avatar.secure_url;
  if (data.customAvatar) {
    try {
      if (!event.env.get("CLOUDINARY_NAME") || !event.env.get("CLOUDINARY_PRESET")) {
        return event.fail(500, { message: "Server Error! Please try again later." });
      }
      const url = `https://api.cloudinary.com/v1_1/${event.env.get("CLOUDINARY_NAME")!}/upload`;
      const fd = new FormData();
      fd.append("upload_preset", event.env.get("CLOUDINARY_PRESET")!);
      fd.append("file", data.avatar.secure_url);
      const res = await fetch(url, {
        method: "POST",
        body: fd,
      })
        .then((res) => res.json())
        .catch((e) => {
          throw Error(e);
        });
      secure_url = res.secure_url;
    } catch (e) {
      return event.fail(500, { message: "Unable to upload avatar! Please try again later" });
    }
  }
  const drizzle = drizzleClient();
  try {
    await drizzle
      .update(profiles)
      .set({ avatar_url: secure_url, nickname: data.nickname })
      .where(eq(profiles.id, data.userId));

    const Auth = auth();
    const session = await Auth.createSession({
      userId: data.userId,
      attributes: {},
    });
    const authRequest = Auth.handleRequest(event);
    authRequest.setSession(session);
  } catch (e) {
    return event.fail(500, { message: (e as string).toString() });
  }
}, zod$(setBioSchema));

export const useSignupWithPassword = globalAction$(async function (data, event) {
  try {
    const time1 = performance.now();

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
        email_verified: false,
      },
    });

    console.log("Time taken to signup: ", performance.now() - time1);

    // const emailToken = await generateEmailTokens(user.userId);
    // const verifyLink = import.meta.env.MODE === "production" ? `https://`

    return user;
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
