import { $, type QRL } from "@builder.io/qwik";
import { type GlobalContextType } from "../types/GlobalContext";
import {
  type AuthResponse,
  type AuthTokenResponse,
  type OAuthResponse,
  type Session,
} from "@supabase/supabase-js";
import { server$ } from "@builder.io/qwik-city";
import { type z } from "@builder.io/qwik-city";

import { supabase } from "../utils/supabaseClient";
import { supabaseServer } from "../utils/supabaseServer";
import { type emailLoginSchema } from "../types/AuthForm";
import { loadPrivateData, validatePrivateData } from "~/routes/plugin@PrivateActions";
import { checkProtectedPath } from "~/routes/plugin@Redirect";
import { redis } from "~/utils/redis";

export const preload = server$(async function () {
  const ret: {
    session: Session | null;
    url: URL;
  } = {
    session: null,
    url: this.url,
  };

  const access_token = this.cookie.get("access_token"),
    refresh_token = this.cookie.get("refresh_token");

  if (!access_token || !refresh_token) return ret;

  let time1 = performance.now();
  const redisCache = await redis.json.get(`cached_session${access_token.value}`);
  if (redisCache) {
    console.log("cache hit with time ", performance.now() - time1);
    ret.session = redisCache as Session;
    return ret;
  }

  time1 = performance.now();

  const res = await supabaseServer.auth.setSession({
    access_token: access_token.value,
    refresh_token: refresh_token.value,
  });

  console.log("cache miss with supabase time ", performance.now() - time1);

  if (res.error) {
    console.error(res.error);
    return ret;
  }
  redis.json.set(
    `cached_session${res.data.session!.access_token}`,
    "$",
    JSON.stringify(res.data.session)
  );

  loginHelper.bind(this)(
    {
      access_token: res.data.session!.access_token,
      refresh_token: res.data.session!.refresh_token,
    },
    res.data.session?.expires_in
  );
  ret.session = res.data.session;

  return ret;
});

export const saveSessionCacheOnLogIn = server$((session) => {
  redis.json.set(`cached_session${session.access_token}`, "$", JSON.stringify(session));
});

export const loginHelper = server$(function (cookie, sessionExpiresIn) {
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
  globalContext.session = session;
  globalContext.isLoggedIn = true;

  loginHelper(cookie, sessionExpiresIn);
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
    callbackFn?: QRL<(V: OAuthResponse) => any>,
    errorFn: QRL<(V: any) => any> | Console["error"] = console.error
  ) => {
    return supabase.auth
      .signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: redirectURL,
        },
      })
      .then((res) => {
        if (res.error) errorFn(res.error.toString());
        else if (callbackFn) callbackFn(res);
      })
      .catch(errorFn);
  }
);

export const signUpWithPassword = $(
  (
    data: z.infer<typeof emailLoginSchema>,
    callbackFn?: QRL<(V: AuthResponse) => any>,
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
        else if (callbackFn) callbackFn(res);
      })
      .catch(errorFn);
  }
);

export const authStateChange = $((globalStore: GlobalContextType) => {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    console.log(event, session);

    if (!session || !session.access_token || !session.refresh_token) {
      logout(globalStore);
      return;
    }
    const cookies = {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    };
    login(globalStore, session, cookies, session.expires_in);
    loadPrivateDataHelper(globalStore);

    if (event === "SIGNED_IN") saveSessionCacheOnLogIn(session);
  });
});

export const loadPrivateDataHelper = $((globalStore: GlobalContextType) => {
  console.log("private data status: ", globalStore.privateData);
  if (!globalStore.privateData.resolved && !globalStore.privateData.initiated) {
    globalStore.privateData.initiated = true;
    loadPrivateData().then((res) => {
      if (validatePrivateData(res)) {
        console.log("loaded private data.", res.data![0]);

        globalStore.privateData.data = res.data![0];
        globalStore.privateData.resolved = true;
        globalStore.privateData.initiated = false;
      }
    });
  }
});
