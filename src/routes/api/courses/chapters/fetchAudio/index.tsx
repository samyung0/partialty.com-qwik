import type { RequestHandler } from '@builder.io/qwik-city';
import { eq } from 'drizzle-orm';
import drizzleClient from '~/utils/drizzleClient';
import { mux_assets } from '../../../../../../drizzle_turso/schema/mux_assets';

export const onPost: RequestHandler = async (req) => {
  const { audioId } = (await req.parseBody()) as any;
  if (!audioId) throw req.json(400, 'Badly formatted request.');
  const audio = (await fetch('https://api.mux.com/video/v1/assets/' + audioId, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${btoa(req.env.get('MUX_PRODUCTION_ID')! + ':' + req.env.get('MUX_PRODUCTION_SECRET')!)}`,
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .catch((e) => console.error(e))) as any;
  const filename = (
    await drizzleClient(req.env, import.meta.env.VITE_USE_PROD_DB === '1')
      .select({ filename: mux_assets.name })
      .from(mux_assets)
      .where(eq(mux_assets.id, audioId))
  )[0].filename;
  audio.filename = filename;
  req.json(200, audio);
};
