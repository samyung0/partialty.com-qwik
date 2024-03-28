import react from '@astrojs/react';
import solidJs from '@astrojs/solid-js';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import qwikdev from '@qwikdev/astro';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react({
      include: ['**/react/**'],
    }),
    solidJs({
      include: ['**/solid/**'],
    }),
    svelte({
      include: ['**/svelte/**'],
    }),
    qwikdev({
      include: ['**/qwik/**'],
    }),
  ],
  output: 'server',
  adapter: vercel({
    edgeMiddleware: true,
  }),
});
