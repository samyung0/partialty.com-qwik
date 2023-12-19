import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { DEFAULTROLE } from "~/const";

export const profiles = sqliteTable("profiles", {
  id: text("id").notNull().primaryKey(),
  created_at: text("created_at").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  last_signed_in: text("last_signed_in"),
  role: text("role", { enum: ["free", "paid", "teacher"] })
    .notNull()
    .default(DEFAULTROLE),
  stripe_id: text("stripe_id"),
});
