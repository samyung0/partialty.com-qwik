import defaultTheme from "tailwindcss/defaultTheme";
import { type ExtendType } from "../extend";

export default {
  fontFamily: {
    mosk: ["mosk", ...defaultTheme.fontFamily.sans],
    rubik: ["rubik", ...defaultTheme.fontFamily.sans],
    firaCode: ["Fira Code", ...defaultTheme.fontFamily.mono],
    cascadiaCode: ["Cascadia Code", ...defaultTheme.fontFamily.mono],
  },
} satisfies { fontFamily: NonNullable<ExtendType["fontFamily"]> };
