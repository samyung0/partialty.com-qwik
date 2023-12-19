import type { RequestEventBase } from "@builder.io/qwik-city";
import { createClient } from "@supabase/supabase-js";
import type Supabase from "~/types/Supabase";

// const SUPABASE_URL = process.env["SUPABASE_URL"],
//   SUPABASE_SECRET_KEY = process.env["SUPABASE_SECRET_KEY"];

// if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) console.error("ENV VARIABLE ERROR SERVER");

// supabaseServer should not be used in client, if you really need to use it, do it through server$
export const supabaseServer = ({ env }: RequestEventBase) => {
  if (!env.get("SUPABASE_URL") || !env.get("SUPABASE_SECRET_KEY"))
    throw new Error("Missing SUPABASE_URL or SUPABASE_SECRET_KEY");
  return createClient<Supabase>(env.get("SUPABASE_URL")!, env.get("SUPABASE_SECRET_KEY")!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
};
