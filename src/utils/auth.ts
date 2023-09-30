import { $, type QRL } from "@builder.io/qwik";
import { server$, type z } from "@builder.io/qwik-city";
import { type AuthResponse, type AuthTokenResponse, type Session } from "@supabase/supabase-js";
import deepEqual from "lodash.isequal";
import { defaultValue, type GlobalContextType } from "../types/GlobalContext";

import { getCacheJson, setCacheJson } from "~/utils/cache";
import { loadPrivateDataHelper, validatePrivateData } from "~/utils/privateActions";
import { checkProtectedPath } from "~/utils/redirect";
import { type emailLoginSchema } from "../types/AuthForm";
import { supabase } from "./supabaseClient";
import { supabaseServer } from "./supabaseServer";

export const fetchAuthUserRole = server$(async function () {
  const access_token = this.cookie.get("access_token")?.value;
  if (!access_token) return null;

  const res = await supabaseServer.auth.getUser(access_token);
  if (res.error) return null;

  const privateRoleData = await supabaseServer
    .from("profiles")
    .select("role")
    .eq("id", res.data.user.id);

  if (!validatePrivateData(privateRoleData) || !privateRoleData.data![0].role) return null;
  return privateRoleData.data![0].role;
});

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

  const privateRoleData = await supabaseServer
    .from("profiles")
    .select("role")
    .eq("id", res.data.user!.id);

  console.log("initial cache miss with time ", performance.now() - time1);
  if (!validatePrivateData(privateRoleData)) {
    console.log(res.error);
    return ret;
  }
  if (!privateRoleData.data![0].role) {
    console.log("ROLE DATA MISSING");
    return ret;
  }
  loginHelper.bind(this)(
    {
      access_token: res.data.session!.access_token,
      refresh_token: res.data.session!.refresh_token,
    },
    res.data.session?.expires_in
  );
  setCacheJson(
    `cached_session${res.data.session!.access_token}`,
    JSON.stringify(Object.assign({}, res.data.session, { userRole: privateRoleData.data![0].role }))
  );
  ret.session.userRole = privateRoleData.data![0].role;
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

  loginHelper(cookie, sessionExpiresIn);
  return true;
});

// we can clear the upstash redis cache but its not necessary
// eviction is enabled so old data will be removed when storage is full
export const logoutHelper = server$(function (globalContext: GlobalContextType) {
  this.cookie.delete("access_token");
  this.cookie.delete("refresh_token");

  return checkProtectedPath(globalContext.req.url?.pathname, globalContext.session?.user);
});

export const logout = $(async function (globalContext: GlobalContextType) {
  console.log("logging out");
  const [shouldRedirect, redirectTo] = await logoutHelper(globalContext);

  globalContext.session = null;
  globalContext.isLoggedIn = false;

  // force page redirect if on protected route
  // could change this behavior
  if (shouldRedirect) return window.location.replace(redirectTo);
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

export const authStateChange = $(async (globalStore: GlobalContextType) => {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    console.log(event);

    if (!session || !session.access_token || !session.refresh_token) {
      logout(globalStore);
      return;
    }
    const cookies = {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    };
    const shouldUpdateCache = await login(globalStore, session, cookies, session.expires_in);
    if (shouldUpdateCache) loadPrivateDataHelper(globalStore);
  });
});
