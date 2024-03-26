import { type BaseType } from './base';
import ExtendAnimation from './extend/animation';
import ExtendColor from './extend/colors';
import ExtendFontFamily from './extend/fontFamily';
import ExtendKeyframes from './extend/keyframes';

const extendedTheme = {
  extend: { ...ExtendColor, ...ExtendFontFamily, ...ExtendAnimation, ...ExtendKeyframes },
} satisfies { extend: ExtendType };

export default extendedTheme;
export type ExtendType = NonNullable<BaseType['extend']>;
