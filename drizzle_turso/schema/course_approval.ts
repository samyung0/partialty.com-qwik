import { InferInsertModel, InferSelectModel, relations, sql } from "drizzle-orm";
import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { content_index } from "./content_index";

export const course_approval = sqliteTable("course_approval", {
  id: text("id").notNull().primaryKey(),
  link: text("link").notNull(),
  ready_for_approval: integer("ready_for_approval", { mode: "boolean" }).notNull().default(false),
  added_tags: blob("added_tags").$type<string[]>().notNull(),
  added_categories: text("added_categories"),
  status: text("status", { enum: ["pending", "approved", "rejected", "need_amendment"] }).notNull(),
  description: text("description").notNull(),
  created_at: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  rejected_reason: text("rejected_reason"),
  need_amendment_reason: text("need_amendment_reason"),
  updated_at: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const courseApprovalRelations = relations(course_approval, ({ one }) => ({
  id: one(content_index, {
    fields: [course_approval.id],
    references: [content_index.id],
  }),
}));

export type CourseApproval = InferSelectModel<typeof course_approval>;
export type NewCourseApproval = InferInsertModel<typeof course_approval>;
