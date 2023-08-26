import { $ } from "@builder.io/qwik";
import { supabase } from "../utils/supabaseClient";

// IMPORTANT
// currently, any code that fetches from the db (private actions)
// are run from the client side where the user session can be detected
// hence we do not use server$()

export const loadPrivateData = $(async () => {
  // RLS POLICY
  // SUPABASE: yes
  return supabase.from("profiles").select("*");
});

export const validatePrivateData = (res: any) => {
  let valid = true;
  if (res.error) {
    console.error("Error when fetching private data: ", res.error);
    valid = false;
  } else {
    const data = res.data;
    if (!data) {
      console.error("Error when fetching private data");
      valid = false;
    } else if (data.length === 0) {
      console.log(
        "No private data fetched. This is probably because the user is not logged in or has logged out!"
      );
      valid = false;
    } else if (data.length > 1) {
      console.error(
        "fetched more than 1 row of private data! it is probably fetching unauthorized data as well! check rls policy and auth flow"
      );
      valid = false;
    }
  }
  return valid;
};
