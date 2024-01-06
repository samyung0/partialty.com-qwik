import { astroCodeRendered } from "~/components/_Index/codeBlock/astroCode";
import { qwikCodeRendered } from "~/components/_Index/codeBlock/qwikCode";
import { reactCodeRendered } from "~/components/_Index/codeBlock/reactCode";

export default {
  astroCodeRendered,
  qwikCodeRendered,
  reactCodeRendered,
} as Record<string, string>;
