import { $ } from '@builder.io/qwik';
import type { RequestEventBase } from '@builder.io/qwik-city';
import { eq, or } from 'drizzle-orm';
import drizzleClient from '~/utils/drizzleClient';
import getSQLTimeStamp from '~/utils/getSQLTimeStamp';
import { content_category } from '../../../../../../../drizzle_turso/schema/content_category';
import { course_approval } from '../../../../../../../drizzle_turso/schema/course_approval';
import { tag } from '../../../../../../../drizzle_turso/schema/tag';

export default $(
  async (
    event: RequestEventBase,
    userRole: string,
    addedCategory: string | null,
    addedTags: string[],
    approvalId: string
  ) => {
    if (userRole !== 'admin') throw new Error('Unexpected!');
    await drizzleClient(event.env, import.meta.env.VITE_USE_PROD_DB === '1').transaction(async (tx) => {
      if (addedCategory)
        await tx.update(content_category).set({ approved: true }).where(eq(content_category.id, addedCategory));
      if (addedTags.length > 0)
        await tx
          .update(tag)
          .set({ approved: true })
          .where(or(...addedTags.map((tagId) => eq(tag.id, tagId))));
      await tx
        .update(course_approval)
        .set({ status: 'approved', updated_at: getSQLTimeStamp(), added_categories: null, added_tags: [] })
        .where(eq(course_approval.id, approvalId));
    });
  }
);
