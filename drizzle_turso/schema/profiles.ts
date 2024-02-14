import { InferInsertModel, InferSelectModel, relations, sql } from "drizzle-orm";
import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { DEFAULTROLE } from "~/const/defaultRole";
import roles from "~/const/roles";
import { content } from "./content";

export const profiles = sqliteTable("profiles", {
  id: text("id").notNull().primaryKey(),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  email: text("email").unique(),
  phone: text("phone"),
  role: text("role", { enum: roles }).notNull().default(DEFAULTROLE),
  stripe_id: text("stripe_id"),
  username: text("username"),
  avatar_url: text("avatar_url").notNull(),
  github_id: text("github_id"),
  google_id: text("google_id"),
  nickname: text("nickname").notNull(),
  email_verified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
  github_username: text("github_username"),
  accessible_courses: blob("accessible_courses", { mode: "json" }).$type<string[]>(), // TODO: remove or change to text based field
});

export type Profiles = InferSelectModel<typeof profiles>;
export type NewProfile = InferInsertModel<typeof profiles>;
