/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin";
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    require("daisyui"),
    // Method 1: directly use the variant inline: theme-test:bg-red
    // however it does not work well with prettier plugin rn
    // it automatically puts the classnames with custom variants in front of everything else
    // even though the custom variants will override the default styles which is behind

    // Method 2: conditional rendering
    // use the theme context and conditionally adds the class name after

    // check components/site/navigation for exmaples
    plugin(function ({ addVariant }) {
      addVariant("theme-test", ":is(.theme-test &)");
    }),
    plugin(function ({ addVariant }) {
      addVariant("theme-test2", ":is(.theme-test2 &)");
    }),
  ],
  daisyui: {
    themes: ["light"],
    prefix: "daisyui-",
  },
};
