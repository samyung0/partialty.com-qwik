import { type RequestEvent } from "@builder.io/qwik-city";
import { type Session } from "@supabase/supabase-js";

export interface GlobalContextType {
  isLoggedIn: boolean;
  privateData: {
    data: any;
    resolved: boolean;
    initiated: boolean;
  };
  publicData: {
    data: any;
    resolved: boolean;
    initiated: boolean;
  };
  req: {
    url: RequestEvent["url"] | null;
  };
  session: (Session & { userRole?: string }) | null;
}

export const defaultValue: GlobalContextType = {
  isLoggedIn: false,
  privateData: {
    data: null,
    resolved: false,
    initiated: false,
  },
  publicData: {
    data: null,
    resolved: false,
    initiated: false,
  },
  req: {
    url: null,
  },
  session: null,
};
