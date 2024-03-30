import { $ } from '@builder.io/qwik';
import type { RequestEventBase } from '@builder.io/qwik-city';
import { eq } from 'drizzle-orm';
import drizzleClient from '~/utils/drizzleClient';
import getSQLTimeStamp from '~/utils/getSQLTimeStamp';
import { course_approval } from '../../../../../../../drizzle_turso/schema/course_approval';

export default $(async (event: RequestEventBase, userRole: string, approvalId: string, rejected_reason: string) => {
  if (userRole !== 'admin') throw new Error('Unexpected!');
  await drizzleClient(event.env, import.meta.env.VITE_USE_PROD_DB === '1').transaction(async (tx) => {
    await tx
      .update(course_approval)
      .set({ status: 'rejected', updated_at: getSQLTimeStamp(), rejected_reason })
      .where(eq(course_approval.id, approvalId));
  });
});
