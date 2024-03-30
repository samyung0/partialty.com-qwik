import { $ } from '@builder.io/qwik';
import type { RequestEventLoader } from '@builder.io/qwik-city';
import drizzleClient from '~/utils/drizzleClient';
import { content_category } from '../../../drizzle_turso/schema/content_category';
import { tag } from '../../../drizzle_turso/schema/tag';

export const tagLoader = $(async (event: RequestEventLoader) => {
  return await drizzleClient(event.env, import.meta.env.VITE_USE_PROD_DB === '1')
    .select()
    .from(tag);
});

export const categoryLoader = $(async (event: RequestEventLoader) => {
  return await drizzleClient(event.env, import.meta.env.VITE_USE_PROD_DB === '1')
    .select()
    .from(content_category);
});
