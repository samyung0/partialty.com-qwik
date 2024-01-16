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

const _googleAuth = (lucia: ReturnType<typeof _lucia>, env: RequestEvent["env"], origin: string) =>
  google(lucia, {
    clientId: env.get("GOOGLE_ID")!,
    clientSecret: env.get("GOOGLE_SECRET")!,
    scope: ["email"],
    redirectUri: origin + "/login/google/callback/",
  });

const _githubAuth = (lucia: ReturnType<typeof _lucia>, env: RequestEvent["env"], origin: string) =>
  github(lucia, {
    clientId: env.get("GITHUB_ID")!,
    clientSecret: env.get("GITHUB_SECRET")!,
    scope: ["user"],
    redirectUri: origin + "/login/github/callback/",
  });

const _lucia = () =>
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
      };
    },
    getSessionAttributes: (session) => {
      return {
        created_at: session.created_at,
      };
    },
  });

export const initLuciaIfNeeded = async (env: RequestEvent["env"], origin: string) => {
  console.log(origin);
  if (!_auth) {
    _auth = _lucia();
  }
  if (!_github) _github = _githubAuth(_auth, env, origin);
  if (!_google) _google = _googleAuth(_auth, env, origin);
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
