/** @type {import('tailwindcss').Config} */
import merge from 'lodash.merge';
import tailwindPlugins from './tailwind/tailwindPlugins';
import tailwindThemes from './tailwind/tailwindThemes/base';
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './node_modules/flowbite/**/*.js'],
  ...merge(tailwindThemes, {
    theme: {
      container: {
        center: true,
        padding: '2rem',
        screens: {
          '2xl': '1400px',
        },
      },
      extend: {
        colors: {
          border: 'hsl(var(--border))',
          input: 'hsl(var(--input))',
          ring: 'hsl(var(--ring))',
          background: 'hsl(var(--background))',
          foreground: 'hsl(var(--foreground))',
          primary: {
            DEFAULT: 'hsl(var(--primary))',
            foreground: 'hsl(var(--primary-foreground))',
          },
          secondary: {
            DEFAULT: 'hsl(var(--secondary))',
            foreground: 'hsl(var(--secondary-foreground))',
          },
          destructive: {
            DEFAULT: 'hsl(var(--destructive))',
            foreground: 'hsl(var(--destructive-foreground))',
          },
          muted: {
            DEFAULT: 'hsl(var(--muted))',
            foreground: 'hsl(var(--muted-foreground))',
          },
          accent: {
            DEFAULT: 'hsl(var(--accent))',
            foreground: 'hsl(var(--accent-foreground))',
          },
          popover: {
            DEFAULT: 'hsl(var(--popover))',
            foreground: 'hsl(var(--popover-foreground))',
          },
          card: {
            DEFAULT: 'hsl(var(--card))',
            foreground: 'hsl(var(--card-foreground))',
          },
        },
        borderRadius: {
          xl: `calc(var(--radius) + 4px)`,
          lg: 'var(--radius)',
          md: 'calc(var(--radius) - 2px)',
          sm: 'calc(var(--radius) - 4px)',
        },
        keyframes: {
          'accordion-down': {
            from: { height: '0' },
            to: { height: 'var(--radix-accordion-content-height)' },
          },
          'accordion-up': {
            from: { height: 'var(--radix-accordion-content-height)' },
            to: { height: '0' },
          },
        },
        animation: {
          'accordion-down': 'accordion-down 0.2s ease-out',
          'accordion-up': 'accordion-up 0.2s ease-out',
        },
      },
    },
  }),
  darkMode: 'class',
  plugins: [
    tailwindPlugins(),
    // require("daisyui"),
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
    addVariablesForColors
    // Method 1: directly use the variant inline: theme-test:bg-red
    // however it does not work well with prettier plugin rn
    // it automatically puts the classnames with custom variants in front of everything else
    // even though the custom variants will override the default styles which is behind

    // Method 2: conditional rendering
    // use the theme context and conditionally adds the class name after

    // check components/site/navigation for exmaples
  ],
  // daisyui: {
  //   themes: ["light"],
  //   prefix: "daisyui-",
  // },
};

function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );
 
  addBase({
    ":root": newVars,
  });
}
