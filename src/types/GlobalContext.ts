import { type RequestEvent } from "@builder.io/qwik-city";
import { type Session } from "@supabase/supabase-js";
import type { InferSelectModel } from "drizzle-orm";
import type { profiles } from "../../drizzle_turso/schema/profile";

export interface GlobalContextType {
  isLoggedIn: boolean;
  privateData: {
    data: {
      profile: InferSelectModel<typeof profiles> | null;
    };
  };
  publicData: {
    data: any;
  };
  req: {
    url: RequestEvent["url"] | null;
  };
  session: (Session & { userRole?: string }) | null;
}

export const defaultValue: GlobalContextType = {
  isLoggedIn: false,
  privateData: {
    data: {
      profile: null,
    },
  },
  publicData: {
    data: null,
  },
  req: {
    url: null,
  },
  session: null,
};
