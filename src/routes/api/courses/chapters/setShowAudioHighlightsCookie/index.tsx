import type { RequestHandler } from '@builder.io/qwik-city';

export const onPost: RequestHandler = async (req) => {
  const { value } = (await req.parseBody()) as any;
  if (!value) throw req.json(400, 'Missing Value');
  req.cookie.set('showAllHighlights', value, {
    path: '/',
    maxAge: [480, 'weeks'],
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
  });
  req.json(200, 'OK');
};
