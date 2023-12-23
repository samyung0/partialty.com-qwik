import type { RequestEvent } from "@builder.io/qwik-city";
import { libsql } from "@lucia-auth/adapter-sqlite";
import { github } from "@lucia-auth/oauth/providers";
import { lucia } from "lucia";
import { qwik } from "lucia/middleware";
import tursoClient from "~/utils/tursoClient";

let _auth: ReturnType<typeof _lucia> | null = null;
let _github: ReturnType<typeof _githubAuth> | null = null;

const _githubAuth = (lucia: ReturnType<typeof _lucia>, env: RequestEvent["env"]) =>
  github(lucia, {
    clientId: env.get("GITHUB_ID")!,
    clientSecret: env.get("GITHUB_SECRET")!,
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
    getUserAttributes: (user) => {
      return {
        email: user.email,
        phone: user.phone,
        last_signed_in: user.last_signed_in,
        role: user.role,
        stripe_id: user.stripe_id,
        created_at: user.created_at,
      };
    },
    getSessionAttributes: (session) => {
      return {
        created_at: session.created_at,
      };
    },
  });

export const initLuciaIfNeeded = async (env: RequestEvent["env"]) => {
  if (!_auth) {
    console.log("init auth");
    _auth = _lucia();
  }
  if (!_github) _github = _githubAuth(_auth, env);
};

export const auth = () => {
  if (!_auth) throw new Error("Lucia auth not initialized");
  return _auth;
};

export const githubAuth = () => {
  if (!_github) throw new Error("Github auth not initialized");
  return _github;
};

export type Auth = ReturnType<typeof auth>;
