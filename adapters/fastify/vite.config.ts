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
          include: [
            '/courses/*',
            '/',
            '/donate',
            '/contact',
            '/contribute',
            '/suggestion',
            '/privacy',
            '/terms',
            '/cookie-policy',
            '/faq'
          ],
          origin: 'https://www.partialty.com',
          sitemapOutFile: 'sitemap-ssg.xml',
        },
      }),
    ],
  };
});
