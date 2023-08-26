import { createClient } from "@supabase/supabase-js";

import type Supabase from "../types/Supabase";

// safe to be exposed
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonPublic = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonPublic)
  console.error("ENV VARIABLE ERROR CLIENT");

export const supabase = createClient<Supabase>(
  supabaseUrl,
  supabaseAnonPublic
  // {
  //   auth: {
  //     persistSession: false,
  //   },
  // }
);
