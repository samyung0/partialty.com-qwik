import { sql } from "drizzle-orm";
import { blob, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { DEFAULTROLE } from "~/const";

export const profiles = sqliteTable("profiles", {
  id: text("id").notNull().primaryKey(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  email: text("email").unique(),
  phone: text("phone"),
  lastSignedIn: text("last_signed_in").default(sql`CURRENT_TIMESTAMP`),
  role: text("role", { enum: ["free", "paid", "teacher"] })
    .notNull()
    .default(DEFAULTROLE),
  stripeId: text("stripe_id"),
  username: text("username"),
  avatarUrl: text("avatar_url").notNull(),
  githubId: blob("github_id", { mode: "bigint" }),
  nickname: text("nickname").notNull(),
});
