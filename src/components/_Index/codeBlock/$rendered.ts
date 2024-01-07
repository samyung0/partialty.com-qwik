import type codeBlock from "~/components/_Index/codeBlock";
import { astroCodeRendered } from "~/components/_Index/codeBlock/astroCode";
import { qwikCodeRendered } from "~/components/_Index/codeBlock/qwikCode";
import { reactCodeRendered } from "~/components/_Index/codeBlock/reactCode";

export default async () => {
  return {
    data: {
      astroCodeRendered: await astroCodeRendered,
      qwikCodeRendered: await qwikCodeRendered,
      reactCodeRendered: await reactCodeRendered,
    },
  } as { data: Record<`${keyof typeof codeBlock}Rendered`, string> };
};
