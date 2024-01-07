import type codeBlock from "~/components/_Index/codeBlock";
import astroCode from "~/components/_Index/codeBlock/astroCode";
import qwikCode from "~/components/_Index/codeBlock/qwikCode";
import reactCode from "~/components/_Index/codeBlock/reactCode";
import renderIndexCodeBlock from "~/utils/shikiji/renderIndexCodeBlock";

export default async () => {
  return {
    data: {
      astroCodeRendered: await renderIndexCodeBlock({ code: astroCode }),
      qwikCodeRendered: await renderIndexCodeBlock({ code: qwikCode }),
      reactCodeRendered: await renderIndexCodeBlock({ code: reactCode }),
    },
  } as { data: Record<`${keyof typeof codeBlock}Rendered`, string> };
};
