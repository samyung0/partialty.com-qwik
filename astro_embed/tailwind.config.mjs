/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        "primary-dark-gray": "#1f2937",
        "background-light-gray": "#f7f7f7",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
