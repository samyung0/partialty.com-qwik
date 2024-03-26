import type codeBlock from '~/components/_Index/codeBlock';
import { astroCodeBlankChar } from '~/components/_Index/codeBlock/astroCode';
import { qwikCodeBlankChar } from '~/components/_Index/codeBlock/qwikCode';
import { reactCodeBlankChar } from '~/components/_Index/codeBlock/reactCode';
import { reactCode2BlankChar } from './reactCode2';

export default () => {
  return {
    data: {
      astroCodeBlankChar,
      qwikCodeBlankChar,
      reactCodeBlankChar,
      reactCode2BlankChar,
    },
  } as { data: Record<`${keyof typeof codeBlock}BlankChar`, number[]> };
};
