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
        "primary-dark-gray": "#1f2937",
        "background-light-gray": "#f7f7f7",
        "code-editor-one-dark-pro": "#282c34",
        yellow: "#fcd34d",
        mint: "#6fdcbf",
        "mint-up": "#a5d4bb",
        "mint-down": "#55af96",
        lilac: "#ae8fdb",
        sea: "#72cada",
        "lilac-up": "#b1b1d8",
        sherbet: "#fef8b4",
        "light-yellow": "#ffff43",
        pink: "#f7b8c2",
        rose: "#dc849b",
        marshmellow: "#d695b6",
        peach: "#f2c3c0",
        biscuit: "#ad998a",
        oat: "#cbc1bd",
        mid: "#cccccc",
        dark: "#404040",
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
    plugin(function ({ addVariant, addComponents, theme }) {
      addVariant("theme-test", ":is(.theme-test &)");
      addVariant("theme-test2", ":is(.theme-test2 &)");
      addComponents({
        ".highlight-yellow": {
          background: `url(/highlightSVG/yellow.svg)`,
          margin: "-2px -6px",
          padding: "2px  6px",
        },
        ".highlight-pink": {
          background: `url(/highlightSVG/pink.svg)`,
          margin: "-2px -6px",
          padding: "2px  6px",
        },
      });
    }),
  ],
  daisyui: {
    themes: ["light"],
    prefix: "daisyui-",
  },
};
