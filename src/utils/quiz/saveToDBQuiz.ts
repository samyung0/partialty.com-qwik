import { $ } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";
import { and, eq } from "drizzle-orm";
import drizzleClient from "~/utils/drizzleClient";
import { content_user_quiz } from "../../../drizzle_turso/schema/content_user_quiz";

export default $(
  async (isCorrect: boolean, userId: string, course_id: string, chapter_id: string) => {
    const server = server$(async function (isCorrect: boolean) {
      await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === "1").transaction(async (tx) => {
        const recordExists = await tx
          .select()
          .from(content_user_quiz)
          .where(
            and(
              eq(content_user_quiz.user_id, userId),
              eq(content_user_quiz.content_id, chapter_id),
              eq(content_user_quiz.content_index_id, course_id)
            )
          );
        if (recordExists.length > 0) {
          await tx
            .update(content_user_quiz)
            .set({
              attempts: recordExists[0].attempts + 1,
              correct_attempts: recordExists[0].correct_attempts + (isCorrect ? 1 : 0),
            })
            .where(
              and(
                eq(content_user_quiz.user_id, userId),
                eq(content_user_quiz.content_id, chapter_id),
                eq(content_user_quiz.content_index_id, course_id)
              )
            );
        } else {
          await tx.insert(content_user_quiz).values({
            attempts: 1,
            correct_attempts: isCorrect ? 1 : 0,
            user_id: userId,
            content_id: chapter_id,
            content_index_id: course_id,
          });
        }
      });
    });
    await server(isCorrect);
  }
);
