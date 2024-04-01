import type { RequestHandler } from '@builder.io/qwik-city';

export const onGet: RequestHandler = async (req) => {
  req.cacheControl({
    maxAge: 0,
    sMaxAge: 0,
    noStore: true,
    noCache: true,
  });
  req.json(200, req.cookie.get('showAllHighlights')?.value);
};
