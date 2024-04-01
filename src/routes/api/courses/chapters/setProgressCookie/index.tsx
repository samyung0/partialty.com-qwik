import type { RequestHandler } from '@builder.io/qwik-city';

export const onPost: RequestHandler = async (req) => {
  req.cacheControl({
    maxAge: 0,
    sMaxAge: 0,
    noStore: true,
    noCache: true,
  });
  const { _progress } = (await req.parseBody()) as any;
  if (!_progress) throw req.json(400, 'Missing Progress');
  // const progress = JSON.parse(_progress)

  req.cookie.set('progress', _progress, {
    path: '/',
    maxAge: [480, 'weeks'],
    httpOnly: false,
    sameSite: 'lax',
    secure: true,
  });
  req.json(200, 'OK');
};
