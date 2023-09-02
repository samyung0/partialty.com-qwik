import { createClient } from "@supabase/supabase-js";
import type Supabase from "~/types/Supabase";

// import { SUPABASE_URL, SUPABASE_SECRET_KEY } from "~/const";

const SUPABASE_URL = process.env["SUPABASE_URL"],
  SUPABASE_SECRET_KEY = process.env["SUPABASE_SECRET_KEY"];

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) console.error("ENV VARIABLE ERROR SERVER");

// supabaseServer should not be used in client, if you really need to use it, do it through server$
export const supabaseServer = createClient<Supabase>(SUPABASE_URL!, SUPABASE_SECRET_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});
