import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { DEFAULTROLE } from "~/const";

export const profiles = sqliteTable("profiles", {
  id: text("id").notNull().primaryKey(),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  email: text("email"),
  phone: text("phone"),
  last_signed_in: text("last_signed_in").default(sql`CURRENT_TIMESTAMP`),
  role: text("role", { enum: ["free", "paid", "teacher"] })
    .notNull()
    .default(DEFAULTROLE),
  stripe_id: text("stripe_id"),
  username: text("username"),
  avatar_url: text("avatar_url").notNull(),
  github_id: blob("github_id", { mode: "bigint" }),
  google_id: blob("google_id", { mode: "bigint" }),
  nickname: text("nickname").notNull(),
  email_verified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
});

export type Profiles = InferSelectModel<typeof profiles>;
export type NewProfile = InferInsertModel<typeof profiles>;
