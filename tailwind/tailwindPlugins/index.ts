import plugin from "tailwindcss/plugin";
import Components from "./components";
import Variants from "./variants";

export default () =>
  plugin(function ({ addVariant, addComponents, theme }) {
    Variants(addVariant, theme);
    Components(addComponents, theme);
  });

export type Theme = Parameters<Parameters<typeof plugin>[0]>[0]["theme"];
export type AddComponents = Parameters<Parameters<typeof plugin>[0]>[0]["addComponents"];
export type AddVariant = Parameters<Parameters<typeof plugin>[0]>[0]["addVariant"];
