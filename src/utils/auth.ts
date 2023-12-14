import { $, type QRL } from "@builder.io/qwik";
import { removeClientDataCache, server$, type RouteNavigate, type z } from "@builder.io/qwik-city";
import { type AuthResponse, type AuthTokenResponse, type Session } from "@supabase/supabase-js";
import deepEqual from "lodash.isequal";
import { defaultValue, type GlobalContextType } from "../types/GlobalContext";

import { eq } from "drizzle-orm";
import drizzle from "~/utils/drizzle";
import { getCacheJson, setCacheJson } from "~/utils/redisSessionCache";
import { loadPrivateData } from "~/utils/tursodb";
import { profiles } from "../../drizzle_turso/schema/profile";
import { type emailLoginSchema } from "../types/AuthForm";
import { supabase } from "./supabaseClient";
import { supabaseServer } from "./supabaseServer";

export const preload = server$(async function () {
  const ret = Object.assign({}, defaultValue) as GlobalContextType;
  ret.req.url = this.url;

  const access_token = this.cookie.get("access_token"),
    refresh_token = this.cookie.get("refresh_token");

  if (!access_token || !refresh_token) return ret;
  if (this.sharedMap.get("session")) {
    console.log("not initial page visit");
    ret.session = this.sharedMap.get("session");
    return ret;
  }

  // cache hit in upstash redis
  let time1 = performance.now();
  const redisCache = await getCacheJson(`cached_session${access_token.value}`);
  if (redisCache && redisCache.userRole) {
    console.log("initial cache hit with time ", performance.now() - time1);
    ret.session = redisCache;
    this.sharedMap.set("session", redisCache);
    return ret;
  }

  // cache miss
  // refresh session and get user role in supabase
  time1 = performance.now();
  const res = await supabaseServer.auth.setSession({
    access_token: access_token.value,
    refresh_token: refresh_token.value,
  });

  if (res.error) {
    console.error(res.error);
    return ret;
  }
  ret.session = Object.assign({}, res.data.session);

  let userRole = null;
  try {
    userRole = (
      await drizzle
        .select({
          role: profiles.role,
        })
        .from(profiles)
        .where(eq(profiles.id, res.data.user!.id))
        .limit(1)
    )[0].role;
  } catch (e) {
    console.error(e);
    return ret;
  }

  console.log("initial cache miss with time ", performance.now() - time1);

  loginHelper.bind(this)(
    {
      access_token: res.data.session!.access_token,
      refresh_token: res.data.session!.refresh_token,
    },
    res.data.session?.expires_in
  );
  setCacheJson(
    `cached_session${res.data.session!.access_token}`,
    JSON.stringify(Object.assign({}, res.data.session, { userRole: userRole }))
  );
  ret.session.userRole = userRole;
  return ret;
});

export const loginHelper = server$(function (cookie, _sessionExpiresIn) {
  this.cookie.set("access_token", cookie.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });
  this.cookie.set("refresh_token", cookie.refresh_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });
});

export const login = $(function (
  globalContext: GlobalContextType,
  session: Session,
  cookie: {
    access_token: string;
    refresh_token: string;
  },
  sessionExpiresIn: number
) {
  console.log("login");
  if (globalContext.session) {
    const compare = JSON.parse(JSON.stringify(globalContext.session));
    if (compare["userRole"]) delete compare["userRole"];
    if (deepEqual(compare, session)) return false;
  }

  globalContext.session = session;
  globalContext.isLoggedIn = true;
  globalContext.session.userRole = globalContext.privateData.data.profile!.role;

  loginHelper(cookie, sessionExpiresIn);
  return true;
});

// we can clear the upstash redis cache but its not necessary
// eviction is enabled so old data will be removed when storage is full
export const logoutHelper = server$(function () {
  this.cookie.delete("access_token", { path: "/" });
  this.cookie.delete("refresh_token", { path: "/" });
});

export const logout = $(async function (globalContext: GlobalContextType, nav: RouteNavigate) {
  console.log("logging out");

  globalContext.session = null;
  globalContext.isLoggedIn = false;

  // const [shouldRedirect, redirectTo] =
  await logoutHelper();

  // force page redirect if on protected route
  // could change this behavior
  // if (shouldRedirect) return window.location.replace(redirectTo);
});

export const DBLogout = $(() => supabase.auth.signOut());

export const signInWithPassword = $(
  (
    data: z.infer<typeof emailLoginSchema>,
    callbackFn?: QRL<(V: AuthTokenResponse) => any>,
    errorFn: QRL<(V: any) => any> | Console["error"] = console.error
  ) => {
    return supabase.auth
      .signInWithPassword(data)
      .then((res) => {
        if (res.error) errorFn(res.error.toString());
        else if (callbackFn) callbackFn(res);
      })
      .catch(errorFn);
  }
);

export const signInWithGitHub = $(
  (
    redirectURL: string = "/",
    navMethod: Function,
    errorFn: QRL<(V: any) => any> | Console["error"] = console.error
  ) => {
    return supabase.auth
      .signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: redirectURL,
          skipBrowserRedirect: true,
        },
      })
      .then((res) => {
        if (res.error) errorFn(res.error.toString());
        else navMethod(res.data.url);
      });
  }
);

export const signinWithGoogle = $(
  (
    redirectURL: string = "/",
    navMethod: Function,
    errorFn: QRL<(V: any) => any> | Console["error"] = console.error
  ) => {
    return supabase.auth
      .signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectURL,
          skipBrowserRedirect: true,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })
      .then((res) => {
        if (res.error) errorFn(res.error.toString());
        else navMethod(res.data.url);
      });
  }
);

export const signUpWithPassword = $(
  (
    data: z.infer<typeof emailLoginSchema>,
    callbackFn: QRL<(V: AuthResponse) => any>,
    errorFn: QRL<(V: any) => any> | Console["error"] = console.error,
    redirectURL: string = "/"
  ) => {
    return supabase.auth
      .signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: redirectURL,
        },
      })
      .then((res) => {
        if (res.error) errorFn(res.error.toString());
        else callbackFn(res);
      })
      .catch(errorFn);
  }
);

export const updateSessionCache = $(async (globalStore: GlobalContextType) => {
  const toCache = Object.assign({}, globalStore.session, {
    userRole: globalStore.privateData.data.profile!.role,
  });
  console.log("cached user role and session");
  setCacheJson(`cached_session${globalStore.session!.access_token}`, JSON.stringify(toCache));
});

export const authStateChange = $(async (globalStore: GlobalContextType, nav: RouteNavigate) => {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    console.log("AUTH:", event);

    if (event === "SIGNED_OUT" || event === "SIGNED_IN" || event === "USER_UPDATED") {
      removeClientDataCache();
    }

    if (event === "SIGNED_OUT") {
      await logout(globalStore, nav);
      nav();
      return;
    }
    if (event === "SIGNED_IN") {
      const cookies = {
        access_token: session!.access_token,
        refresh_token: session!.refresh_token,
      };
      if (!globalStore.privateData.data.profile) {
        globalStore.privateData.data.profile = await loadPrivateData(session!.user.id);
        console.log("loaded profile data.");
      }

      const shouldUpdateCache = await login(globalStore, session!, cookies, session!.expires_in);
      if (shouldUpdateCache) updateSessionCache(globalStore);

      nav();
    }
  });
});
