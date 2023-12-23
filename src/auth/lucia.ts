import type { RequestEvent } from "@builder.io/qwik-city";
import { libsql } from "@lucia-auth/adapter-sqlite";
import { github, google } from "@lucia-auth/oauth/providers";
import * as argon2 from "argon2";
import { lucia } from "lucia";
import { qwik } from "lucia/middleware";
import tursoClient from "~/utils/tursoClient";

let _auth: ReturnType<typeof _lucia> | null = null;
let _github: ReturnType<typeof _githubAuth> | null = null;
let _google: ReturnType<typeof _googleAuth> | null = null;

const _googleAuth = (lucia: ReturnType<typeof _lucia>, env: RequestEvent["env"], origin: string) =>
  google(lucia, {
    clientId: env.get("GOOGLE_ID")!,
    clientSecret: env.get("GOOGLE_SECRET")!,
    redirectUri: origin + "/login/google/callback/",
  });

const _githubAuth = (lucia: ReturnType<typeof _lucia>, env: RequestEvent["env"]) =>
  github(lucia, {
    clientId: env.get("GITHUB_ID")!,
    clientSecret: env.get("GITHUB_SECRET")!,
    scope: ["read:user"],
  });

const _lucia = () =>
  lucia({
    env: import.meta.env.MODE === "production" ? "PROD" : "DEV",
    middleware: qwik(),
    adapter: libsql(tursoClient(), {
      user: "profiles",
      key: "user_key",
      session: "user_session",
    }),
    passwordHash: {
      generate: argon2.hash,
      validate: (password: string, hash: string) => argon2.verify(hash, password),
    },
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
      };
    },
    getSessionAttributes: (session) => {
      return {
        created_at: session.created_at,
      };
    },
  });

export const initLuciaIfNeeded = async (env: RequestEvent["env"], origin: string) => {
  if (!_auth) {
    console.log("init");
    _auth = _lucia();
  }
  if (!_github) _github = _githubAuth(_auth, env);
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
