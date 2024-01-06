/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin";
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        mosk: [
          "mosk",
          "-apple-system",
          "BlinkMacSystemFont",
          "Helvetica Neue",
          "Segoe UI",
          "Arial",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
        ],
        rubik: [
          "rubik",
          "-apple-system",
          "BlinkMacSystemFont",
          "Helvetica Neue",
          "Segoe UI",
          "Arial",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
        ],
        firaCode: [
          "Fira Code",
          "Menlo",
          "Monaco",
          "Lucida Console",
          "Liberation Mono",
          "DejaVu Sans Mono",
          "Bitstream Vera Sans Mono",
          "Courier New",
          "monospace",
        ],
        cascadiaCode: [
          "Cascadia Code",
          "Menlo",
          "Monaco",
          "Lucida Console",
          "Liberation Mono",
          "DejaVu Sans Mono",
          "Bitstream Vera Sans Mono",
          "Courier New",
          "monospace",
        ],
      },
      colors: {
        "primary-dark-gray": "#3e3e3e",
        "background-white": "#fff",
        "background-light-gray": "#f7f7f7",
        // "background-dark-gray": "#29272a",
        "code-editor-one-dark-pro": "#282c34",
        "background-yellow": "#fcd34d",
        mint: "#6fdcbf",
        "mint-up": "#a5d4bb",
        "mint-down": "#55af96",
        lilac: "#ae8fdb",
        sea: "#72cada",
        highlight: "#ae8fdb",
        "lilac-up": "#b1b1d8",
        sherbet: "#fef8b4",
        rose: "#dc849b",
        marshmellow: "#d695b6",
        peach: "#f2c3c0",
        biscuit: "#ad998a",
        oat: "#cbc1bd",
        mid: "#cccccc",
        "dark-down": "#303145",
      },
    },
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
