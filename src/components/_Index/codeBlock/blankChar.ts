import type codeBlock from "~/components/_Index/codeBlock";
import { astroCodeBlankChar } from "~/components/_Index/codeBlock/astroCode";
import { qwikCodeBlankChar } from "~/components/_Index/codeBlock/qwikCode";
import { reactCodeBlankChar } from "~/components/_Index/codeBlock/reactCode";

export default {
  astroCodeBlankChar,
  qwikCodeBlankChar,
  reactCodeBlankChar,
} as Record<`${keyof typeof codeBlock}BlankChar`, number[]>;
