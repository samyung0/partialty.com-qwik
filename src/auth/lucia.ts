import type { RequestEvent } from "@builder.io/qwik-city";
import { libsql } from "@lucia-auth/adapter-sqlite";
import { github, google } from "@lucia-auth/oauth/providers";
import { lucia } from "lucia";
import { qwik } from "lucia/middleware";
import tursoClient from "~/utils/tursoClient";

import bunApp from "~/_api/bun/util/edenTreaty";

let _auth: ReturnType<typeof _lucia> | null = null;
let _github: ReturnType<typeof _githubAuth> | null = null;
let _google: ReturnType<typeof _googleAuth> | null = null;

const _googleAuth = (lucia: ReturnType<typeof _lucia>, env: RequestEvent["env"]) =>
  google(lucia, {
    clientId: env.get("GOOGLE_ID")!,
    clientSecret: env.get("GOOGLE_SECRET")!,
    scope: ["email"],
    redirectUri:
      import.meta.env.MODE === "production"
        ? "https://www.partialty.com/login/google/callback/"
        : "http://localhost:5173/login/google/callback/",
  });

const _githubAuth = (lucia: ReturnType<typeof _lucia>, env: RequestEvent["env"]) =>
  github(lucia, {
    clientId: env.get("GITHUB_ID")!,
    clientSecret: env.get("GITHUB_SECRET")!,
    scope: ["user"],
    redirectUri:
      import.meta.env.MODE === "production"
        ? "https://www.partialty.com/login/github/callback/"
        : "http://localhost:5173/login/github/callback/",
  });

const _lucia = (prodInDev: boolean = false) =>
  lucia({
    env: import.meta.env.MODE === "production" ? "PROD" : "DEV",
    passwordHash: {
      generate: async (password) => {
        const res = await bunApp.auth.signup.passwordToHash.post({
          time: Date.now(),
          password,
        });
        if (res.error || res.data.error) throw Error(res.data?.message);
        return res.data.data ?? "";
      },
      validate: async (password, hash) => {
        const res = await bunApp.auth.login.hashToPassword.post({
          time: Date.now(),
          password,
          hash,
        });
        if (res.error || res.data.error) throw Error(res.data?.message);
        return !!res.data.isVerified;
      },
    },
    middleware: qwik(),
    adapter: libsql(tursoClient(), {
      user: "profiles",
      key: "user_key",
      session: "user_session",
    }),
    getUserAttributes: (user) => {
      const accessible_courses_array = new Uint8Array(user.accessible_courses) as any;
      return {
        email: user.email,
        phone: user.phone,
        last_signed_in: user.last_signed_in,
        role: user.role,
        stripe_id: user.stripe_id,
        created_at: user.created_at,
        username: user.username,
        avatar_url: user.avatar_url,
        github_id: user.github_id,
        nickname: user.nickname,
        email_verified: user.email_verified,
        github_username: user.github_username,
        accessible_courses: JSON.parse(String.fromCharCode.apply(null, accessible_courses_array)) as string[]
      };
    },
    getSessionAttributes: (session) => {
      return {
        created_at: session.created_at,
      };
    },
    sessionExpiresIn: {
      activePeriod: 60 * 60 * 1000, // 1 hour
      idlePeriod: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
  });

export const initLuciaIfNeeded = async (env: RequestEvent["env"], prodInDev: boolean = false) => {
  if (!_auth) {
    _auth = _lucia(prodInDev);
  }
  if (!_github) _github = _githubAuth(_auth, env);
  if (!_google) _google = _googleAuth(_auth, env);
};

export const auth = () => {
  if (!_auth) throw new Error("Lucia auth not initialized");
  return _auth;
};

export const githubAuth = () => {
  if (!_github) throw new Error("Github auth not initialized");
  return _github;
};

export const googleAuth = () => {
  if (!_google) throw new Error("Github auth not initialized");
  return _google;
};

export type Auth = ReturnType<typeof auth>;
