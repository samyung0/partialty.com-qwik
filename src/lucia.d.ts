/// <reference types="lucia" />
declare namespace Lucia {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  type Auth = import("./auth/lucia.js").Auth;
  type DatabaseUserAttributes = {
    email?: string;
    phone?: string;
    last_signed_in?: string;
    role?: "free" | "paid" | "teacher";
    stripe_id?: string;
    created_at?: string;
    username?: string;
    avatar_url?: string;
    github_id?: number;
  };
  type DatabaseSessionAttributes = {
    created_at?: string;
  };
}
