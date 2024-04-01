import type { RequestHandler } from '@builder.io/qwik-city';

export const onPost: RequestHandler = async (req) => {
  req.cacheControl({
    maxAge: 0,
    sMaxAge: 0,
    noStore: true,
    noCache: true,
  });
  const { courseId } = (await req.parseBody()) as any;
  if (!courseId) throw req.json(400, 'Course ID missing');
  req.cookie.delete('favourite' + courseId, {
    path: '/',
  });
  req.json(200, 'OK');
};
