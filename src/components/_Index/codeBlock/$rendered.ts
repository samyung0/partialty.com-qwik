import type codeBlock from '~/components/_Index/codeBlock';
import astroCode from '~/components/_Index/codeBlock/astroCode';
import qwikCode from '~/components/_Index/codeBlock/qwikCode';
import reactCode from '~/components/_Index/codeBlock/reactCode';
import reactCode2 from '~/components/_Index/codeBlock/reactCode2';
import renderIndexCodeBlock from '~/utils/shikiji/renderIndexCodeBlock';

export default async () => {
  return {
    data: {
      astroCodeRendered: await renderIndexCodeBlock({ code: astroCode }),
      qwikCodeRendered: await renderIndexCodeBlock({ code: qwikCode }),
      reactCodeRendered: await renderIndexCodeBlock({ code: reactCode }),
      reactCode2Rendered: await renderIndexCodeBlock({ code: reactCode2 }),
    },
  } as { data: Record<`${keyof typeof codeBlock}Rendered`, string> };
};
