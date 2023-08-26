import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

import type Supabase from "../types/Supabase";

const SUPABASE_URL = process.env.SUPABASE_URL,
  SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

// console.log(import.meta.env, "SUPABASE_SECRET_KEY: ", SUPABASE_SECRET_KEY);

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY)
  console.error("ENV VARIABLE ERROR SERVER");

export const supabaseServer = createClient<Supabase>(
  SUPABASE_URL!,
  SUPABASE_SECRET_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
);
