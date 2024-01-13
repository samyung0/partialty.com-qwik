import { type BaseType } from "./base";
import ExtendColor from "./extend/color";
import ExtendFontFamily from "./extend/fontFamily";

const extendedTheme = {
  extend: { ...ExtendColor, ...ExtendFontFamily },
} satisfies { extend: ExtendType };

export default extendedTheme;
export type ExtendType = NonNullable<BaseType["extend"]>;
