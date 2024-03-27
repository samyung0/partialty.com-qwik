import { nodeServerAdapter } from '@builder.io/qwik-city/adapters/node-server/vite';
import { extendConfig } from '@builder.io/qwik-city/vite';
import baseConfig from '../../vite.config';

export default extendConfig(baseConfig, () => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ['src/entry.fastify.tsx', '@qwik-city-plan'],
      },
    },
    plugins: [
      nodeServerAdapter({
        name: 'fastify',
        ssg: {
          include: ['/*'],
          exclude: [
            '/contenteditor',
            '/creator',
            '/members',
            '/profile',
            '/uploadRepo',
            '/',
            '/signup',
            '/login',
            // '/courses',
            "/courses/*/chapters",
            '/catalog',
            '/unauth',
            '/purchase',
          ],
          origin: 'https://www.partialty.com',
          sitemapOutFile: 'sitemap.xml',
        },
      }),
    ],
  };
});
