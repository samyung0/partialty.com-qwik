/** @type {import('tailwindcss').Config} */
import tailwindPlugins from "./tailwind/tailwindPlugins";
import tailwindThemes from "./tailwind/tailwindThemes/base";
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  ...tailwindThemes,
  darkMode: "class",
  plugins: [
    tailwindPlugins(),
    require("daisyui"),
    require("@tailwindcss/typography") ,
    // Method 1: directly use the variant inline: theme-test:bg-red
    // however it does not work well with prettier plugin rn
    // it automatically puts the classnames with custom variants in front of everything else
    // even though the custom variants will override the default styles which is behind

    // Method 2: conditional rendering
    // use the theme context and conditionally adds the class name after

    // check components/site/navigation for exmaples
  ],
  daisyui: {
    themes: ["light"],
    prefix: "daisyui-",
  },
};
